import Phaser from 'phaser';

export class Letter extends Phaser.GameObjects.Container {
	private readonly background: Phaser.GameObjects.Arc;
	private readonly letterText: Phaser.GameObjects.Text;

	constructor(scene: Phaser.Scene, x: number, y: number, letter: string) {
		super(scene, x, y);

		this.background = scene.add.circle(0, 0, 28, 0xe3550b);
		this.background.setOrigin(0.5);
		this.setSize(46, 46);
		this.setInteractive();

		this.letterText = scene.add.text(0, 0, letter, {
			fontSize: '28px',
			fontStyle: 'bold',
			color: '#ffffff'
		});
		this.letterText.setOrigin(0.5);

		this.add([this.background, this.letterText]);

		scene.add.existing(this);
	}

	public getLetter() {
		return this.letterText.text;
	}
	public select() {
		this.background.setFillStyle(0xff6715);
	}
	public deselect() {
		this.background.setFillStyle(0xe3550b);
	}
}
