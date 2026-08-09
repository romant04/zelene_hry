import Phaser from 'phaser';
import { Player } from '$lib/phaser/horolezci/scene/Player';
import Pyramid from '$lib/phaser/horolezci/scene/Pyramid';
import { Secret } from '$lib/phaser/horolezci/scene/Secret';
import type { Socket } from 'socket.io-client';
import type {
	HorolezciGameState,
	HorolezciPlayer
} from '$lib/phaser/horolezci/types/horolezciGameState';
import { distanceToTravel, horolezciStats } from '../../../../stores/horolezci/stats';
import { rowToMultiplier } from '$lib/phaser/horolezci/utils/rowToMultiplier';
import { setDisconnect } from '../../../../stores/gameGeneral/disconnect';
import { gameOver, toggleGameOverOn } from '../../../../stores/gameGeneral/game-over';
import { get } from 'svelte/store';
import { volume } from '../../../../stores/gameGeneral/volume';

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

		this.socket.on('newRound', (data: { data: HorolezciGameState; newSecret: boolean }) => {
			distanceToTravel.set(null);
			this.restartPyramidAndTimer(data.data);
			if (data.newSecret) {
				this.secret?.updateSecret(data.data.secret.secret);
				this.secret?.updateGuessedLetters(new Set(data.data.guessedLetters));
				this.secret?.updateTitle(data.data.secret.type);
			}
			this.pyramid?.show();
			this.secret?.show();
		});
		this.socket.on(
			'roundEnded',
			(data: {
				data: HorolezciGameState;
				playerGuess: string;
				enemyGuess: string;
				playerToken: string;
				enemyToken: string;
				playerSafety: boolean;
				enemySafety: boolean;
			}) => {
				const playerDistanceToTravel =
					data.data.players.find((player) => player.token === this.token)!
						.distanceTraveled - this.player!.distanceTraveled;
				const enemyDistanceToTravel =
					data.data.players.find((player) => player.token !== this.token)!
						.distanceTraveled - this.enemy!.distanceTraveled;

				const mySafety =
					data.playerToken === this.token ? data.playerSafety : data.enemySafety;
				const enemySafety =
					data.playerToken === this.token ? data.enemySafety : data.playerSafety;

				distanceToTravel.set({
					player: mySafety ? null : playerDistanceToTravel,
					enemy: enemySafety ? null : enemyDistanceToTravel
				});
				if (mySafety) {
					this.player?.placeSafetyPin();
					this.pyramid?.resetSafetyPinSelection();
					this.sound.play('checkpoint', { volume: 0.5, loop: false });

					horolezciStats.update((stats) => {
						const playerStats = stats.player;
						const updatedPlayerStats = {
							...playerStats,
							safetyPins: playerStats.safetyPins - 1
						};
						return {
							...stats,
							player: updatedPlayerStats
						};
					});

					if (get(horolezciStats).player.safetyPins === 0) {
						this.pyramid?.disableSafetyPinButton();
					}
				}
				if (enemySafety) {
					this.enemy?.placeSafetyPin();
					this.sound.play('checkpoint', { volume: 0.5, loop: false });
					horolezciStats.update((stats) => {
						const enemyStats = stats.enemy;
						const updatedEnemyStats = {
							...enemyStats,
							safetyPins: enemyStats.safetyPins - 1
						};
						return {
							...stats,
							enemy: updatedEnemyStats
						};
					});
				}

				this.pyramid?.highlightSelection(playerDistanceToTravel > 0);

				// Check if all correct letters have been guessed
				this.secret?.updateGuessedLetters(new Set(data.data.guessedLetters));
				const sentenceGuessed = data.data.correctLetters.every((letter) =>
					data.data.guessedLetters.includes(letter)
				);
				if (sentenceGuessed) {
					this.secret?.celebrateComplete();
				}

				setTimeout(
					() => {
						this.pyramid?.hide();
						this.secret?.hide();
						this.pyramid?.clearSelection();
					},
					sentenceGuessed ? 4000 : 2300
				);
				setTimeout(
					() => {
						this.player?.climb(playerDistanceToTravel);
						this.enemy?.climb(enemyDistanceToTravel);
					},
					sentenceGuessed ? 4800 : 3000
				);
			}
		);

		this.socket.on('playerDisconnected', () => {
			setDisconnect(true);
		});
		this.socket.on('playerReconnected', () => {
			setDisconnect(false);
		});
		this.socket.on('gameOver', async (data: { winner: HorolezciPlayer | null }) => {
			await new Promise((resolve) => setTimeout(resolve, 5800));
			toggleGameOverOn(data.winner === null ? 'Remíza' : data.winner.name);
		});
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
		const player = data.players.find((player) => player.token === this.token);
		const enemy = data.players.find((player) => player.token !== this.token);

		const playerDistanceTraveled = player?.distanceTraveled ?? 0;
		const enemyDistanceTraveled = enemy?.distanceTraveled ?? 0;

		this.player!.updatePosition(PLAYER_START - playerDistanceTraveled);
		this.enemy!.updatePosition(PLAYER_START - enemyDistanceTraveled);
		this.pyramid!.setAllRowsLetters(data.pyramid);
		this.secret!.updateSecret(data.secret.secret);
		this.secret?.updateTitle(data.secret.type);
		this.secret?.updateGuessedLetters(new Set(data.guessedLetters));

		if (player?.lastSafetyPin !== 0) {
			this.player?.placeSafetyPin(player?.lastSafetyPin);
		}
		if (enemy?.lastSafetyPin !== 0) {
			this.enemy?.placeSafetyPin(enemy?.lastSafetyPin);
		}

		if (player?.safetyPins === 0) {
			this.pyramid?.disableSafetyPinButton();
		}

		horolezciStats.set({
			player: {
				distanceTraveled: playerDistanceTraveled,
				safetyPins:
					data.players.find((player) => player.token === this.token)?.safetyPins ?? 2
			},
			enemy: {
				distanceTraveled: enemyDistanceTraveled,
				safetyPins:
					data.players.find((player) => player.token !== this.token)?.safetyPins ?? 2
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
		setDisconnect(false); // Reset disconnect state when the scene is loaded
		gameOver.set({ winner: '', gameOver: false }); // Reset game over state when the scene is loaded
		this.sound.volume = get(volume) / 100;
		volume.subscribe((value) => {
			this.sound.volume = value / 100;
		});

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

	private music: Phaser.Sound.BaseSound | undefined;
	create() {
		const screenWidth = this.scale.width;
		const screenHeight = this.scale.height;

		this.music = this.sound.add('bg', {
			loop: true,
			volume: 0.3
		});
		this.music.play();

		// 1. Add background
		const mountain = this.add.image(screenWidth / 2, 0, 'mountain').setOrigin(0.5, 0);
		mountain.setDisplaySize(screenWidth * 0.75, screenHeight * MOUNTAIN_HEIGHT_MULTIPLIER);

		// 2. Add player as a Sprite
		const groundY = mountain.displayHeight;
		this.player = new Player(this, screenWidth / 2 - 100, groundY, false, PLAYER_END).setDepth(
			2
		);
		this.enemy = new Player(this, screenWidth / 2 + 100, groundY, true, PLAYER_END).setDepth(2);

		this.pyramid = new Pyramid(this, screenWidth / 2, screenHeight * 0.35).setDepth(3);
		this.pyramid.onSelectionChange = (button) => {
			this.socket.emit('lockInGuess', {
				letter: button?.letter,
				scoreMultiplier: rowToMultiplier(button?.row ?? 0)
			});
		};
		this.pyramid.onSafetyPinSelected = () => {
			this.pyramid?.clearSelection();
			this.socket.emit('placeSafety');
		};

		this.secret = new Secret(this, 0, screenHeight - 250, '').setDepth(3);

		// 4. Setup camera bounds & tracking
		this.cameras.main.setBounds(0, 0, mountain.displayWidth, mountain.displayHeight);
		this.cameras.main.startFollow(this.player);

		this.socket.emit('getGameState');
		this.socket.emit('setReadyForNextRound');
		this.socket.emit('startNextRound');
	}
}
