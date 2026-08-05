import Phaser from 'phaser';

export default class LetterButton extends Phaser.GameObjects.Container {
	public circle: Phaser.GameObjects.Arc;
	public text: Phaser.GameObjects.Text;

	constructor(scene: Phaser.Scene, x: number, y: number, letter = 'A') {
		super(scene, x, y);

		const radius = 33;

		// 1. Draw shape
		this.circle = scene.add.circle(0, 0, radius, 0xffffff);

		// 2. Create Text
		this.text = scene.add
			.text(0, 0, letter, {
				fontSize: '38px',
				color: '#000',
				fontStyle: 'bold'
			})
			.setOrigin(0.5);

		// 3. Add to container
		this.add([this.circle, this.text]);

		this.circle.setScrollFactor(0);
		// 4. Make the CIRCLE shape interactive directly (NOT 'this')
		this.circle.setInteractive({ useHandCursor: true });

		// 5. Attach listeners to the circle shape
		this.circle.on('pointerdown', () => {
			this.circle.setFillStyle(0xaaaaaa);
		});
		this.circle.on('pointerup', () => {
			this.circle.setFillStyle(0xffffff);
		});
		this.circle.on('pointerout', () => {
			this.circle.setFillStyle(0xffffff);
		});
		this.circle.on('pointerover', () => {
			this.circle.setFillStyle(0xdddddd);
		});

		scene.add.existing(this);
	}
}
