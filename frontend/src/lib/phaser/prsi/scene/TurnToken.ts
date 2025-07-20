import Phaser from 'phaser';

export class TurnToken extends Phaser.GameObjects.Sprite {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		frontTexture: string | Phaser.Textures.Texture
	) {
		super(scene, x, y, frontTexture); // Start with the back texture
		scene.add.existing(this);
		this.setDisplaySize(80, 80);
	}

	changeTexture(newTexture: string | Phaser.Textures.Texture) {
		this.setTexture(newTexture as string);
	}

	changePosition(y: number) {
		// animate changing position
		this.scene.tweens.add({
			targets: this,
			y: y,
			duration: 300,
			ease: 'Power2'
		});
	}
}
