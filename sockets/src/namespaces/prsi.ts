import { Server, Socket } from "socket.io";
import { Card, GameData, PrsiGameState } from "../types/game";
import { GameRoomsMap } from "../socket";
import { calculateAndUpdateMMR } from "../utils/calculateAndUpdateMMR";

const CARDS = [
  "c_sedma",
  "c_osma",
  "c_devitka",
  "c_desitka",
  "c_eso",
  "c_kral",
  "c_spodek",
  "c_svrsek",
  "e_sedma",
  "e_osma",
  "e_devitka",
  "e_desitka",
  "e_eso",
  "e_kral",
  "e_spodek",
  "e_svrsek",
  "z_sedma",
  "z_osma",
  "z_devitka",
  "z_desitka",
  "z_eso",
  "z_kral",
  "z_spodek",
  "z_svrsek",
  "k_sedma",
  "k_osma",
  "k_devitka",
  "k_desitka",
  "k_eso",
  "k_kral",
  "k_spodek",
  "k_svrsek",
];

function shuffle(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function prepareCardDeck() {
  const deck: Card[] = shuffle(
    [...CARDS].map((card) => {
      const suit = card.charAt(0);
      const rank = card.slice(2);
      return { suit, rank };
    }),
  );

  return deck;
}

const NAMESPACE = "/prsi";
const PrsiGameData = new Map<string, PrsiGameState>();
export function setupPrsiNamespace(io: Server) {
  const prsiNamespace = io.of(NAMESPACE);

  prsiNamespace.on("connection", (socket: Socket) => {
    const gameId = socket.handshake.auth?.gameId;
    const token = socket.handshake.auth?.token;

    if (!gameId || !token) {
      console.log("Missing userId or gameId, disconnecting...");
      socket.disconnect();
      return;
    }

    socket.join(gameId);

    const generalGameData = GameRoomsMap.get(gameId) as GameData;
    const id = generalGameData?.players.find(
      (player) => player.token === token,
    )!.id;

    socket.data.userId = id;

    if (!PrsiGameData.has(gameId) || !PrsiGameData.get(gameId)?.players) {
      const initialDeck = prepareCardDeck();
      const centerCard = initialDeck.pop()!;

      const players = generalGameData?.players.map((player) => {
        const cards = initialDeck.splice(0, 5);
        return {
          id: player.id,
          name: player.name,
          token: player.token,
          cards,
          isConnected: true, // Mark the player as connected
        };
      });

      PrsiGameData.set(gameId, {
        players,
        currentPlayerId: id,
        deck: initialDeck,
        centerCards: [centerCard],
        svrsek: null,
      });
    }

    const gameState = PrsiGameData.get(gameId)!;
    if (!gameState.players) {
      socket.emit("end");
      console.log(`No players found in game ${gameId}. Disconnecting...`);
      socket.disconnect();
      return;
    }

    const player = gameState.players?.find((player) => player.id === id);
    const enemy = gameState.players?.find((player) => player.id !== id);
    if (gameState.players) {
      const wasDisconnected = player?.isConnected === false;
      player!.isConnected = true;

      if (wasDisconnected) {
        console.log(`Player ${id} reconnected to game ${gameId}.`);
        socket.to(gameId).emit("playerReconnected");
      }
    }

    prsiNamespace.to(socket.id).emit("gameState", gameState);

    socket.on("getGameState", () => {
      console.log("getting this game state: " + gameState.players);
      prsiNamespace.to(socket.id).emit("gameState", gameState);
    });

    socket.on("cardPlayed", (card: Card) => {
      player!.cards = player!.cards.filter(
        (c) => !(c.suit === card.suit && c.rank === card.rank),
      );
      gameState.centerCards?.push(card);
      gameState.currentPlayerId = enemy!.id; // Switch to the next player

      socket.to(gameId).emit("cardPlayed", card);
      if (player!.cards.length === 0) {
        // Player has no cards left, they win the game
        const winnerName = player!.name;
        prsiNamespace.to(gameId).emit("gameOver", winnerName);

        void calculateAndUpdateMMR(gameId, id, enemy!.id);

        PrsiGameData.delete(gameId);
        return;
      }
    });

    socket.on("drawCard", (card: Card) => {
      player!.cards.push(card);
      gameState.deck = gameState.deck.filter(
        (c) => !(c.suit === card.suit && c.rank === card.rank),
      );
      gameState.currentPlayerId = enemy!.id; // Switch to the next player

      socket.to(gameId).emit("drawCard");

      if (gameState.deck.length === 0) {
        // If the deck is empty, reshuffle the center cards into the deck
        gameState.deck = gameState.centerCards!.slice(0, -1); // Exclude the last card (top card)
        gameState.centerCards = [
          gameState.centerCards![gameState.centerCards!.length - 1],
        ];
        gameState.deck = shuffle(gameState.deck); // Shuffle the deck
        prsiNamespace.to(gameId).emit("deckReshuffled", gameState.deck);
      }
    });

    socket.on("turnSkipped", () => {
      gameState.currentPlayerId = enemy!.id; // Switch to the next player
      socket.to(gameId).emit("turnSkipped");
    });

    socket.on("changeSuit", (data: { suit: string; old: string }) => {
      gameState.svrsek = data.suit;
      gameState.centerCards?.push({
        suit: data.old as "c" | "e" | "z" | "k",
        rank: "svrsek",
      });
      player!.cards = player!.cards.filter(
        (c) => !(c.suit === data.old && c.rank === "svrsek"),
      );
      gameState.currentPlayerId = enemy!.id;

      socket.to(gameId).emit("svrsek", data);
      prsiNamespace.to(socket.id).emit("suitChange", data.suit);

      if (player!.cards.length === 0) {
        // Player has no cards left, they win the game
        const winnerName = player!.name;
        prsiNamespace.to(gameId).emit("gameOver", winnerName);

        void calculateAndUpdateMMR(gameId, id, enemy!.id);

        PrsiGameData.delete(gameId);
        return;
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${id} disconnected from Prší namespace.`);
      // Optionally, you can handle cleanup or notify other players
      const gameData = PrsiGameData.get(gameId);
      if (gameData) {
        if (player) {
          player.isConnected = false; // Mark the player as disconnected
        }
        prsiNamespace.to(gameId).emit("playerDisconnected", { id });

        if (
          gameData.players?.filter((player) => player.isConnected).length === 0
        ) {
          // If all players are disconnected, remove the game data
          PrsiGameData.delete(gameId);
          GameRoomsMap.delete(gameId);
          console.log(
            `All players disconnected, removing game data for gameId: ${gameId}`,
          );
        }
      }
    });
  });

  console.log("Prší namespace initialized.");
}
