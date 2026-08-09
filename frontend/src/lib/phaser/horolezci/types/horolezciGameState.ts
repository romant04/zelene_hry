export interface HorolezciPlayer {
	id: number;
	name: string;
	token: string;
	isConnected: boolean;
	distanceTraveled: number;
	lockedInGuess: {
		letter: string;
		scoreMultiplier: number;
	};
	readyForNextRound: boolean;
	safetyPins: number;
	lastSafetyPin: number;
}
export interface HorolezciGameState {
	players: HorolezciPlayer[];
	pyramid: string[][];
	guessedLetters: string[];
	correctLetters: string[];
	secret: {
		type: string;
		secret: string;
	};
	roundEndTime: number | null;
	msRemaining: number | null;
}
