export class AnimatedCharText extends Phaser.GameObjects.Container {
	private didAnimate: boolean = false;
	private readonly charText: Phaser.GameObjects.Text;
	public char: string;
	constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
		super(scene, x, y);
		this.char = text;

		this.charText = scene.add.text(0, 0, text, {
			fontSize: '26px',
			color: '#000000',
			fontStyle: 'bold'
		});
		this.charText.setOrigin(0.5);
		this.add(this.charText);
		// this.scene.add.existing(this);
	}

	public animate(): void {
		if (this.didAnimate) {
			this.charText.setVisible(true);
			return;
		}

		this.charText.setVisible(true);
		this.charText.setScale(0);
		this.scene.tweens.add({
			targets: this.charText,
			scale: 1.5,
			duration: 500,
			ease: 'Power2',
			onComplete: () => {
				this.scene.tweens.add({
					targets: this.charText,
					scale: 1,
					duration: 300,
					ease: 'Sine.easeInOut',
					onComplete: () => {
						this.didAnimate = true;
					}
				});
			}
		});
	}
	public hide() {
		this.charText.setVisible(false);
	}
}
