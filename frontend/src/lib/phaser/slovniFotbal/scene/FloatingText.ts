import Phaser from 'phaser';

export class FloatingText extends Phaser.GameObjects.Container {
	private text: Phaser.GameObjects.Text;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		message: string,
		type: 'success' | 'error' | 'goal' = 'success'
	) {
		super(scene, x, y);

		this.text = scene.add.text(0, 0, message, {
			fontSize: type === 'goal' ? '64px' : '42px',
			fontStyle: 'bold',
			color: type === 'goal' ? '#44e802' : type === 'success' ? '#FFD700' : '#ff0000',
			strokeThickness: 5,
			stroke: '#000'
		});
		this.text.setOrigin(0.5);
		this.text.setScale(0.2);
		this.text.setAlpha(0);
		this.text.y += 10;
		this.visible = false;

		this.add(this.text);
		scene.add.existing(this);
	}

	private reset() {
		this.text.setScale(0.2);
		this.text.setAlpha(0);
		this.text.y = 10;
		this.visible = false;
	}
	public show() {
		this.scene.tweens.killTweensOf(this.text);
		this.reset();

		this.visible = true;

		this.scene.tweens.add({
			targets: this.text,
			scale: 1.15,
			alpha: 1,
			y: this.text.y - 10,
			duration: 150,
			ease: 'Back.Out',
			onComplete: () => {
				// Settle
				this.scene.tweens.add({
					targets: this.text,
					scale: 1,
					duration: 100,
					ease: 'Quad.Out'
				});

				// Float away
				this.scene.tweens.add({
					targets: this.text,
					y: this.text.y - 25,
					alpha: 0,
					scale: 0.8,
					delay: 700,
					duration: 500,
					ease: 'Sine.Out',
					onComplete: () => this.reset()
				});
			}
		});
	}

	public setMessage(message: string, type: 'success' | 'error' = 'success') {
		this.text.setText(message);
		this.text.setStyle({
			color: type === 'success' ? '#FFD700' : '#ff0000'
		});
	}
}
