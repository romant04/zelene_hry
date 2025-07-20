import Phaser from 'phaser';
import { type Socket } from 'socket.io-client';
import type { CardData, GameState } from '../types/game-state';
import { isCardPlayable } from '../utils/game-logic';
import { Card } from '$lib/phaser/prsi/scene/Card';
import { TurnToken } from '$lib/phaser/prsi/scene/TurnToken';
import { rnd } from '$lib/phaser/prsi/utils/general';
import { isGameInProgress } from '$lib/phaser/prsi/utils/general';
import { toggleSvrsek } from '../../../../stores/prsi/svrsek';
import { toggleGameOver } from '../../../../stores/prsi/game-over';
import { setDisconnect } from '../../../../stores/prsi/disconnect';

function getTextureFromSuit(suit: string) {
	switch (suit) {
		case 'c':
			return 'cerveny';
		case 'e':
			return 'zeleny';
		case 'z':
			return 'zaludy';
		default:
			return 'kule';
	}
}

export default class MainScene extends Phaser.Scene {
	private socket: Socket;
	private token: string;
	private turnToken: TurnToken | null = null;

	private pendingGameState: GameState | null = null;
	private myTurn = false;

	private isEffectActive = false;
	private sedmaCount = 0;
	private eso = false; // Track if eso effect is active
	private svrsek: null | string = null; // Track if svrsek effect is active

	private hand: Card[] = [];
	private enemyHand = 0;
	private playedCards: Card[] = [];
	private playArea!: Phaser.GameObjects.Zone;
	private playAreaGraphics!: Phaser.GameObjects.Graphics;
	private deck: Card[] = [];

	private handPosition = { x: 250, y: 530 };

	initDeck(deck: CardData[]) {
		const deckX = this.cameras.main.width / 3 - 30;
		const deckY = this.cameras.main.height / 2 - 50;
		let i = 0;

		for (const c of deck) {
			const card = new Card(
				this,
				deckX,
				deckY - Math.min(i * 3, 10),
				`${c.suit}_${c.rank}`,
				'card-back'
			)
				.setOrigin(0.5, 0.5)
				.setAngle(i === 0 ? i : rnd(-5, 5));
			card.setDisplaySize(100, 140);
			card.originalScale = card.scale; // Store original scale for animations
			this.deck.push(card);

			card.on('pointerdown', () => {
				console.log(this.eso);
				if (card.isDrawn || (this.eso && this.isEffectActive)) {
					return;
				}
				card.isDrawn = true;

				const tempSedmaCount = this.sedmaCount === 0 ? 0.5 : this.sedmaCount;
				for (let i = 0; i < tempSedmaCount * 2; i++) {
					this.drawCard(tempSedmaCount >= 1);
				}
				this.turnToken?.changePosition(
					this.myTurn ? this.cameras.main.height * 0.55 : this.cameras.main.height * 0.25
				);
			});
			i++;
		}
	}
	initHands(state: GameState) {
		this.redrawEnemyHand();

		this.hand = state.players
			.find((x) => x.token === this.token)!
			.cards.map((card) => {
				return new Card(
					this,
					this.handPosition.x + this.hand.length * 80,
					this.handPosition.y,
					`${card.suit}_${card.rank}`,
					'card-back'
				).setOrigin(0.5, 0.5);
			});
		this.hand.forEach((card) => {
			card.flip();
			card.originalScale = card.scale;
			this.enableCardDragging(card);
		});

		this.updateHandLayout();
	}
	initGameState(state: GameState) {
		this.myTurn =
			state.currentPlayerId === state.players.find((x) => x.token === this.token)?.id;

		const texture = getTextureFromSuit(
			state.svrsek ? state.svrsek : state.centerCards[state.centerCards.length - 1].suit
		);
		this.turnToken = new TurnToken(
			this,
			this.cameras.main.width * 0.7,
			this.myTurn ? this.cameras.main.height * 0.55 : this.cameras.main.height * 0.25,
			texture
		).setInteractive();
		this.turnToken.on('pointerdown', () => {
			if (this.isEffectActive && this.eso) {
				this.myTurn = false;
				this.socket.emit('turnSkipped');
				this.turnToken?.changePosition(this.cameras.main.height * 0.25);
				this.eso = false; // Reset eso effect after skipping turn
			}
		});

		if (state.centerCards) {
			for (const c of state.centerCards) {
				this.updateCenterAfterEnemyPlayed(c, true, true);
			}
		}

		this.initDeck(state.deck);

		const gameInProgress = isGameInProgress(state);

		if (!gameInProgress) {
			this.enemyHand = 5;
			this.initHands(state);
		}

		if (gameInProgress) {
			console.log('Game in progress, initializing player hands');
			this.enemyHand = state.players.find((x) => x.token !== this.token)?.cards.length || 0;
			this.initHands(state);
		}
	}

