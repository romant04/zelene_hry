import Phaser from 'phaser';
import SnakeNode from '$lib/phaser/slovniFotbal/scene/SnakeNode';

export class Balls extends Phaser.GameObjects.Container {
	private topSnakeNodes: SnakeNode[] = [];
	private bottomSnakeNodes: SnakeNode[] = [];

	constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		super(scene, x, y);

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
	}
	public setBottomSnakeFilled(count: number) {
		for (let i = 0; i < this.bottomSnakeNodes.length; i++) {
			if (i < count) {
				this.bottomSnakeNodes[i].setFilled();
			} else {
				this.bottomSnakeNodes[i].setEmpty();
			}
		}
	}
}
