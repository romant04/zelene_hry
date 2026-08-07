import Phaser from 'phaser';
import { SecretWordLine } from '$lib/phaser/horolezci/scene/SecretWordLine';

const BOX_WIDTH = 1280;
const BOX_HEIGHT = 200;
export class Secret extends Phaser.GameObjects.Container {
	private defaultY: number = 0;
	private secretWordLine: SecretWordLine | null = null;
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private text: string
	) {
		super(scene, x, y);
		this.defaultY = y;

		this.setScrollFactor(0);

		const box = scene.add.graphics();
		box.fillStyle(0xffffff, 1);
		box.fillRoundedRect(0, 0, BOX_WIDTH, BOX_HEIGHT, {
			tr: 20,
			tl: 20,
			br: 0,
			bl: 0
		});

		const radius = 20;
		const borderWidth = 5;

		// Border — left, top, and right only
		box.lineStyle(borderWidth, 0x252525, 1);
		box.beginPath();
		// Start at the bottom-left
		box.moveTo(0, BOX_HEIGHT);
		// Left side
		box.lineTo(0, radius);
		// Top-left rounded corner
		box.arc(radius, radius, radius, Math.PI, Math.PI * 1.5, false);
		// Top edge
		box.lineTo(BOX_WIDTH - radius, 0);
		// Top-right rounded corner
		box.arc(BOX_WIDTH - radius, radius, radius, Math.PI * 1.5, Math.PI * 2, false);
		// Right side
		box.lineTo(BOX_WIDTH, BOX_HEIGHT);
		box.strokePath();
		this.add(box);

		const title = scene.add
			.text(BOX_WIDTH / 2, 10, 'Slavný výrok', {
				fontSize: '28px',
				color: '#000000',
				fontStyle: 'bold'
			})
			.setOrigin(0.5, 0);
		this.add(title);

		this.secretWordLine = new SecretWordLine(scene, 0, 0, text);

		this.secretWordLine.setPosition(
			(BOX_WIDTH - this.secretWordLine.lineWidth) / 2,
			(BOX_HEIGHT - this.secretWordLine.lineHeight) / 2 + 20
		);

		this.add(this.secretWordLine);
		this.y += BOX_HEIGHT; // Start hidden below the screen

		scene.add.existing(this);
	}

	public hide() {
		this.scene.tweens.add({
			targets: this,
			y: this.y + BOX_HEIGHT,
			duration: 500
		});
	}
	public show() {
		this.scene.tweens.add({
			targets: this,
			y: this.defaultY,
			duration: 500
		});
	}

	public updateGuessedLetters(guessedLetters: Set<string>) {
		if (this.secretWordLine) {
			this.secretWordLine.updateGuessedLetters(guessedLetters);
		}
	}
	public updateSecret(newText: string) {
		this.text = newText;
		if (this.secretWordLine) {
			this.secretWordLine.destroy();
		}
		this.secretWordLine = new SecretWordLine(this.scene, 0, 0, newText);
		this.secretWordLine.setPosition(
			(BOX_WIDTH - this.secretWordLine.lineWidth) / 2,
			(BOX_HEIGHT - this.secretWordLine.lineHeight) / 2 + 20
		);
		this.add(this.secretWordLine);
	}
}
