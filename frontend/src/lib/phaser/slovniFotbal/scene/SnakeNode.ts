export default class SnakeNode extends Phaser.GameObjects.Container {
	circle;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);

		// 1. Create the Circle
		this.circle = scene.add.image(0, 0, 'football');
		this.circle.setDisplaySize(60, 60);
		this.circle.alpha = 0.5;

		// Add them to this container
		this.add([this.circle]);

		// Add the container to the scene
		scene.add.existing(this);
	}

	public setFilled() {
		this.circle.alpha = 1;
	}
	public setEmpty() {
		this.circle.alpha = 0.5;
	}
}
