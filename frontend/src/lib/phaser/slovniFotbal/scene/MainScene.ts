import Phaser from 'phaser';
import { Letters } from '$lib/phaser/slovniFotbal/scene/Letters';
import { Balls } from '$lib/phaser/slovniFotbal/scene/Balls';
import type { Socket } from 'socket.io-client';
import { score } from '../../../../stores/slovni-fotbal/score';
import { get } from 'svelte/store';
import { FloatingText } from '$lib/phaser/slovniFotbal/scene/FloatingText';
import type { SlovniFotbalGameState } from '$lib/phaser/slovniFotbal/types/slovniFotbalGameState';
import { endTime } from '../../../../stores/slovni-fotbal/timer';
import { gameOver, toggleGameOverOn } from '../../../../stores/gameGeneral/game-over';
import { setDisconnect } from '../../../../stores/gameGeneral/disconnect';
import { volume } from '../../../../stores/gameGeneral/volume';

export default class MainScene extends Phaser.Scene {
	private socket: Socket;
	private token: string;
	private balls: Balls | undefined;
	private text: FloatingText | undefined;
	private letters: Letters | undefined;
	private pendingGameState: SlovniFotbalGameState | null = null;

	private showLetters() {
		if (this.letters) {
			this.letters.visible = true;
			this.tweens.add({
				targets: this.letters,
				scale: 1,
				duration: 300,
				ease: 'Power2'
			});
		}
	}

	private setupListeners() {
		this.socket.on(
			'guessResult',
			async (data: { message: string; correct: boolean; score?: number }) => {
				if (data.correct && data.score !== undefined) {
					this.text!.setMessage(data.message, 'success');
					this.text!.show();

					score.update((currentScore) => ({
						...currentScore,
						player: {
							score: data.score!,
							goals: currentScore.player.goals
						}
					}));

					await this.balls!.setBottomSnakeFilled(data.score);
					await this.checkGoalsPlayer();
					this.showLetters();
				}

				if (!data.correct) {
					this.text!.setMessage(data.message, 'error');
					this.text!.show();
					await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
					this.showLetters();
				}
			}
		);
		this.socket.on('enemyGuessed', (data: { word: string; score: number }) => {
			this.balls!.setTopSnakeFilled(data.score);
			score.update((currentScore) => ({
				...currentScore,
				enemy: {
					score: data.score,
					goals: currentScore.enemy.goals
				}
			}));
			this.checkGoalsEnemy();
		});
		this.socket.on('enemyGoalUpdate', (data: { goals: number; score: number }) => {
			score.update((currentScore) => ({
				...currentScore,
				enemy: {
					score: data.score,
					goals: data.goals
				}
			}));
			this.balls!.setTopSnakeFilled(data.score);
		});
		this.socket.on('gameover', () => {
			this.tweens.add({
				targets: this.music,
				volume: 0,
				duration: 500,
				onComplete: () => {
					this.music?.stop();
				}
			});

			this.socket.emit('requestGameOverData');
			this.hideLetters();
			this.text!.setMessage('Čas vypršel, konec hry!');
			this.text!.show();
		});
		this.socket.on(
			'gameoverData',
			async (winner: { id: number; name: string; score: number; goals: number } | null) => {
				console.log('Game over data received:', winner);
				await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
				toggleGameOverOn(winner === null ? 'Remíza' : winner.name);
			}
		);

		this.socket.on('playerDisconnected', () => {
			setDisconnect(true);
		});
		this.socket.on('playerReconnected', () => {
			setDisconnect(false);
		});

		this.socket.on('gameState', (data: SlovniFotbalGameState) => {
			this.initGameState(data);
		});
	}

	private initGameState(data: SlovniFotbalGameState) {
		const player = data.players.find((p) => p.token === this.token);
		const enemy = data.players.find((p) => p.token !== this.token);

		if (!player || !enemy) {
			console.error('Player or enemy not found in game state');
			return;
		}

		endTime.set(data.endTime);
		this.letters?.setLetters(data.letters);

		score.set({
			player: {
				score: player.score,
				goals: player.goals
			},
			enemy: {
				score: enemy.score,
				goals: enemy.goals
			}
		});

		this.balls?.setBottomSnakeFilledInsta(player.score);
		this.balls?.setTopSnakeFilled(enemy.score);
	}

	constructor(socket: Socket, token: string) {
		super('MainScene');
		this.socket = socket;
		this.token = token;
		this.setupListeners();
	}

	preload() {
		setDisconnect(false); // Reset disconnect state when the scene is loaded
		gameOver.set({ winner: '', gameOver: false }); // Reset game over state when the scene is loaded

		const g = this.make.graphics(undefined, false);

		g.fillStyle(0xffffff);
		g.fillRect(0, 0, 3, 8);

		g.generateTexture('particle', 8, 8);
		g.destroy();

		this.sound.volume = get(volume) / 100;
		volume.subscribe((value) => {
			this.sound.volume = value / 100;
		});
	}

	private music: Phaser.Sound.BaseSound | undefined;
	create() {
		const { width, height } = this.cameras.main;
		const bg = this.add.image(width / 2, height / 2, 'hriste');

		// Calculate the scale ratio
		const scaleX = width / bg.width;
		const scaleY = height / bg.height;
		const scale = Math.max(scaleX, scaleY);

		bg.setScale(scale).setScrollFactor(0);

		this.music = this.sound.add('bg', {
			loop: true,
			volume: 0.1
		});
		this.music.play();

		this.balls = new Balls(this, width / 2, height / 2, width, height);
		this.letters = new Letters(this, width / 2, height / 2, this.handleWordSelected.bind(this));
		this.text = new FloatingText(this, width / 2, height / 2, '', 'success');

		this.socket.emit('getGameState');
	}

	private hideLetters() {
		if (this.letters) {
			this.tweens.add({
				targets: this.letters,
				scale: 0,
				duration: 300,
				ease: 'Power2',
				onComplete: () => {
					this.letters!.visible = false;
				}
			});
		}
	}
	private handleWordSelected(word: string) {
		// Emit the selected word to the server
		this.socket.emit('guessWord', word);
		this.hideLetters();
	}

	private async checkGoalsPlayer() {
		if (get(score).player.score >= 10) {
			const overflow = get(score).player.score - 10;
			score.update((currentScore) => ({
				...currentScore,
				player: {
					...currentScore.player,
					score: overflow,
					goals: currentScore.player.goals + 1
				}
			}));
			console.log(`Player scored a goal! Total goals: ${get(score).player.goals}`);
			this.socket.emit('goalScored', overflow);
			this.balls!.resetBottomBalls();
			await this.balls!.setBottomSnakeFilled(overflow); // Reset the bottom snake to the overflow value
		}
	}
	private checkGoalsEnemy() {
		if (get(score).enemy.score >= 10) {
			const overflow = get(score).enemy.score - 10;
			score.update((currentScore) => ({
				...currentScore,
				enemy: {
					...currentScore.enemy,
					score: overflow,
					goals: currentScore.enemy.goals + 1
				}
			}));
			this.balls!.setTopSnakeFilled(overflow); // Reset the top snake to the overflow value
		}
	}
}
