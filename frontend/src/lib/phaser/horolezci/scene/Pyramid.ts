import Phaser from 'phaser';
import LetterButton from './LetterButton';

export default class Pyramid extends Phaser.GameObjects.Container {
	// Store buttons in a 2D array [row][col] for easy row-based access
	private rowButtons: LetterButton[][] = [];
	private selectedButton: LetterButton | null = null;
	public onSelectionChange: ((button: LetterButton | null) => void) | null = null;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		rows: number = 4,
		labels: string[] | string[][] = []
	) {
		super(scene, x, y);

		const horizontalSpacing = 76;
		const verticalSpacing = 67;

		const totalHeight = (rows - 1) * verticalSpacing;
		const startY = -(totalHeight / 2);

		const bgGraphics = scene.add.graphics();

		const innerCircleRadius = 33;
		const blackBorderThickness = 14;
		const whiteBorderThickness = 8;

		// 1. Pass 1: Draw outer white merged circles
		bgGraphics.fillStyle(0xffffff, 1);
		for (let row = 0; row < rows; row++) {
			const count = row + 1;
			const rowWidth = (count - 1) * horizontalSpacing;
			const rowStartX = -(rowWidth / 2);
			const rowY = startY + row * verticalSpacing;

			for (let col = 0; col < count; col++) {
				const buttonX = rowStartX + col * horizontalSpacing;
				bgGraphics.fillCircle(
					buttonX,
					rowY,
					innerCircleRadius + blackBorderThickness + whiteBorderThickness
				);
			}
		}

		// 2. Pass 2: Draw inner black merged circles
		bgGraphics.fillStyle(0x000000, 1);
		for (let row = 0; row < rows; row++) {
			const count = row + 1;
			const rowWidth = (count - 1) * horizontalSpacing;
			const rowStartX = -(rowWidth / 2);
			const rowY = startY + row * verticalSpacing;

			for (let col = 0; col < count; col++) {
				const buttonX = rowStartX + col * horizontalSpacing;
				bgGraphics.fillCircle(buttonX, rowY, innerCircleRadius + blackBorderThickness);
			}
		}

		this.add(bgGraphics);

		// 3. Pass 3: Create LetterButtons row by row
		let flatIndex = 0;

		for (let row = 0; row < rows; row++) {
			const count = row + 1;
			const rowWidth = (count - 1) * horizontalSpacing;
			const rowStartX = -(rowWidth / 2);
			const rowY = startY + row * verticalSpacing;

			this.rowButtons[row] = [];

			for (let col = 0; col < count; col++) {
				const buttonX = rowStartX + col * horizontalSpacing;

				// Check if labels were passed as 2D array or 1D array
				let label = (flatIndex + 1).toString();
				if (Array.isArray(labels[row]) && (labels[row] as string[])[col] !== undefined) {
					label = (labels[row] as string[])[col];
				} else if (typeof labels[flatIndex] === 'string') {
					label = labels[flatIndex] as string;
				}

				const button = new LetterButton(scene, buttonX, rowY, label);
				button.row = row + 1; // Store row number (1-based) in the button for reference
				button.onClick((clickedButton) => this.selectButton(clickedButton));

				this.add(button);
				this.rowButtons[row].push(button);

				flatIndex++;
			}
		}

		this.setDepth(100);
		this.setScrollFactor(0, 0, true);
		this.setVisible(false);
		this.setScale(0);

		scene.add.existing(this);
	}

	public selectButton(button: LetterButton): void {
		if (this.selectedButton === button) {
			return;
		}

		this.selectedButton?.deselect();
		button.select();
		this.selectedButton = button;
		this.onSelectionChange?.(button);
	}

	public clearSelection(): void {
		this.selectedButton?.deselect();
		this.selectedButton = null;
		this.onSelectionChange?.(null);
	}

	public getSelectedButton(): LetterButton | null {
		return this.selectedButton;
	}

	public getSelectedLetter(): string | null {
		return this.selectedButton?.letter ?? null;
	}

	/**
	 * Set letters for a specific row index (0 is top row, 1 is second row, etc.)
	 */
	public setRowLetters(rowIndex: number, letters: string[]): void {
		const row = this.rowButtons[rowIndex];
		if (!row) return;
		letters.forEach((letter, colIndex) => {
			if (row[colIndex]) row[colIndex].setLetter(letter);
		});
	}

	/**
	 * Set letters for all rows at once using a 2D array
	 * e.g. [['A'], ['B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I', 'J']]
	 */
	public setAllRowsLetters(rowLetters: string[][]): void {
		rowLetters.forEach((letters, rowIndex) => {
			this.setRowLetters(rowIndex, letters);
		});
	}

	/**
	 * Get a specific button by row and column
	 */
	public getButtonAt(row: number, col: number): LetterButton | undefined {
		return this.rowButtons[row]?.[col];
	}

	public hide() {
		this.scene.tweens.killTweensOf(this);
		this.scene.tweens.add({
			targets: this,
			scale: 0,
			duration: 500,
			onComplete: () => {
				this.setVisible(false);
			}
		});
	}
	public show() {
		this.scene.tweens.killTweensOf(this);
		this.setVisible(true);
		this.scene.tweens.add({
			targets: this,
			scale: 1,
			duration: 500
		});
	}
}
