import fs from "fs/promises";

let wordsSet = new Set<string>();

export async function initWords() {
  const data = await fs.readFile("data/vocab.tsv", "utf-8");

  wordsSet = new Set(
      data
          .split(/\r?\n/)
          .map((line) => {
            const columns = line.split("\t");
            // Column index 1 is the word / lemma
            const word = columns[1];

            return word ? removeDiacritics(word.trim().toLowerCase()) : "";
          })
          .filter((w) => w.length >= 3) // Filter out short words or header rows
  );
  console.log(`Loaded ${wordsSet.size} words into the set.`);
}

export function isValidWord(word: string) {
  return wordsSet.has(word.toLowerCase());
}
function removeDiacritics(text: string): string {
  return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
}