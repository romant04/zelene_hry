import Phaser from 'phaser';

export default class SafetyPinButton extends Phaser.GameObjects.Container {
	private readonly yellow: Phaser.GameObjects.Arc;
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private readonly onClick: () => void
	) {
		super(scene, x, y);

		const outer = scene.add.circle(0, 0, 42, 0xffffff);
		const whiteBorder = scene.add.circle(0, 0, 37, 0x000000);
		this.yellow = scene.add.circle(0, 0, 28, 0xffd83d);

		const image = scene.add.image(0, 0, 'safety_pin');
		image.setDisplaySize(12, 37);

		this.add([outer, whiteBorder, this.yellow, image]);

		this.setSize(68, 68);
		this.setInteractive({ useHandCursor: true });

		this.on('pointerdown', () => {
			this.setScale(0.92);
			this.onClick();
		});
		this.on('pointerup', () => {
			this.setScale(1);
		});
		this.on('pointerout', () => {
			this.setScale(1);
		});
	}

	public disable() {
		this.disableInteractive();
		this.setAlpha(0.5);
	}
	public setSelected(selected: boolean) {
		if (selected) {
			this.yellow.setFillStyle(0x967e1e);
		} else {
			this.yellow.setFillStyle(0xffd83d);
		}
	}
}
