import Phaser from 'phaser';

export class Letter extends Phaser.GameObjects.Container {
	private readonly background: Phaser.GameObjects.Image;
	private readonly letterText: Phaser.GameObjects.Text;
	private glowFx?: Phaser.FX.Glow;

	constructor(scene: Phaser.Scene, x: number, y: number, letter: string) {
		super(scene, x, y);

		this.background = scene.add.image(0, 0, 'wbg');
		this.background.setOrigin(0.5);
		this.background.setDisplaySize(70, 70);
		this.setSize(70, 70);
		this.setInteractive();

		if (this.background.postFX) {
			this.glowFx = this.background.postFX.addGlow(0x00ffff, 0, 0);
		}

		this.letterText = scene.add.text(0, 0, letter, {
			fontSize: '28px',
			fontStyle: 'bold',
			color: '#000000'
		});
		this.letterText.setOrigin(0.5);

		this.add([this.background, this.letterText]);

		this.on('pointerover', () => {
			scene.input.setDefaultCursor('pointer');
		});
		this.on('pointerout', () => {
			scene.input.setDefaultCursor('default');
		});

		scene.add.existing(this);
	}

	public getLetter() {
		return this.letterText.text;
	}
	public select() {
		this.scaleTo(1.1, 350);
		this.setGlow(3);
	}
	public deselect() {
		this.scaleTo(1, 350);
		this.setGlow(0);
	}

	private scaleTo(targetScale: number, duration: number) {
		this.scene.tweens.add({
			targets: this,
			scale: targetScale,
			duration: duration,
			ease: 'Elastic.easeOut'
		});
	}
	private setGlow(targetStrength: number, duration: number = 300) {
		if (!this.glowFx) return;

		this.scene.tweens.add({
			targets: this.glowFx,
			outerStrength: targetStrength,
			duration: duration,
			ease: 'Power2'
		});
	}
}
