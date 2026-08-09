import Phaser from 'phaser';
import { AnimatedCharText } from '$lib/phaser/horolezci/scene/AnimatedCharText';

const MAX_LINE_WIDTH = 1200;
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

			const charText = new AnimatedCharText(
				this.scene,
				letterX + LETTER_SIZE / 2,
				LETTER_SIZE / 2,
				char.toUpperCase()
			);

			this.add(box);
			this.add(charText);

			if (!guessedLetters.has(char.toLowerCase()) && isLetter(char)) {
				charText.hide();
			}
		}

		this.wordWidth = text.length * LETTER_SIZE + Math.max(0, text.length - 1) * LETTER_GAP;
	}
}

export class SecretWordLine extends Phaser.GameObjects.Container {
	public readonly lineWidth: number;
	public readonly lineHeight: number;
	private readonly fullText: string; // NEW: keep the original text around

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string,
		guessedLetters: Set<string> = new Set()
	) {
		super(scene, x, y);

		this.fullText = text;
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
					if (child instanceof AnimatedCharText) {
						const char = child.char.toLowerCase();
						if (isLetter(char) && guessedLetters.has(char)) {
							child.animate();
						}
					}
				});
			}
		});
	}

	/** Call this once you detect the word is fully solved. */
	public celebrateComplete() {
		this.playLetterWave();
		this.scene.sound.play('celebrate', { volume: 0.5, loop: false });
	}

	/** Quick left-to-right pulse across every letter box+glyph. */
	private playLetterWave() {
		let index = 0;
		const allTargets: Phaser.GameObjects.GameObject[] = [];

		this.list.forEach((wordContainer) => {
			if (wordContainer instanceof SecretWord) {
				wordContainer.list.forEach((child) => allTargets.push(child));
			}
		});

		allTargets.forEach((target: Phaser.GameObjects.GameObject) => {
			this.scene.tweens.add({
				targets: target,
				scale: { from: 1, to: 1.25 },
				yoyo: true,
				duration: 180,
				delay: index * 25,
				ease: 'Sine.easeInOut'
			});
			index++;
		});
	}
}
