import Phaser from 'phaser';
import SnakeNode from './SnakeNode';

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('MainScene');
	}

	private topSnakeNodes: SnakeNode[] = [];
	private bottomSnakeNodes: SnakeNode[] = [];

	create() {
		const { width, height } = this.cameras.main;
		const bg = this.add.image(width / 2, height / 2, 'hriste');

		// Calculate the scale ratio
		const scaleX = width / bg.width;
		const scaleY = height / bg.height;
		const scale = Math.max(scaleX, scaleY);

		bg.setScale(scale).setScrollFactor(0);

		// Configuration
		const numCircles = 15;
		const padding = 100; // Gap from left and right edges
		const amplitude = 60;
		const frequency = 2; // Full waves (starts and ends at center)

		// Calculate the usable width
		const trackWidth = width - padding * 2;

		const topCenterY = height * 0.35;
		const bottomCenterY = height * 0.65;

		const lettersTop = 'ABCDEFGHIJKLRAFAF';
		const lettersBottom = 'MNOPQRSTUVWXFAGAG';

		// --- Snake 1: Left to Right (Top) ---
		for (let i = 0; i < numCircles; i++) {
			// Distribute within the padded area
			const x = padding + (trackWidth / (numCircles - 1)) * i;

			// Use i / (numCircles - 1) so the last circle hits exactly 1.0
			const progress = i / (numCircles - 1);
			const t = progress * Math.PI * 2 * frequency;
			const y = topCenterY + Math.sin(t) * amplitude;

			const node = new SnakeNode(this, x, y, lettersTop[i], 0xff6666);
			node.setInteractive();
			node.on('pointerdown', () => {
				node.pop();
			});
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
			const node = new SnakeNode(this, x, y, lettersBottom[i], 0x22ff22);
			node.setInteractive();
			node.on('pointerdown', () => {
				node.pop();
			});
			this.bottomSnakeNodes.push(node);
		}
	}
}
