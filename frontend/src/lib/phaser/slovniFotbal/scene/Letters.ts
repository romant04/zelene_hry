import Phaser from 'phaser';
import { Letter } from '$lib/phaser/slovniFotbal/scene/Letter';
import { addToast } from '../../../../stores/toast';

export class Letters extends Phaser.GameObjects.Container {
	private readonly background: Phaser.GameObjects.Arc;
	private readonly letters: Letter[] = [];
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

		this.background = scene.add.circle(0, 0, 250, 0x000000, 0.6);
		this.background.isStroked = true;
		this.background.strokeColor = 0x000000;
		this.background.strokeAlpha = 0.7;
		this.background.lineWidth = 4;

		this.background.setOrigin(0.5);

		this.lines = scene.add.graphics();

		// --- ADD MASK HERE ---
		// 1. Create a geometry mask from the background shape
		const maskShape = scene.make.graphics();
		maskShape.fillStyle(0xffffff);
		maskShape.fillCircle(x, y, 250);

		const mask = maskShape.createGeometryMask();
		this.lines.setMask(mask);

		this.add([this.background, this.lines]);

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

		this.drawLines(pointer);
	}

	private dragSelection(pointer: Phaser.Input.Pointer) {
		if (!this.dragging) return;

		const letter = this.getLetterAt(pointer);

		if (letter && !this.selectedLetters.includes(letter)) {
			this.selectedLetters.push(letter);
			letter.select();
		}

		// Always redraw lines on movement, passing the current pointer position
		this.drawLines(pointer);
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

	private drawLines(pointer?: Phaser.Input.Pointer) {
		this.lines.clear();

		if (this.selectedLetters.length === 0) return;

		const lineWidth = 8;
		const lineColor = 0xffffff;
		const lineAlpha = 1;

		this.lines.lineStyle(lineWidth, lineColor, lineAlpha);
		this.lines.fillStyle(lineColor, lineAlpha);

		// 1. Draw connected static lines between selected letters
		this.selectedLetters.forEach((letter, index) => {
			// Draw a rounded cap/joint at each selected letter position
			this.lines.fillCircle(letter.x, letter.y, lineWidth / 2);

			if (index === 0) return;

			const a = this.selectedLetters[index - 1];
			const b = letter;

			this.lines.lineBetween(a.x, a.y, b.x, b.y);
		});

		// 2. Draw line from the last selected letter to current cursor position
		if (pointer && this.dragging) {
			const lastLetter = this.selectedLetters[this.selectedLetters.length - 1];

			// Convert world pointer coordinates into this container's local space
			const localPointer = this.pointToContainer(pointer, new Phaser.Math.Vector2());

			// Draw line to cursor
			this.lines.lineBetween(lastLetter.x, lastLetter.y, localPointer.x, localPointer.y);

			// Draw rounded cap right at the cursor tip
			this.lines.fillCircle(localPointer.x, localPointer.y, lineWidth / 2);
		}
	}

	public setLetters(newLetters: string[]) {
		// Remove old letters
		this.letters.forEach((letter) => letter.destroy());
		this.letters.length = 0;

		// Create new letters
		newLetters.forEach((letterChar, index) => {
			const angle = (index / newLetters.length) * Math.PI * 2;
			const radius = 180;
			const letterX = radius * Math.cos(angle);
			const letterY = radius * Math.sin(angle);

			const letter = new Letter(this.scene, letterX, letterY, letterChar);
			this.letters.push(letter);
			this.add(letter);
		});
	}
}
