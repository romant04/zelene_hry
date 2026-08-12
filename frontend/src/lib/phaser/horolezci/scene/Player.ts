import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
	public distanceTraveled: number = 0;
	private rope: Phaser.GameObjects.Graphics;
	private bottom: number;

	private readonly ropeOffsets: Record<string, { x: number; y: number }> = {
		player01: { x: -15, y: -80 },
		player02: { x: 0, y: -80 },
		player03: { x: 18, y: -80 },
		player04: { x: 25, y: -80 },
		player05: { x: 20, y: -80 },
		player06: { x: -5, y: -80 },
		player07: { x: -15, y: -80 }
	};
	private readonly enemyRopeOffsets: Record<string, { x: number; y: number }> = {
		enemy01: { x: -15, y: -80 },
		enemy02: { x: 0, y: -80 },
		enemy03: { x: 18, y: -80 },
		enemy04: { x: 25, y: -80 },
		enemy05: { x: 20, y: -80 },
		enemy06: { x: -5, y: -80 },
		enemy07: { x: -15, y: -80 }
	};

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private readonly isEnemy: boolean = false,
		private readonly top: number
	) {
		super(scene, x, y, isEnemy ? 'enemy06' : 'player06');

		this.bottom = y;
		this.setOrigin(0.5, 1);
		this.setDisplaySize(130, 180);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.rope = scene.add.graphics();

		// Put rope behind the player
		this.rope.setDepth(1);

		this.updateRope();
	}

	private updateRope() {
		this.rope.clear();

		const textureKey = this.frame.texture.key;

		const offsets = this.isEnemy ? this.enemyRopeOffsets : this.ropeOffsets;

		const offset = offsets[textureKey] ?? { x: 0, y: -5 };

		const ropeX = this.x + offset.x;
		const ropeY = this.y + offset.y;

		const length = this.bottom - ropeY;

		if (length <= 0) {
			return;
		}

		this.rope.lineStyle(3, 0xd8c7a0, 1);

		this.rope.beginPath();
		this.rope.moveTo(ropeX, ropeY);

		const segments = 30;
		const sway = Math.min(20, length * 0.05);

		for (let i = 1; i <= segments; i++) {
			const t = i / segments;

			const curve = sway * t * t;

			this.rope.lineTo(ropeX + curve, ropeY + length * t);
		}

		this.rope.strokePath();
	}

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);

		this.updateRope();
	}

	climb(distance: number) {
		if (distance === 0) {
			return;
		}

		this.play(
			{
				key: this.isEnemy ? 'enemy_climb' : 'player_climb',
				frameRate: Math.min(7, Math.max(distance / 40, 25))
			},
			true
		);

		this.scene.tweens.add({
			targets: this,
			y: Math.max(this.y - distance, this.top),
			duration: 2500,
			ease: 'Linear',

			onComplete: () => {
				this.stop();

				if (this.y <= this.top) {
					console.log('Player reached the top of the climb');
				}
			}
		});

		this.distanceTraveled += distance;
	}

	public placeSafetyPin(y?: number) {
		const pin = this.scene.add.image(this.x, y ? this.bottom - y : this.y - 50, 'safety_pin');
		pin.setDisplaySize(10, 30);
		pin.setOrigin(0.5, 1);
		pin.setRotation(Math.PI / 6);
		pin.setDepth(1);
		pin.setTint(0x0fb1ef);
	}

	public updatePosition(y: number) {
		this.y = y;
		this.updateRope();
	}

	stopClimb() {
		this.stop();
	}
}
