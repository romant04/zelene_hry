import Phaser from 'phaser';
import { SecretWordLine } from '$lib/phaser/horolezci/scene/SecretWordLine';
import { isPortrait } from '$lib/phaser/utils/responsive';

const BOX_PADDING = 40;
export class Secret extends Phaser.GameObjects.Container {
	private defaultY: number = 0;
	// The box spans the whole screen width, in portrait it is taller as the text wraps into more lines
	private readonly boxWidth: number;
	private readonly boxHeight: number;
	private secretWordLine: SecretWordLine | null = null;
	private title: Phaser.GameObjects.Text | null = null;
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private text: string
	) {
		super(scene, x, y);
		this.boxWidth = scene.scale.width;
		this.boxHeight = Secret.getHeight(scene);
		this.defaultY = y;

		this.setScrollFactor(0);

		const box = scene.add.graphics();
		box.fillStyle(0xffffff, 1);
		box.fillRoundedRect(0, 0, this.boxWidth, this.boxHeight, {
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
		box.moveTo(0, this.boxHeight);
		// Left side
		box.lineTo(0, radius);
		// Top-left rounded corner
		box.arc(radius, radius, radius, Math.PI, Math.PI * 1.5, false);
		// Top edge
		box.lineTo(this.boxWidth - radius, 0);
		// Top-right rounded corner
		box.arc(this.boxWidth - radius, radius, radius, Math.PI * 1.5, Math.PI * 2, false);
		// Right side
		box.lineTo(this.boxWidth, this.boxHeight);
		box.strokePath();
		this.add(box);

		this.title = scene.add
			.text(this.boxWidth / 2, 12, 'Přísloví', {
				fontSize: '28px',
				color: '#000000',
				fontStyle: 'bold'
			})
			.setOrigin(0.5, 0);
		this.add(this.title);

		this.secretWordLine = this.createWordLine(text);

		this.add(this.secretWordLine);
		this.y += this.boxHeight; // Start hidden below the screen

		scene.add.existing(this);
	}

	public static getHeight(scene: Phaser.Scene) {
		return isPortrait(scene) ? 330 : 250;
	}

	private createWordLine(text: string) {
		const line = new SecretWordLine(
			this.scene,
			0,
			0,
			text,
			undefined,
			this.boxWidth - BOX_PADDING * 2
		);
		line.setPosition(
			(this.boxWidth - line.lineWidth) / 2,
			(this.boxHeight - line.lineHeight) / 2 + 20
		);
		return line;
	}

	public hide() {
		this.scene.tweens.add({
			targets: this,
			y: this.y + this.boxHeight,
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
		this.secretWordLine = this.createWordLine(newText);
		this.add(this.secretWordLine);
	}
	public updateTitle(newTitle: string) {
		if (this.title) {
			this.title.setText(newTitle);
		}
	}

	public celebrateComplete() {
		if (this.secretWordLine) {
			this.secretWordLine.celebrateComplete();
		}
	}
}
