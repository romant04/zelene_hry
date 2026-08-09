import Phaser from 'phaser';

export default class LetterButton extends Phaser.GameObjects.Container {
	public circle: Phaser.GameObjects.Arc;
	public text: Phaser.GameObjects.Text;
	public letter: string;
	public isSelected: boolean = false;
	public row = -1;

	private static readonly COLOR_DEFAULT = 0xffffff;
	private static readonly COLOR_HOVER = 0xdddddd;
	private static readonly COLOR_DOWN = 0xaaaaaa;
	private static readonly COLOR_SELECTED = 0xffd700; // yellow

	constructor(scene: Phaser.Scene, x: number, y: number, letter = 'A') {
		super(scene, x, y);

		const radius = 33;
		this.letter = letter;

		this.circle = scene.add.circle(0, 0, radius, LetterButton.COLOR_DEFAULT);

		this.text = scene.add
			.text(0, 0, letter, {
				fontSize: '36px',
				color: '#000',
				fontStyle: 'bold',
				padding: { top: 5, right: 5, left: 5, bottom: 5 }
			})
			.setOrigin(0.5);

		this.add([this.circle, this.text]);

		this.circle.setScrollFactor(0);
		this.circle.setInteractive({ useHandCursor: true });

		// Visual feedback now respects selection state
		this.circle.on('pointerdown', () => {
			if (!this.isSelected) this.circle.setFillStyle(LetterButton.COLOR_DOWN);
		});
		this.circle.on('pointerup', () => {
			if (!this.isSelected) this.circle.setFillStyle(LetterButton.COLOR_DEFAULT);
		});
		this.circle.on('pointerout', () => {
			if (!this.isSelected) this.circle.setFillStyle(LetterButton.COLOR_DEFAULT);
		});
		this.circle.on('pointerover', () => {
			if (!this.isSelected) this.circle.setFillStyle(LetterButton.COLOR_HOVER);
		});

		scene.add.existing(this);
	}

	/** Fires on click, independent of the visual hover/press handlers above */
	public onClick(callback: (button: LetterButton) => void): void {
		this.circle.on('pointerup', () => callback(this));
	}

	public select(): void {
		this.isSelected = true;
		this.circle.setFillStyle(LetterButton.COLOR_SELECTED);
	}

	public deselect(): void {
		this.isSelected = false;
		this.circle.setFillStyle(LetterButton.COLOR_DEFAULT);
	}

	public setLetter(newLetter: string): void {
		this.letter = newLetter;
		this.text.setText(newLetter);
	}
}
