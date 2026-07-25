import Phaser from 'phaser';
import { Letters } from '$lib/phaser/slovniFotbal/scene/Letters';
import { Balls } from '$lib/phaser/slovniFotbal/scene/Balls';
import type { Socket } from 'socket.io-client';
import { score } from '../../../../stores/slovni-fotbal/score';
import { get } from 'svelte/store';
import { FloatingText } from '$lib/phaser/slovniFotbal/scene/FloatingText';
import type { SlovniFotbalGameState } from '$lib/phaser/slovniFotbal/types/slovniFotbalGameState';

export default class MainScene extends Phaser.Scene {
	private socket: Socket;
	private token: string;
	private balls: Balls | undefined;
	private text: FloatingText | undefined;
	private pendingGameState: SlovniFotbalGameState | null = null;

	private setupListeners() {
		this.socket.on(
			'guessResult',
			(data: { message: string; correct: boolean; score?: number }) => {
				this.text!.setMessage(data.message, data.correct ? 'success' : 'error');
				this.text!.show();

				if (data.correct && data.score !== undefined) {
					this.balls!.setBottomSnakeFilled(data.score);
					score.update((currentScore) => ({
						...currentScore,
						player: {
							score: data.score!,
							goals: currentScore.player.goals
						}
					}));
					this.checkGoalsPlayer();
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

		this.socket.on('gameState', (data: SlovniFotbalGameState) => {
			this.initGameState(data);
		});
	}

	private initGameState(data: SlovniFotbalGameState) {
		console.log(data);
		const player = data.players.find((p) => p.token === this.token);
		const enemy = data.players.find((p) => p.token !== this.token);

		if (!player || !enemy) {
			console.error('Player or enemy not found in game state');
			return;
		}

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

		console.log(this.balls);
		this.balls?.setBottomSnakeFilled(player.score);
		this.balls?.setTopSnakeFilled(enemy.score);
	}

	constructor(socket: Socket, token: string) {
		super('MainScene');
		this.socket = socket;
		this.token = token;
		this.setupListeners();
	}

	create() {
		const { width, height } = this.cameras.main;
		const bg = this.add.image(width / 2, height / 2, 'hriste');

		// Calculate the scale ratio
		const scaleX = width / bg.width;
		const scaleY = height / bg.height;
		const scale = Math.max(scaleX, scaleY);

		bg.setScale(scale).setScrollFactor(0);

		this.balls = new Balls(this, width / 2, height / 2, width, height);
		new Letters(this, width / 2, height / 2, this.handleWordSelected.bind(this));
		this.text = new FloatingText(this, width / 2, height / 2, '', 'success');

		this.socket.emit('getGameState');
	}

	private handleWordSelected(word: string) {
		// Emit the selected word to the server
		this.socket.emit('guessWord', word);
	}

	private checkGoalsPlayer() {
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
			this.socket.emit('goalScored', overflow);
			this.balls!.setBottomSnakeFilled(overflow); // Reset the bottom snake to the overflow value
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
