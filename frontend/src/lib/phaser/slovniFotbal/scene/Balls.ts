import Phaser from 'phaser';
import SnakeNode from '$lib/phaser/slovniFotbal/scene/SnakeNode';
import { FloatingText } from '$lib/phaser/slovniFotbal/scene/FloatingText';

export class Balls extends Phaser.GameObjects.Container {
	private topSnakeNodes: SnakeNode[] = [];
	private bottomSnakeNodes: SnakeNode[] = [];

	private enemyGoalText: FloatingText | undefined;
	private playerGoalText: FloatingText | undefined;

	// The layout is designed for landscape (goals on the left and right). In portrait the whole
	// layout is turned 90° clockwise, so the goals end up at the top and bottom of the screen.
	private readonly portrait: boolean;
	private readonly trackLength: number; // distance between the goals
	private readonly across: number; // width of the pitch
	private readonly toScreen: (along: number, side: number) => { x: number; y: number };

	constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		super(scene, x, y);

		this.portrait = height > width;
		this.trackLength = this.portrait ? height : width;
		this.across = this.portrait ? width : height;
		this.toScreen = (along, side) =>
			this.portrait ? { x: width - side, y: along } : { x: along, y: side };

		const enemyGoalTextPos = this.toScreen(this.trackLength - 180, this.across * 0.28);
		const playerGoalTextPos = this.toScreen(300, this.across * 0.28);
		this.enemyGoalText = new FloatingText(
			this.scene,
			enemyGoalTextPos.x,
			enemyGoalTextPos.y,
			'GOAL!',
			'goal'
		);
		this.playerGoalText = new FloatingText(
			this.scene,
			playerGoalTextPos.x,
			playerGoalTextPos.y,
			'GOAL!',
			'goal'
		);

		// Configuration
		const numCircles = 10;
		const padding = 100; // Gap from the goal edges
		const amplitude = 60;
		const frequency = 2; // Full waves (starts and ends at center)

		// Calculate the usable track length
		const trackWidth = this.trackLength - padding * 2;

		const topCenterY = this.across * 0.35;
		const bottomCenterY = this.across * 0.65;

		// --- Snake 1: Left to Right (Top) ---
		for (let i = 0; i < numCircles; i++) {
			// Distribute within the padded area
			const along = padding + (trackWidth / (numCircles - 1)) * i;

			// Use i / (numCircles - 1) so the last circle hits exactly 1.0
			const progress = i / (numCircles - 1);
			const t = progress * Math.PI * 2 * frequency;
			const side = topCenterY + Math.sin(t) * amplitude;

			const pos = this.toScreen(along, side);
			const node = new SnakeNode(scene, pos.x, pos.y);
			this.topSnakeNodes.push(node);
		}

		// --- Snake 2: Right to Left (Bottom) ---
		for (let i = 0; i < numCircles; i++) {
			// Start at (Length - Padding) and move towards Padding
			const along = this.trackLength - padding - (trackWidth / (numCircles - 1)) * i;

			const progress = i / (numCircles - 1);
			const t = progress * Math.PI * 2 * frequency;
			// Adding Math.PI here mirrors it so they curve away from each other
			const side = bottomCenterY + Math.cos(t + Math.PI) * amplitude;
			const pos = this.toScreen(along, side);
			const node = new SnakeNode(scene, pos.x, pos.y);
			this.bottomSnakeNodes.push(node);
		}
	}

	private scoreGoal(enemy: boolean) {
		this.scene.cameras.main.shake(180, 0.008);
		if (enemy) this.enemyGoalText?.show();
		else this.playerGoalText?.show();

		const origin = this.toScreen(enemy ? this.trackLength - 80 : 100, this.across * 0.53);
		const rotation = this.portrait ? 90 : 0;
		const particles = this.scene.add.particles(origin.x, origin.y, 'particle', {
			speed: { min: 60, max: 150 },
			// shoot from the goal towards the middle of the pitch in a cone
			angle: {
				min: (enemy ? 155 : -80) + rotation,
				max: (enemy ? 205 : 25) + rotation
			},

			gravityY: 50, // slowly fall
			lifespan: 2500,
			quantity: 3,

			scale: { start: 1, end: 1 },
			accelerationX: { min: -40, max: 40 },
			bounce: 0.3,

			rotate: { min: 0, max: 360 },

			tint: [0xff4d4d, 0xffd700, 0x4da6ff, 0x4dff88, 0xff66ff]
		});
		this.scene.time.delayedCall(1000, () => {
			particles.stop();
		});
		this.scene.time.delayedCall(3500, () => {
			particles.destroy();
		});
		this.scene.sound.play('goal', {
			volume: 0.5,
			rate: 1,
			detune: 0,
			loop: false
		});
	}
	public setTopSnakeFilled(count: number) {
		for (let i = 0; i < this.topSnakeNodes.length; i++) {
			if (i < count) {
				this.topSnakeNodes[i].setFilled();
			} else {
				this.topSnakeNodes[i].setEmpty();
			}
		}

		if (count >= 10) {
			this.scoreGoal(true);
		}
	}
	public setBottomSnakeFilledInsta(count: number) {
		for (let i = 0; i < this.bottomSnakeNodes.length; i++) {
			if (i < count) {
				this.bottomSnakeNodes[i].setFilled();
			} else {
				this.bottomSnakeNodes[i].setEmpty();
			}
		}
	}
	public async setBottomSnakeFilled(count: number) {
		await this.animateSnakeNodes(this.bottomSnakeNodes, count);

		if (count >= 10) {
			await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 0.5s after the last pop
			this.scoreGoal(false);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return;
		}

		await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 1.5s after the last pop
	}
	public resetBottomBalls() {
		for (const node of this.bottomSnakeNodes) {
			node.setEmpty();
		}
	}

	private async animateSnakeNodes(nodes: SnakeNode[], count: number) {
		let popDelayIndex = 0;
		const STAGGER_DELAY = 150; // Delay in ms between each ball popping

		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];

			if (i < count) {
				// If the node is not filled yet, trigger the pop animation!
				if (!node.isFilled) {
					node.popIn(popDelayIndex * STAGGER_DELAY);
					this.scene.sound.play('score', {
						volume: 0.3,
						rate: 1,
						detune: 0,
						loop: false,
						delay: (STAGGER_DELAY / 1000) * popDelayIndex // Convert ms to seconds for the delay
					});
					popDelayIndex++;
				}
			} else {
				// Node should be empty
				if (node.isFilled) {
					node.setEmpty();
				}
			}
		}
	}
}
