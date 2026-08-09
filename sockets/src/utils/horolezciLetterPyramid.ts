const letterLines: Record<string, number> = { // 4 - most common, 3 - common, 2 - less common, 1 - rare
    "a": 4,
    "e": 4,
    "i": 4,
    "n": 4,
    "o": 4,
    "r": 4,
    "s": 4,
    "t": 4,
    "v": 4,

    "c": 3,
    "d": 3,
    "h": 3,
    "j": 3,
    "k": 3,
    "l": 3,
    "m": 3,
    "p": 3,
    "u": 3,
    "y": 3,
    "z": 3,

    "á": 2,
    "b": 2,
    "č": 2,
    "é": 2,
    "ě": 2,
    "í": 2,
    "ř": 2,
    "š": 2,
    "ú": 2,
    "ý": 2,
    "ž": 2,

    "ď": 1,
    "f": 1,
    "g": 1,
    "ň": 1,
    "ó": 1,
    "q": 1,
    "ť": 1,
    "ů": 1,
    "w": 1,
    "x": 1
};
function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Letters from each line can appear in any line of the pyramid, but the highest chance for them is to appear in their specific line.

const ROW_CAPACITY: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4 };

// Precompute rank -> letters
const ranksToLetters: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [] };
for (const [letter, rank] of Object.entries(letterLines)) {
    ranksToLetters[rank].push(letter);
}

const ROW_RANK_WEIGHTS: Record<number, Record<number, number>> = {
    1: { 1: 0.70, 2: 0.20, 3: 0.09, 4: 0.01 },
    2: { 2: 0.70, 1: 0.16, 3: 0.12, 4: 0.02 },
    3: { 3: 0.70, 2: 0.16, 4: 0.12, 1: 0.02 },
    4: { 4: 0.70, 3: 0.16, 2: 0.09, 1: 0.05 },
};
/** Decides which rank of letter should fill a slot in the given row. */
function pickRankForRow(row: number): number {
    const weights = ROW_RANK_WEIGHTS[row];
    const roll = Math.random();
    let cumulative = 0;
    for (const rank of [1, 2, 3, 4]) {
        cumulative += weights[rank] ?? 0;
        if (roll < cumulative) return rank;
    }
    return 4; // floating-point safety net
}

const GUESSED_LETTER_CHANCE = 0.03;
/** Picks an unused letter of the given rank, falling back to nearby ranks if exhausted. */
function pickLetterOfRank(rank: number, used: Set<string>, guessedSet: Set<string>): string | null {
    const tryRanks = [rank, ...[1, 2, 3, 4].filter(r => r !== rank)];

    // Small chance: deliberately allow an already-guessed letter through.
    if (Math.random() < GUESSED_LETTER_CHANCE) {
        for (const r of tryRanks) {
            const pool = ranksToLetters[r].filter(l => guessedSet.has(l) && !used.has(l));
            if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
        }
        // no guessed letters available for this roll — fall through below
    }

    // Normal case: prefer letters that haven't been guessed yet.
    for (const r of tryRanks) {
        const pool = ranksToLetters[r].filter(l => !guessedSet.has(l) && !used.has(l));
        if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    }

    // Absolute fallback: if every unguessed letter of every rank is already
    // used in this pyramid, allow a guessed letter rather than returning null.
    for (const r of tryRanks) {
        const pool = ranksToLetters[r].filter(l => !used.has(l));
        if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    }

    return null;
}

export function generatePyramid(correctLetters: string[], guessedLetters: Set<string>): string[][] {
    const pyramid: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [] };
    const used = new Set<string>();

    // Fill all 10 slots purely through the normal weighted process — no special-casing.
    for (let row = 1; row <= 4; row++) {
        while (pyramid[row].length < ROW_CAPACITY[row]) {
            const letter = pickLetterOfRank(pickRankForRow(row), used, guessedLetters);
            if (!letter) break;
            pyramid[row].push(letter);
            used.add(letter);
        }
    }

    // Guarantee: only intervene if no remaining correct letter made it in naturally.
    const remainingLetters = correctLetters.filter(l => !guessedLetters.has(l.toLowerCase()));
    const alreadyIncluded = remainingLetters.some(l => used.has(l.toLowerCase()));

    if (!alreadyIncluded && remainingLetters.length > 0) {
        const correctLetter = remainingLetters[Math.floor(Math.random() * remainingLetters.length)].toLowerCase();

        // Pick a slot to overwrite, uniformly among all 10 positions —
        // this naturally weights by row capacity (row4 has 4x row1's odds).
        const allSlots: number[] = [];
        for (let row = 1; row <= 4; row++) {
            for (let i = 0; i < pyramid[row].length; i++) allSlots.push(row);
        }
        const targetRow = allSlots[Math.floor(Math.random() * allSlots.length)];
        const targetIndex = Math.floor(Math.random() * pyramid[targetRow].length);

        used.delete(pyramid[targetRow][targetIndex]);
        pyramid[targetRow][targetIndex] = correctLetter;
        used.add(correctLetter);
    }

    return [pyramid[1], pyramid[2], pyramid[3], pyramid[4]];
}