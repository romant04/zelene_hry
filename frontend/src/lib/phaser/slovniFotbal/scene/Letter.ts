import Phaser from 'phaser';

const GLOW_TEXTURE = 'letter-glow';
const GLOW_SIZE = 80;

// The glow is drawn once into a texture and faded in behind the letter. A postFX glow would run
// a blur shader for every letter on every frame, which makes dragging over the letters laggy.
function createGlowTexture(scene: Phaser.Scene) {
	if (scene.textures.exists(GLOW_TEXTURE)) return;

	const texture = scene.textures.createCanvas(GLOW_TEXTURE, GLOW_SIZE, GLOW_SIZE)!;
	const ctx = texture.getContext();
	const center = GLOW_SIZE / 2;
	const gradient = ctx.createRadialGradient(center, center, 30, center, center, center);
	gradient.addColorStop(0, 'rgba(0, 255, 255, 0.9)');
	gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, GLOW_SIZE, GLOW_SIZE);
	texture.refresh();
}

export class Letter extends Phaser.GameObjects.Container {
	private readonly background: Phaser.GameObjects.Image;
	private readonly letterText: Phaser.GameObjects.Text;
	private readonly glow: Phaser.GameObjects.Image;

	constructor(scene: Phaser.Scene, x: number, y: number, letter: string) {
		super(scene, x, y);

		createGlowTexture(scene);
		this.glow = scene.add.image(0, 0, GLOW_TEXTURE).setAlpha(0);

		this.background = scene.add.image(0, 0, 'wbg');
		this.background.setOrigin(0.5);
		this.background.setDisplaySize(70, 70);
		this.setSize(70, 70);
		this.setInteractive();

		this.letterText = scene.add.text(0, 0, letter, {
			fontSize: '28px',
			fontStyle: 'bold',
			color: '#000000'
		});
		this.letterText.setOrigin(0.5);

		this.add([this.glow, this.background, this.letterText]);

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
		this.setGlow(1);
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
	private setGlow(targetAlpha: number, duration: number = 300) {
		this.scene.tweens.add({
			targets: this.glow,
			alpha: targetAlpha,
			duration: duration,
			ease: 'Power2'
		});
	}
}
