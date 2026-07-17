import Phaser from 'phaser';

export class Letter extends Phaser.GameObjects.Container {
	private readonly background: Phaser.GameObjects.Arc;
	private readonly letterText: Phaser.GameObjects.Text;

	constructor(scene: Phaser.Scene, x: number, y: number, letter: string) {
		super(scene, x, y);

		this.background = scene.add.circle(0, 0, 25, 0xfd6717);
		this.background.setOrigin(0.5);
		this.setSize(40, 40);
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
		this.background.setFillStyle(0xbf3f00);
	}
	public deselect() {
		this.background.setFillStyle(0xfd6717);
	}
}
