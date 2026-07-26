// Inside SnakeNode.ts (or wherever SnakeNode is defined)
export default class SnakeNode extends Phaser.GameObjects.Container {
	public isFilled: boolean = false;
	private currentTween?: Phaser.Tweens.Tween;
	circle;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);
		// 1. Create the Circle
		this.circle = scene.add.image(0, 0, 'football');
		this.circle.setDisplaySize(60, 60);
		this.alpha = 0.3;
		this.setScale(1);

		// Add them to this container
		this.add([this.circle]);

		// Add the container to the scene
		scene.add.existing(this);
	}

	public popIn(delay: number = 0) {
		this.isFilled = true;

		// Stop any running tween on this node to prevent conflicts
		if (this.currentTween) {
			this.currentTween.stop();
		}

		this.currentTween = this.scene.tweens.add({
			targets: this,
			alpha: 1, // Full opacity
			scaleX: 1.3, // Pop scale up
			scaleY: 1.3,
			duration: 300,
			delay: delay,
			yoyo: true, // Scales back to 1.0 automatically!
			hold: 50,
			ease: 'Back.easeOut',
			onComplete: () => {
				this.setScale(1);
				this.alpha = 1;
			}
		});
	}

	public setEmpty() {
		this.isFilled = false;

		if (this.currentTween) {
			this.currentTween.stop();
		}

		// Reset back to empty state
		this.alpha = 0.3;
		this.setScale(1);
	}

	public setFilled() {
		this.isFilled = true;
		if (this.currentTween) this.currentTween.stop();
		this.alpha = 1;
		this.setScale(1);
	}

	public setFilledInstant() {
		this.isFilled = true;
		this.alpha = 1;
		this.setScale(1);
	}
}
