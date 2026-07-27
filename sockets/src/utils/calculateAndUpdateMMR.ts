import { GameRoomsMap } from "../socket";
import { PlayerStats } from "../types/user";

/**
 * Winner gains points based on opponent's MMR.
 * Scaled between +10 and +40 (Default ~25 for equal MMR).
 */
function calculateWinnerGain(winnerMMR: number, loserMMR: number): number {
  const diff = loserMMR - winnerMMR;
  return Math.round(Math.max(10, Math.min(40, 25 + 0.1 * diff)));
}

/**
 * Loser loses FEWER points on average to keep the experience casual.
 * Scaled between -5 and -25 (Default ~ -15 for equal MMR).
 * Returns a negative value representing the MMR delta.
 */
function calculateLoserLoss(loserMMR: number, winnerMMR: number): number {
  const diff = winnerMMR - loserMMR; // positive if opponent was higher-rated
  const lossAmount = Math.round(Math.max(5, Math.min(25, 15 - 0.05 * diff)));
  return -lossAmount;
}

/**
 * Handles draw calculations for both players.
 */
function calculateDraw(playerMMR: number, opponentMMR: number): number {
  const diff = opponentMMR - playerMMR;
  return Math.round(Math.max(-12, Math.min(12, 0.06 * diff)));
}

export async function calculateAndUpdateMMR(
    gameId: string,
    winnerId: number,
    loserId: number,
    draw: boolean = false,
): Promise<void> {
  const gameData = GameRoomsMap.get(gameId);
  if (!gameData) {
    console.error("Game data not found");
    return;
  }

  const elapsedTime = Date.now() - gameData.gameStartTime;
  const elapsedTimeMinutes = Math.ceil(elapsedTime / (1000 * 60));

  // Update general playerStats
  const playerStatsWinner = gameData.players.find(
      (player) => player.id === winnerId,
  )?.playerStats;
  const playerStatsLoser = gameData.players.find(
      (player) => player.id === loserId,
  )?.playerStats;

  if (playerStatsWinner === undefined || playerStatsLoser === undefined) {
    console.error("Player stats update failed, game data not found");
    return;
  }

  playerStatsLoser.playTimeMinutes += elapsedTimeMinutes;
  playerStatsWinner.playTimeMinutes += elapsedTimeMinutes;
  void updateGameStats(playerStatsWinner, true, winnerId);
  void updateGameStats(playerStatsLoser, false, loserId);

  if (gameData?.isPrivate) {
    GameRoomsMap.delete(gameId);
    return; // Do not update MMR for private games
  }

  const winnerMMR = gameData.players.find(
      (player) => player.id === winnerId,
  )?.mmr;
  const loserMMR = gameData.players.find(
      (player) => player.id === loserId,
  )?.mmr;
  GameRoomsMap.delete(gameId);

  if (winnerMMR === undefined || loserMMR === undefined) {
    console.error("MMR calculation failed: Player MMR not found.");
    return;
  }

  // Asymmetric MMR calculation logic
  const winnerGain = !draw
      ? calculateWinnerGain(winnerMMR, loserMMR)
      : calculateDraw(winnerMMR, loserMMR);

  const loserGain = !draw
      ? calculateLoserLoss(loserMMR, winnerMMR)
      : calculateDraw(loserMMR, winnerMMR);

  // Apply new MMR values with a floor limit of 0
  const newWinnerMMR = Math.max(0, winnerMMR + winnerGain);
  const newLoserMMR = Math.max(0, loserMMR + loserGain);

  const res = await fetch(`${process.env.API_URL}/api/mmr/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameId: Number(gameId.slice(0, 1)),
      userId: winnerId,
      mmr: newWinnerMMR,
      mmrSecret: process.env.MMR_SECRET,
    }),
  });
  if (!res.ok) {
    console.error("Failed to update winner MMR:", await res.text());
    return;
  }

  const res2 = await fetch(`${process.env.API_URL}/api/mmr/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameId: Number(gameId.slice(0, 1)),
      userId: loserId,
      mmr: newLoserMMR,
      mmrSecret: process.env.MMR_SECRET,
    }),
  });
  if (!res2.ok) {
    console.error("Failed to update loser MMR:", await res2.text());
    return;
  }
}

async function updateGameStats(
    playerStats: PlayerStats,
    won: boolean,
    id: number,
) {
  console.log("Updating this: " + playerStats.gamesPlayed);

  const res = await fetch(`${process.env.API_URL}/api/playerStats/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameId: playerStats.gameId,
      userId: id,
      gamesPlayed: playerStats.gamesPlayed + 1,
      winRatio: calculateNewWinRatio(
          playerStats.gamesPlayed,
          playerStats.winRatio,
          won,
      ),
      playTimeMinutes: playerStats.playTimeMinutes,
      mmrSecret: process.env.MMR_SECRET,
    }),
  });
  if (!res.ok) {
    console.error("Failed to update game stats:", await res.text());
    return;
  }
}

function calculateNewWinRatio(
    gamesPlayed: number,
    oldWinRatio: number,
    won: boolean,
): number {
  const winsCurrent = gamesPlayed * oldWinRatio + (won ? 1 : 0);
  return winsCurrent / (gamesPlayed + 1);
}