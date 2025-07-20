import Phaser from 'phaser';

export class Card extends Phaser.GameObjects.Sprite {
	private readonly frontTexture: string | Phaser.Textures.Texture;
	private readonly backTexture: string | Phaser.Textures.Texture;
	private isFaceUp: boolean;

	public originalScale: number | undefined;
	public originalY: number;
	public index = 0; // Index in the hand, used for layout
	public isEnemyCard = false;
	public isDrawn = false;

	public suit: 'c' | 'e' | 'z' | 'k' = 'c';
	public rank: 'sedma' | 'osma' | 'devitka' | 'desitka' | 'eso' | 'kral' | 'spodek' | 'svrsek' =
		'sedma';

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		frontTexture: string | Phaser.Textures.Texture,
		backTexture: string | Phaser.Textures.Texture
	) {
		super(scene, x, y, backTexture); // Start with the back texture

		this.originalY = y;

		this.frontTexture = frontTexture;
		this.backTexture = backTexture;
		this.isFaceUp = false;

		// Set suit and rank based on the front texture name
		const parts = (frontTexture as string).split('_');
		this.suit = parts[0] as 'c' | 'e' | 'z' | 'k';
		this.rank = parts[1] as
			| 'sedma'
			| 'osma'
			| 'devitka'
			| 'desitka'
			| 'eso'
			| 'kral'
			| 'spodek'
			| 'svrsek';

		scene.add.existing(this);
		this.setInteractive();
	}

	flip() {
		const scaleX = this.scaleX; // Store current scaleX

		this.scene.tweens.add({
			targets: this,
			scaleX: 0,
			duration: 150,
			ease: 'Linear',
			onComplete: () => {
				this.toggleFace();

				this.scene.tweens.add({
					targets: this,
					scaleX: scaleX,
					duration: 150,
					ease: 'Linear'
				});
			}
		});
	}

	toggleFace() {
		this.isFaceUp = !this.isFaceUp;
		this.setTexture(
			this.isFaceUp ? (this.frontTexture as string) : (this.backTexture as string)
		);
	}
}
