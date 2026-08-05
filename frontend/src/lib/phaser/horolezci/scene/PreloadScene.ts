// PreloadScene.ts
import Phaser from 'phaser';
import player01 from '../../../../assets/horolezci/player/image_0-1.png';
import player02 from '../../../../assets/horolezci/player/image_0-2.png';
import player03 from '../../../../assets/horolezci/player/image_0-3.png';
import player04 from '../../../../assets/horolezci/player/image_0-4.png';
import player11 from '../../../../assets/horolezci/player/image_1-1.png';
import player12 from '../../../../assets/horolezci/player/image_1-2.png';
import player13 from '../../../../assets/horolezci/player/image_1-3.png';
import mountain from '../../../../assets/horolezci/mountain.png';

export default class PreloadScene extends Phaser.Scene {
	constructor() {
		super('PreloadScene');
	}

	preload() {
		// Show a loading bar
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		const progressBox = this.add.graphics();
		const progressBar = this.add.graphics();

		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

		const loadingText = this.add
			.text(width / 2, height / 2 - 60, 'Loading...', {
				fontSize: '20px',
				color: '#ffffff'
			})
			.setOrigin(0.5);

		// Load your background and other assets here
		this.load.image('player01', player01);
		this.load.image('player02', player02);
		this.load.image('player03', player03);
		this.load.image('player04', player04);
		this.load.image('player05', player13);
		this.load.image('player06', player12);
		this.load.image('player07', player11);
		this.load.image('mountain', mountain);

		this.load.on('progress', (value: number) => {
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
		});

		this.load.on('complete', () => {
			this.registry.set('assetsLoaded', true);
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();

			this.scene.start('MainScene'); // Replace with your actual game scene
		});
	}
}
