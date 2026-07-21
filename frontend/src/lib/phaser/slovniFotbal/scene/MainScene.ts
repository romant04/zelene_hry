import Phaser from 'phaser';
import { Letters } from '$lib/phaser/slovniFotbal/scene/Letters';
import { Balls } from '$lib/phaser/slovniFotbal/scene/Balls';
import type { Socket } from 'socket.io-client';
import { addToast } from '../../../../stores/toast';
import { score } from '../../../../stores/slovni-fotbal/score';
import { get } from 'svelte/store';

export default class MainScene extends Phaser.Scene {
	private socket: Socket;
	private token: string;
	private balls: Balls | undefined;

	constructor(socket: Socket, token: string) {
		super('MainScene');
		this.socket = socket;
		this.token = token;

		this.socket.on(
			'guessResult',
			(data: { message: string; correct: boolean; score?: number }) => {
				addToast(data.message, data.correct ? 'success' : 'warning');

				if (data.correct && data.score !== undefined) {
					this.balls!.setBottomSnakeFilled(data.score);
					score.update((currentScore) => ({
						...currentScore,
						player: {
							wordsFound: currentScore.player.wordsFound + 1,
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
					wordsFound: currentScore.enemy.wordsFound + 1,
					score: data.score,
					goals: currentScore.enemy.goals
				}
			}));
			this.checkGoalsEnemy();
		});
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
