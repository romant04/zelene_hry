// PreloadScene.ts
import Phaser from 'phaser';
import { CARDS } from '../../../../assets/prsi/cards';
import cardBack from '../../../../assets/prsi/card-back2.png';
import wood from '../../../../assets/prsi/wood.jpg';

import cerveny from '../../../../assets/prsi/cerveny.png';
import zeleny from '../../../../assets/prsi/zeleny.png';
import kule from '../../../../assets/prsi/kule.png';
import zaludy from '../../../../assets/prsi/zaludy.png';

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
		this.load.image('wood', wood);
		for (const [key, value] of Object.entries(CARDS)) {
			this.load.image(key, value);
		}
		this.load.image('card-back', cardBack);

		this.load.image('cerveny', cerveny);
		this.load.image('zeleny', zeleny);
		this.load.image('kule', kule);
		this.load.image('zaludy', zaludy);

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
