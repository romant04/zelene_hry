import {HorolezciGameState, HorolezciPlayer} from "../../types/game";
import {calculateAndUpdateMMR} from "../calculateAndUpdateMMR";

export function evaluateGuesses(gameState: HorolezciGameState, player: HorolezciPlayer, enemy: HorolezciPlayer, horolezciNamespace: any, gameId: string) {
    const distanceMultiplier = 30; // We do * 50 because the height is roughly 1500, and we want to make sure the player can reach the top of the pyramid in a reasonable number of rounds
    // Evaluate the guesses of both players
    const playerGuess = player!.lockedInGuess?.letter?.toLowerCase();
    const enemyGuess = enemy!.lockedInGuess?.letter?.toLowerCase();

    const numberOfPlayerGuessOccurrences = playerGuess ? gameState.correctLetters.filter(x => x.toLowerCase() === playerGuess.toLowerCase() && !gameState.guessedLetters.includes(x)).length : 0;
    if (numberOfPlayerGuessOccurrences > 0) {
        const distance = numberOfPlayerGuessOccurrences * player!.lockedInGuess.scoreMultiplier;
        player!.distanceTraveled += distance * distanceMultiplier;
    }
    else {
        player!.distanceTraveled -= 20 * distanceMultiplier; // Penalize the player for an incorrect guess
        if (player!.distanceTraveled < player.lastSafetyPin) {
            player!.distanceTraveled = player.lastSafetyPin; // Ensure the distance doesn't go below 0
        }
    }

    const numberOfEnemyGuessOccurrences = enemyGuess ? gameState.correctLetters.filter(x => x.toLowerCase() === enemyGuess.toLowerCase() && !gameState.guessedLetters.includes(x)).length : 0;
    if (numberOfEnemyGuessOccurrences > 0) {
        const distance = numberOfEnemyGuessOccurrences * enemy!.lockedInGuess.scoreMultiplier;
        enemy!.distanceTraveled += distance * distanceMultiplier;
    }
    else {
        enemy!.distanceTraveled -= 20 * distanceMultiplier; // Penalize the enemy for an incorrect guess
        if (enemy!.distanceTraveled < enemy.lastSafetyPin) {
            enemy!.distanceTraveled = enemy.lastSafetyPin; // Ensure the distance doesn't go below 0
        }
    }

    // Add guessed letters - needs to be added after the evaluation of both players to allow for the case where both players guess the same letter in the same round
    gameState.guessedLetters.push(playerGuess); // Add the guessed letter to the guessedLetters array
    gameState.guessedLetters.push(enemyGuess); // Add the guessed letter to the guessedLetters array

    // Reset locked in guesses for the next round
    player!.lockedInGuess = {letter: "", scoreMultiplier: 1};
    enemy!.lockedInGuess = {letter: "", scoreMultiplier: 1};

    // Broadcast updated game state to both players
    horolezciNamespace.to(gameId).emit("roundEnded", {data: gameState, playerGuess, enemyGuess});
}

export function checkForGameover(gameState: HorolezciGameState, player: HorolezciPlayer, enemy: HorolezciPlayer, horolezciNamespace: any, gameId: string) {
    if (player.distanceTraveled >= 1450 && enemy.distanceTraveled >= 1450) {
        horolezciNamespace.to(gameId).emit("gameOver", {winner: null}); // It's a tie
        void calculateAndUpdateMMR(gameId, player.id, enemy.id, true);
        return true;
    }

    if (player.distanceTraveled >= 1450) {
        horolezciNamespace.to(gameId).emit("gameOver", {winner: player});
        void calculateAndUpdateMMR(gameId, player.id, enemy.id, false);
        return true;
    }

    if (enemy.distanceTraveled >= 1450) {
        horolezciNamespace.to(gameId).emit("gameOver", {winner: enemy});
        void calculateAndUpdateMMR(gameId, enemy.id, player.id, false);
        return true;
    }

    return false;
}