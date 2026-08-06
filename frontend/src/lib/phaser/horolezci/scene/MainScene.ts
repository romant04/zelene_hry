import Phaser from 'phaser';
import { Player } from '$lib/phaser/horolezci/scene/Player';
import Pyramid from '$lib/phaser/horolezci/scene/Pyramid';
import { Secret } from '$lib/phaser/horolezci/scene/Secret';

const MOUNTAIN_HEIGHT_MULTIPLIER = 2.5;
const TOP_OF_THE_MOUNTAIN = 728 * 2.5 - 360;
const PLAYER_START = 1800;
const PLAYER_END = PLAYER_START - TOP_OF_THE_MOUNTAIN;

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('MainScene');
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
		const player = new Player(this, screenWidth / 2 - 100, groundY, false, PLAYER_END);
		const enemy = new Player(this, screenWidth / 2 + 100, groundY, true, PLAYER_END);

		const pyramid = new Pyramid(this, screenWidth / 2, screenHeight * 0.4);
		pyramid.setAllRowsLetters([['A'], ['B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I', 'J']]);
		pyramid.hide();

		const secret = new Secret(this, 0, screenHeight - 200);
		secret.hide();

		// 4. Setup camera bounds & tracking
		this.cameras.main.setBounds(0, 0, mountain.displayWidth, mountain.displayHeight);
		this.cameras.main.startFollow(player);
	}
}
