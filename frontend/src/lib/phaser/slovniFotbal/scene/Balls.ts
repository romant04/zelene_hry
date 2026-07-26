import Phaser from 'phaser';
import SnakeNode from '$lib/phaser/slovniFotbal/scene/SnakeNode';
import { FloatingText } from '$lib/phaser/slovniFotbal/scene/FloatingText';

export class Balls extends Phaser.GameObjects.Container {
	private topSnakeNodes: SnakeNode[] = [];
	private bottomSnakeNodes: SnakeNode[] = [];

	private enemyGoalText: FloatingText | undefined;
	private playerGoalText: FloatingText | undefined;

	constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		super(scene, x, y);

		this.enemyGoalText = new FloatingText(this.scene, 300, 200, 'GOAL!', 'goal');
		this.playerGoalText = new FloatingText(this.scene, 1100, 200, 'GOAL!', 'goal');

		// Configuration
		const numCircles = 10;
		const padding = 100; // Gap from left and right edges
		const amplitude = 60;
		const frequency = 2; // Full waves (starts and ends at center)

		// Calculate the usable width
		const trackWidth = width - padding * 2;

		const topCenterY = height * 0.35;
		const bottomCenterY = height * 0.65;

		// --- Snake 1: Left to Right (Top) ---
		for (let i = 0; i < numCircles; i++) {
			// Distribute within the padded area
			const x = padding + (trackWidth / (numCircles - 1)) * i;

			// Use i / (numCircles - 1) so the last circle hits exactly 1.0
			const progress = i / (numCircles - 1);
			const t = progress * Math.PI * 2 * frequency;
			const y = topCenterY + Math.sin(t) * amplitude;

			const node = new SnakeNode(scene, x, y);
			this.topSnakeNodes.push(node);
		}

		// --- Snake 2: Right to Left (Bottom) ---
		for (let i = 0; i < numCircles; i++) {
			// Start at (Width - Padding) and move towards Padding
			const x = width - padding - (trackWidth / (numCircles - 1)) * i;

			const progress = i / (numCircles - 1);
			const t = progress * Math.PI * 2 * frequency;
			// Adding Math.PI here mirrors it so they curve away from each other
			const y = bottomCenterY + Math.cos(t + Math.PI) * amplitude;
			const node = new SnakeNode(scene, x, y);
			this.bottomSnakeNodes.push(node);
		}
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
			this.scene.cameras.main.shake(180, 0.008);
			this.playerGoalText?.show();

			const particles = this.scene.add.particles(1200, 380, 'particle', {
				speed: { min: 60, max: 150 },
				angle: { min: 155, max: 205 }, // shoot right in a cone

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

			this.scene.cameras.main.shake(180, 0.008);
			this.enemyGoalText?.show();

			const particles = this.scene.add.particles(100, 380, 'particle', {
				speed: { min: 60, max: 150 },
				angle: { min: -80, max: 25 }, // shoot right in a cone

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

			await new Promise((resolve) => setTimeout(resolve, 2500));
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
