import fs from "fs/promises";
import { GameLanguage } from "../types/language";

const wordsSets: Record<GameLanguage, Set<string>> = {
  cs: new Set<string>(),
  en: new Set<string>(),
};

export async function initWords() {
  const [csData, enData] = await Promise.all([
    fs.readFile("data/vocab.tsv", "utf-8"),
    fs.readFile("data/vocab_eng.txt", "utf-8"),
  ]);

  wordsSets.cs = new Set(
      csData
          .split(/\r?\n/)
          .map((line) => {
            const columns = line.split("\t");
            // Column index 1 is the word / lemma
            const word = columns[1];

            return word ? removeDiacritics(word.trim().toLowerCase()) : "";
          })
          .filter((w) => w.length >= 3) // Filter out short words or header rows
  );

  // English vocab has one word per line
  wordsSets.en = new Set(
      enData
          .split(/\r?\n/)
          .map((line) => line.trim().toLowerCase())
          .filter((w) => w.length >= 3 && /^[a-z]+$/.test(w))
  );

  console.log(`Loaded ${wordsSets.cs.size} czech and ${wordsSets.en.size} english words.`);
}

export function isValidWord(word: string, language: GameLanguage) {
  return wordsSets[language].has(word.toLowerCase());
}
function removeDiacritics(text: string): string {
  return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
}
