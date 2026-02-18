export default class SnakeNode extends Phaser.GameObjects.Container {
	circle;
	text;

	constructor(scene: Phaser.Scene, x: number, y: number, letter: string, color: number) {
		super(scene, x, y);

		// 1. Create the Circle
		this.circle = scene.add.circle(0, 0, 30, color);
		this.circle.setStrokeStyle(4, 0xffffff);

		// 2. Create the Text
		this.text = scene.add
			.text(0, 0, letter, {
				fontSize: '24px',
				fontStyle: 'bold',
				color: '#ffffff'
			})
			.setOrigin(0.5);

		// Add them to this container
		this.add([this.circle, this.text]);

		// Add the container to the scene
		scene.add.existing(this);

		// Make it interactive
		this.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
	}

	// Example of an "Update" method for later
	public setLetter(newLetter: string) {
		this.text.setText(newLetter);
	}

	// Example of a "Success" animation
	public pop() {
		// 1. Stop any current scale animations so they don't fight
		this.scene.tweens.killTweensOf(this);

		// 2. Reset scale to normal before starting (prevents getting stuck large)
		this.setScale(1);

		this.scene.tweens.add({
			targets: this,
			scale: 1.3,
			duration: 100,
			yoyo: true,
			ease: 'Back.easeOut'
		});
	}
}