	enableCardHover(card: Card) {
		card.on('pointerover', () => {
			this.input.manager.canvas.style.cursor = 'grab';
			card.setDepth(1000); // bring to front
			card.setTint(0xffffaa);
			this.tweens.add({
				targets: card,
				y: card.y - 20,
				scale: card.scale * 1.1,
				duration: 150,
				ease: 'Power2'
			});
		});

		card.on('pointerout', () => {
			this.input.manager.canvas.style.cursor = 'default';
			card.setDepth(card.index); // send back
			card.clearTint();
			this.tweens.add({
				targets: card,
				y: card.originalY,
				scale: card.originalScale,
				duration: 150,
				ease: 'Power2'
			});
		});
	}
	enableCardDragging(card: Card) {
		this.enableCardHover(card);
		this.input.setDraggable(card);

		card.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
			if (!this.myTurn) {
				console.log('Not your turn, cannot drag card');
				return; // Ignore drag if it's not the player's turn
			}

			this.playAreaGraphics.setVisible(true);
			this.input.manager.canvas.style.cursor = 'grabbing';
			card.setPosition(dragX, dragY);
			card.setAngle(0);
			card.setDepth(1000);
		});

		card.on('dragend', () => {
			this.playAreaGraphics.setVisible(false);
			this.input.manager.canvas.style.cursor = 'default';
			if (Phaser.Geom.Rectangle.Contains(this.playArea.getBounds(), card.x, card.y)) {
				if (
					!isCardPlayable(
						{ suit: card.suit, rank: card.rank },
						{
							suit: this.playedCards[this.playedCards.length - 1].suit,
							rank: this.playedCards[this.playedCards.length - 1].rank
						},
						this.isEffectActive,
						this.svrsek
					)
				) {
					// Red tint animation on the card
					card.setTint(0xff0000);

					this.updateHandLayout();
					const tim = setTimeout(() => {
						card.clearTint();
						clearTimeout(tim);
					}, 500);
					return;
				}

				this.playedCards.push(card);
				this.isEffectActive = true;
				if (card.rank === 'sedma') {
					this.sedmaCount++;
				}

				card.disableInteractive();
				card.clearTint();
				card.setDepth(this.playedCards.length); // bring to front of played cards
				this.tweens.add({
					targets: card,
					scale: card.originalScale,
					x: this.playArea.x,
					y: this.playArea.y - rnd(-10, 10),
					duration: 200
				});
				card.setAngle(rnd(-10, 10));

				this.hand = this.hand.filter((c) => c !== card);
				this.updateHandLayout();

				const texture = getTextureFromSuit(card.suit);
				this.turnToken?.changeTexture(texture);
				this.turnToken?.changePosition(this.cameras.main.height * 0.25);

				if (card.rank !== 'svrsek') {
					this.svrsek = null; // Reset svrsek effect if not played

					this.socket.emit('cardPlayed', {
						suit: card.suit,
						rank: card.rank
					} as CardData);
				} else {
					toggleSvrsek(card.suit);
				}

				this.myTurn = false;

				if (card.rank === 'eso') {
					this.eso = true;
				}
			} else {
				// Return card to hand position if dropped outside
				this.updateHandLayout();
			}
		});
	}

	setupListeners() {
		this.socket.on('drawCard', () => {
			this.enemyHand++;
			this.redrawEnemyHand();

			this.myTurn = true;
			this.turnToken?.changePosition(this.cameras.main.height * 0.55);
			this.isEffectActive = false;
			this.sedmaCount = 0;

			// Remove the card from top of the deck (enemy has it now in hand)
			if (this.deck.length > 0) {
				const card = this.deck.pop();
				card?.destroy();
			}
		});

		this.socket.on('playerDisconnected', () => {
			setDisconnect(true);
		});
		this.socket.on('playerReconnected', () => {
			setDisconnect(false);
		});

		this.socket.on('gameOver', (name: string) => {
			this.myTurn = false;

			setTimeout(() => {
				toggleGameOver(name);
			}, 1000);
		});

		this.socket.on('turnSkipped', () => {
			this.myTurn = true;
			this.turnToken?.changePosition(this.cameras.main.height * 0.55);
			this.isEffectActive = false;
			this.eso = false; // Reset eso effect after skipping turn
		});

		this.socket.on('cardPlayed', (card: CardData) => {
			this.enemyHand--;
			this.updateCenterAfterEnemyPlayed(card);
			this.redrawEnemyHand();

			this.myTurn = true;
			this.turnToken?.changePosition(this.cameras.main.height * 0.55);
			this.isEffectActive = true;

			if (card.rank === 'sedma') {
				this.sedmaCount++;
			}
			if (card.rank === 'eso') {
				this.eso = true;
			}
			if (card.rank !== 'svrsek') {
				this.svrsek = null;
			}
		});

		this.socket.on('gameState', (data: GameState) => {
			if (this.deck.length > 0) {
				return; // Don't redraw deck if it's already populated
			}

			if (this.registry.get('assetsLoaded') !== true) {
				this.pendingGameState = data; // Store pending game state
				return;
			}

			this.initGameState(data);
		});

		this.socket.on('svrsek', (data: { suit: string; old: string }) => {
			this.enemyHand--;
			this.updateCenterAfterEnemyPlayed({
				suit: data.old as 'c' | 'e' | 'z' | 'k',
				rank: 'svrsek'
			});
			this.redrawEnemyHand();

			this.svrsek = data.suit;
			this.myTurn = true;
			const texture = getTextureFromSuit(data.suit);
			this.turnToken?.changeTexture(texture);
			this.turnToken?.changePosition(this.cameras.main.height * 0.55);
		});
		this.socket.on('suitChange', (suit: string) => {
			this.svrsek = suit;
			const texture = getTextureFromSuit(suit);
			this.turnToken?.changeTexture(texture);
		});

		this.socket.on('deckReshuffled', (deck: CardData[]) => {
			console.log('Deck reshuffled, updating deck');
			console.log(deck);
			this.initDeck(deck);
			// Redraw center cards, leave only the top one
			this.playedCards.forEach((card, i) => {
				if (i < this.playedCards.length - 1) {
					card.destroy(); // Destroy all but the last played card
				}
			});
		});
	}

	constructor(socket: Socket, token: string) {
		super('MainScene');
		this.socket = socket;
		this.token = token;
		this.setupListeners();
		this.socket.emit('getGameState');
	}

	preload() {
		this.handPosition = {
			x: this.cameras.main.width / 2,
			y: this.cameras.main.height * 0.8
		};
	}

	create() {
		if (this.registry.get('assetsLoaded') && this.pendingGameState && this.deck.length === 0) {
			this.initGameState(this.pendingGameState);
			this.pendingGameState = null; // Clear pending game state after processing
		}

		this.add
			.image(0, 0, 'wood')
			.setOrigin(0)
			.setDisplaySize(this.cameras.main.width, this.cameras.main.height)
			.setDepth(-10); // behind everything

		this.playArea = this.add
			.zone(this.cameras.main.width / 2, this.cameras.main.height / 2, 150, 200)
			.setOrigin(0.5, 0.5)
			.setRectangleDropZone(150, 200);
		this.playAreaGraphics = this.add
			.graphics()
			.lineStyle(2, 0x00ff00)
			.strokeRectShape(this.playArea.getBounds());
		this.playAreaGraphics.setVisible(false); // Hide the play area graphics by default

		this.redrawEnemyHand();
	}

	updateCenterAfterEnemyPlayed(c: CardData, start = false, rejoin = false) {
		const x = !start ? this.playArea.x : this.cameras.main.width / 2;
		const y = !start ? this.playArea.y : this.cameras.main.height / 2;
		const card = new Card(
			this,
			x,
			y - rnd(-10, 10),
			`${c.suit}_${c.rank}`,
			'card-back'
		).setOrigin(0.5, 0.5);

		this.playedCards.push(card);

		if (card.rank !== 'svrsek' && !rejoin) {
			const texture = getTextureFromSuit(card.suit);
			this.turnToken?.changeTexture(texture);
		}

		card.disableInteractive();
		card.clearTint();
		card.setDepth(this.playedCards.length); // bring to front of played cards
		card.setAngle(rnd(-10, 10));

		card.flip();
	}

	redrawEnemyHand() {
		// Collect all enemy cards into an array
		const enemyCards = this.children.list.filter(
			(child) => child instanceof Card && child.isEnemyCard
		) as Card[];

		// Destroy all enemy cards
		enemyCards.forEach((card) => card.destroy());

		// Redraw updated enemy hand
		for (let i = 0; i < this.enemyHand; i++) {
			const offset = i - Math.floor(this.enemyHand / 2);
			const angle = offset * Phaser.Math.DegToRad(this.enemyHand > 8 ? 10 : 12);

			const radius = this.enemyHand > 8 ? 200 : 300;
			const x = this.cameras.main.width / 2 + radius * Math.sin(angle);
			const y = this.cameras.main.height * 0.15 - radius * (1 - Math.cos(angle)); // flip curve upward

			const card = new Card(this, x, y, 'card-front', 'card-back').setOrigin(0.5, 0.5);
			card.angle = Phaser.Math.RadToDeg(-angle) * 0.6;
			card.setDisplaySize(100, 140);
			card.originalScale = card.scale;
			card.isEnemyCard = true;

			this.add.existing(card);
		}
	}

	drawCard(multiple = false) {
		if (this.deck.length === 0 || (!this.myTurn && !multiple)) return;

		this.isEffectActive = false;
		this.sedmaCount = 0;

		this.myTurn = false;

		const card = this.deck.pop()!;
		this.socket.emit('drawCard', { suit: card.suit, rank: card.rank });
		card.setInteractive({ draggable: true });
		card.isDrawn = true; // Mark the card as drawn

		const targetIndex = this.hand.length;
		const targetX = this.handPosition.x + targetIndex * 80;
		const targetY = this.handPosition.y;

		this.tweens.add({
			targets: card,
			x: targetX,
			y: targetY,
			duration: 300,
			ease: 'Power2',
			onComplete: () => {
				this.hand.push(card);
				card.flip();
				this.updateHandLayout();
				this.enableCardDragging(card);
			}
		});
	}

	updateHandLayout() {
		const spacingAngle = Phaser.Math.DegToRad(this.hand.length > 8 ? 10 : 12); // angle between cards in radians
		const midIndex = (this.hand.length - 1) / 2;
		const radius = this.hand.length > 8 ? 200 : 300; // arc radius (smaller = tighter fan)
		const centerX = this.handPosition.x;
		const centerY = this.hand.length > 8 ? this.handPosition.y - 30 : this.handPosition.y;

		this.hand.forEach((card, index) => {
			const offset = index - midIndex;
			const angle = offset * spacingAngle;

			const x = centerX + radius * Math.sin(angle);
			const y = centerY + radius * (1 - Math.cos(angle));

			const depth = index;
			card.index = index;

			card.originalY = y; // Store original Y position for reference

			this.tweens.add({
				targets: card,
				x,
				y,
				depth,
				angle: Phaser.Math.RadToDeg(angle) * 0.6, // rotate slightly with curve
				duration: 300,
				ease: 'Power2'
			});
		});
	}
}
