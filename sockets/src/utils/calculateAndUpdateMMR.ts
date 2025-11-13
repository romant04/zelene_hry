import { GameRoomsMap } from "../socket";

// Linear function from [-200,2] to [200,50]
function calculateGain(winnerMMR: number, loserMMR: number) {
  const diff = loserMMR - winnerMMR;
  return Math.round(Math.max(2, Math.min(50, 0.12 * diff + 26)));
}

// Linear function from [-200,-12] to [200,12]
function calculateDraw(playerMMR: number, opponentMMR: number) {
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
  if (gameData?.isPrivate) {
    return; // Do not update MMR for private games
  }

  const winnerMMR = gameData?.players.find(
    (player) => player.id === winnerId,
  )?.mmr;
  const loserMMR = gameData?.players.find(
    (player) => player.id === loserId,
  )?.mmr;
  GameRoomsMap.delete(gameId);

  if (winnerMMR === undefined || loserMMR === undefined) {
    console.error("MMR calculation failed: Player MMR not found.");
    return;
  }

  // Simple MMR calculation logic
  const winnerGain = !draw
    ? calculateGain(winnerMMR, loserMMR)
    : calculateDraw(winnerMMR, loserMMR);
  const loserGain = !draw
    ? -calculateGain(loserMMR, winnerMMR)
    : calculateDraw(loserMMR, winnerMMR);

  const newWinnerMMR = Math.max(0, winnerMMR + winnerGain);
  const newLoserMMR = Math.max(0, loserMMR + loserGain);

  const res = await fetch(`${process.env.API_URL}/api/mmr/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameId: Number(gameId.slice(0, 1)),
      userId: winnerId,
      mmr: newWinnerMMR,
      mmr_SECRET: process.env.MMR_SECRET,
    }),
  });
  if (!res.ok) {
    console.error("Failed to update winner MMR:", await res.text());
    return;
  }

  const res2 = await fetch(`${process.env.API_URL}/api/mmr/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameId: Number(gameId.slice(0, 1)),
      userId: loserId,
      mmr: newLoserMMR,
      mmr_SECRET: process.env.MMR_SECRET,
    }),
  });
  if (!res2.ok) {
    console.error("Failed to update loser MMR:", await res2.text());
    return;
  }
}
