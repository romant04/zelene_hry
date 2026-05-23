import Phaser from 'phaser';

export class TurnToken extends Phaser.GameObjects.Sprite {
	private glowFx: Phaser.FX.Glow | null = null;
	private glowTween: Phaser.Tweens.Tween | null = null;

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

	activateToken() {
		if (this.glowFx) return; // Already active

		this.glowFx = this.postFX.addGlow(0xffd700, 0, 0);
		this.glowTween = this.scene.tweens.add({
			targets: this.glowFx,
			outerStrength: 8,
			innerStrength: 4,
			duration: 700,
			yoyo: true,
			repeat: -1
		});
	}

	deactivateToken() {
		if (!this.glowFx) return;

		this.glowTween?.stop();

		this.postFX.remove(this.glowFx);

		this.glowFx = null;
		this.glowTween = null;
	}
}
