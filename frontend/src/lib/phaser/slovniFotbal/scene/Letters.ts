import Phaser from 'phaser';
import { Letter } from '$lib/phaser/slovniFotbal/scene/Letter';
import { addToast } from '../../../../stores/toast';

export class Letters extends Phaser.GameObjects.Container {
	private readonly background: Phaser.GameObjects.Arc;
	private readonly letters: Letter[];

	private readonly lines: Phaser.GameObjects.Graphics;
	private selectedLetters: Letter[] = [];

	private dragging = false;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private readonly onWordSelected?: (word: string) => void
	) {
		super(scene, x, y);

		this.background = scene.add.circle(0, 0, 250, 0x000000, 0.5);
		this.background.isStroked = true;
		this.background.strokeColor = 0x000000;
		this.background.strokeAlpha = 0.7;
		this.background.lineWidth = 4;

		this.background.setOrigin(0.5);

		this.lines = scene.add.graphics();

		const letters = ['A', 'B', 'G', 'H', 'Z', 'Y', 'A', 'R', 'C', 'L', 'V', 'E', 'K', 'M']; // TODO: This should be passed from socket.io
		this.letters = letters.map((letter, index) => {
			const angle = (index / letters.length) * Math.PI * 2;
			const radius = 180;
			const letterX = radius * Math.cos(angle);
			const letterY = radius * Math.sin(angle);

			return new Letter(scene, letterX, letterY, letter);
		});

		this.add([this.background, this.lines, ...this.letters]);

		scene.input.on('pointerdown', this.startSelection, this);
		scene.input.on('pointermove', this.dragSelection, this);
		scene.input.on('pointerup', this.endSelection, this);

		scene.add.existing(this);
	}

	private startSelection(pointer: Phaser.Input.Pointer) {
		const letter = this.getLetterAt(pointer);

		if (!letter) return;

		this.dragging = true;
		this.selectedLetters = [letter];
		letter.select();

		this.drawLines();
	}
	private dragSelection(pointer: Phaser.Input.Pointer) {
		if (!this.dragging) return;

		const letter = this.getLetterAt(pointer);

		if (!letter) return;

		if (!this.selectedLetters.includes(letter)) {
			this.selectedLetters.push(letter);
			letter.select();
		}

		this.drawLines();
	}
	private endSelection() {
		this.dragging = false;

		const word = this.selectedLetters.map((letter) => letter.getLetter()).join('');

		console.log(word);
		if (this.onWordSelected && word.length >= 3) {
			this.onWordSelected(word);
		}
		if (word.length > 0 && word.length < 3) {
			addToast('Word must be at least 3 letters long', 'warning');
		}

		this.selectedLetters.forEach((letter) => letter.deselect());
		this.selectedLetters = [];

		this.lines.clear();
	}

	private getLetterAt(pointer: Phaser.Input.Pointer) {
		return this.letters.find((letter) => {
			const bounds = letter.getBounds();

			return bounds.contains(pointer.worldX, pointer.worldY);
		});
	}

	private drawLines() {
		this.lines.clear();

		this.lines.lineStyle(8, 0xffffff, 1);

		this.selectedLetters.forEach((letter, index) => {
			if (index === 0) return;

			const a = this.selectedLetters[index - 1];
			const b = letter;

			this.lines.lineBetween(a.x, a.y, b.x, b.y);
		});
	}
}
