import Phaser from 'phaser';

const MAX_LINE_WIDTH = 1000;
const LETTER_SIZE = 36;
const LETTER_GAP = 3;
const WORD_GAP = 20;
const LINE_HEIGHT = 45;

function isLetter(char: string): boolean {
	return /^\p{L}$/u.test(char);
}

class SecretWord extends Phaser.GameObjects.Container {
	public readonly wordWidth: number;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string,
		guessedLetters: Set<string> = new Set()
	) {
		super(scene, x, y);

		for (let i = 0; i < text.length; i++) {
			const char = text[i];

			const letterX = i * (LETTER_SIZE + LETTER_GAP);

			const box = scene.add.graphics();
			box.fillStyle(0xcdcdcd, 1);
			box.fillRoundedRect(
				letterX,
				0,
				LETTER_SIZE,
				LETTER_SIZE,
				10 // corner radius
			);

			const charText = scene.add.text(
				letterX + LETTER_SIZE / 2,
				LETTER_SIZE / 2,
				char.toUpperCase(),
				{
					fontSize: '26px',
					color: '#000000',
					fontStyle: 'bold'
				}
			);

			charText.setOrigin(0.5);

			this.add(box);
			this.add(charText);

			if (!guessedLetters.has(char.toLowerCase()) && isLetter(char)) {
				charText.setVisible(false);
			}
		}

		this.wordWidth = text.length * LETTER_SIZE + Math.max(0, text.length - 1) * LETTER_GAP;
	}
}

export class SecretWordLine extends Phaser.GameObjects.Container {
	public readonly lineWidth: number;
	public readonly lineHeight: number;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string,
		guessedLetters: Set<string> = new Set()
	) {
		super(scene, x, y);

		const words = text.split(' ');

		const lines: {
			words: SecretWord[];
			width: number;
		}[] = [];

		let currentWords: SecretWord[] = [];
		let currentWidth = 0;

		// First pass: create lines
		for (const word of words) {
			const secretWord = new SecretWord(scene, 0, 0, word, guessedLetters);

			const newWidth =
				currentWords.length === 0
					? secretWord.wordWidth
					: currentWidth + WORD_GAP + secretWord.wordWidth;

			if (newWidth > MAX_LINE_WIDTH && currentWords.length > 0) {
				lines.push({
					words: currentWords,
					width: currentWidth
				});

				currentWords = [];
				currentWidth = secretWord.wordWidth;
				currentWords.push(secretWord);
			} else {
				currentWords.push(secretWord);
				currentWidth = newWidth;
			}
		}

		// Add remaining words
		if (currentWords.length > 0) {
			lines.push({
				words: currentWords,
				width: currentWidth
			});
		}

		// Second pass: position lines centered
		let currentY = 0;

		for (const line of lines) {
			let currentX = (MAX_LINE_WIDTH - line.width) / 2;

			for (const word of line.words) {
				word.setPosition(currentX, currentY);

				this.add(word);

				currentX += word.wordWidth + WORD_GAP;
			}

			currentY += LINE_HEIGHT;
		}

		this.lineWidth = MAX_LINE_WIDTH;
		this.lineHeight = currentY;
	}

	public updateGuessedLetters(guessedLetters: Set<string>) {
		this.list.forEach((wordContainer) => {
			if (wordContainer instanceof SecretWord) {
				wordContainer.list.forEach((child) => {
					if (child instanceof Phaser.GameObjects.Text) {
						const char = child.text.toLowerCase();
						child.setVisible(guessedLetters.has(char) || !isLetter(char));
					}
				});
			}
		});
	}
}
