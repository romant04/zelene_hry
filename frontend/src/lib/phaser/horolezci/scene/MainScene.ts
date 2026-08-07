import Phaser from 'phaser';
import { Player } from '$lib/phaser/horolezci/scene/Player';
import Pyramid from '$lib/phaser/horolezci/scene/Pyramid';
import { Secret } from '$lib/phaser/horolezci/scene/Secret';
import type { Socket } from 'socket.io-client';
import type { HorolezciGameState } from '$lib/phaser/horolezci/types/horolezciGameState';
import { horolezciStats } from '../../../../stores/horolezci/stats';
import { rowToMultiplier } from '$lib/phaser/horolezci/utils/rowToMultiplier';
import { get } from 'svelte/store';

const MOUNTAIN_HEIGHT_MULTIPLIER = 2.5;
const TOP_OF_THE_MOUNTAIN = 728 * 2.5 - 360;
const PLAYER_START = 1800;
const PLAYER_END = PLAYER_START - TOP_OF_THE_MOUNTAIN;

export default class MainScene extends Phaser.Scene {
	private socket: Socket;
	private token: string;
	private player: Player | undefined;
	private enemy: Player | undefined;
	private pyramid: Pyramid | undefined;
	private secret: Secret | undefined;

	setupListeners() {
		this.socket.on('gameState', (data: HorolezciGameState) => {
			this.initGameState(data);
		});

		this.socket.on('newRound', (data: HorolezciGameState) => {
			this.restartPyramidAndTimer(data);
			this.pyramid?.show();
			this.secret?.show();
		});
		this.socket.on(
			'roundEnded',
			(data: { data: HorolezciGameState; playerGuess: string; enemyGuess: string }) => {
				const playerDistanceToTravel =
					data.data.players.find((player) => player.token === this.token)!
						.distanceTraveled - this.player!.distanceTraveled;

				const enemyDistanceToTravel =
					data.data.players.find((player) => player.token !== this.token)!
						.distanceTraveled - this.enemy!.distanceTraveled;

				this.pyramid?.clearSelection();
				this.secret?.updateGuessedLetters(new Set(data.data.guessedLetters));
				console.log(data.playerGuess); // TODO: Display the player's guess in the UI
				console.log(data.enemyGuess);

				setTimeout(() => {
					this.pyramid?.hide();
					this.secret?.hide();
				}, 500);
				setTimeout(() => {
					this.player?.climb(playerDistanceToTravel);
					this.enemy?.climb(enemyDistanceToTravel);
				}, 1000);
			}
		);
	}
	restartPyramidAndTimer(data: HorolezciGameState) {
		this.pyramid!.setAllRowsLetters(data.pyramid);
		horolezciStats.set({
			player: {
				distanceTraveled:
					data.players.find((player) => player.token === this.token)?.distanceTraveled ??
					0,
				safetyPins:
					data.players.find((player) => player.token === this.token)?.safetyPins ?? 3
			},
			enemy: {
				distanceTraveled:
					data.players.find((player) => player.token !== this.token)?.distanceTraveled ??
					0,
				safetyPins:
					data.players.find((player) => player.token !== this.token)?.safetyPins ?? 3
			},
			endTime: data.roundEndTime
		});
	}
	initGameState(data: HorolezciGameState) {
		const playerDistanceTraveled =
			data.players.find((player) => player.token === this.token)?.distanceTraveled ?? 0;
		const enemyDistanceTraveled =
			data.players.find((player) => player.token !== this.token)?.distanceTraveled ?? 0;

		this.player!.y = PLAYER_START - playerDistanceTraveled;
		this.enemy!.y = PLAYER_START - enemyDistanceTraveled;
		this.pyramid!.setAllRowsLetters(data.pyramid);
		this.secret!.updateSecret(data.secret);
		this.secret?.updateGuessedLetters(new Set(data.guessedLetters));

		horolezciStats.set({
			player: {
				distanceTraveled: playerDistanceTraveled,
				safetyPins:
					data.players.find((player) => player.token === this.token)?.safetyPins ?? 3
			},
			enemy: {
				distanceTraveled: enemyDistanceTraveled,
				safetyPins:
					data.players.find((player) => player.token !== this.token)?.safetyPins ?? 3
			},
			endTime: data.roundEndTime
		});

		this.pyramid?.show();
		this.secret?.show();
	}

	constructor(socket: Socket, token: string) {
		super('MainScene');
		this.socket = socket;
		this.token = token;
		this.setupListeners();
	}

	preload() {
		this.anims.create({
			key: 'player_climb', // Animation identifier
			frames: [
				{ key: 'player01' },
				{ key: 'player02' },
				{ key: 'player03' },
				{ key: 'player04' },
				{ key: 'player05' },
				{ key: 'player06' },
				{ key: 'player07' }
			],
			frameRate: 7, // Playback speed (frames per second)
			repeat: -1 // -1 loops infinitely
		});

		this.anims.create({
			key: 'enemy_climb',
			frames: [
				{ key: 'enemy01' },
				{ key: 'enemy02' },
				{ key: 'enemy03' },
				{ key: 'enemy04' },
				{ key: 'enemy05' },
				{ key: 'enemy06' },
				{ key: 'enemy07' }
			],
			frameRate: 7,
			repeat: -1
		});
	}

	create() {
		const screenWidth = this.scale.width;
		const screenHeight = this.scale.height;

		// 1. Add background
		const mountain = this.add.image(screenWidth / 2, 0, 'mountain').setOrigin(0.5, 0);
		mountain.setDisplaySize(screenWidth * 0.75, screenHeight * MOUNTAIN_HEIGHT_MULTIPLIER);

		// 2. Add player as a Sprite
		const groundY = mountain.displayHeight;
		this.player = new Player(this, screenWidth / 2 - 100, groundY, false, PLAYER_END);
		this.enemy = new Player(this, screenWidth / 2 + 100, groundY, true, PLAYER_END);

		this.pyramid = new Pyramid(this, screenWidth / 2, screenHeight * 0.4);
		this.pyramid.onSelectionChange = (button) => {
			this.socket.emit('lockInGuess', {
				letter: button?.letter,
				scoreMultiplier: rowToMultiplier(button?.row ?? 0)
			});
		};

		this.secret = new Secret(this, 0, screenHeight - 200, '');

		// 4. Setup camera bounds & tracking
		this.cameras.main.setBounds(0, 0, mountain.displayWidth, mountain.displayHeight);
		this.cameras.main.startFollow(this.player);

		this.socket.emit('getGameState');
		this.socket.emit('setReadyForNextRound');
		this.socket.emit('startNextRound');
	}
}
