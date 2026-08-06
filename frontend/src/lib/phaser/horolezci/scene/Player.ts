import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private readonly isEnemy: boolean = false,
		private readonly top: number
	) {
		super(scene, x, y, isEnemy ? 'enemy06' : 'player06');
		this.setOrigin(0.5, 1);
		this.setDisplaySize(130, 180);
		scene.add.existing(this);
		scene.physics.add.existing(this);
	}

	climb(distance: number) {
		this.play(this.isEnemy ? 'enemy_climb' : 'player_climb', true);
		this.scene.tweens.add({
			targets: this,
			y: Math.max(this.y - distance, this.top),
			duration: distance * 5, // Adjust duration based on distance for smoother animation
			ease: 'Linear',
			onComplete: () => {
				this.stop();

				if (this.y <= this.top) {
					console.log('Player reached the top of the climb');
				}
			}
		});
	}
	stopClimb() {
		this.stop();
	}
}
