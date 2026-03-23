import fs from "fs/promises";

let wordsSet = new Set<string>();

export async function initWords() {
  const data = await fs.readFile("data/vocab.txt", "utf-8");

  wordsSet = new Set(data.split("\n").map((w) => w.trim().toLowerCase()));
  console.log(`Loaded ${wordsSet.size} words into the set.`);
}

export function isValidWord(word: string) {
  return wordsSet.has(word.toLowerCase());
}
