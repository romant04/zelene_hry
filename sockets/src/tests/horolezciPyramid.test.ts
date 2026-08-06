import {generatePyramid} from "../utils/horolezciLetterPyramid";
import {describe, expect, it} from "vitest";

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

describe("Generate pyramid", () => {
    const veta = "Pátrání po dokonalosti: Jestli hledáš muže, který je přitažlivý, vtipný, chytrý, sebevědomý, citlivý, sexy, něžný a romantický, jdi do kina.";
    const correctLetters = Array.from(new Set(veta.toLowerCase().replace(/[^a-záčďéěíňóřšťúůýž]/g, "")));
    const guessedLetters = new Set(['a', 'e', 'i', 'n', 'c', 'd']);

    it('Generated pyramid should follow set probabilities', () => {
        const TRIALS = 2000;
        const firstRow = [];
        const secondRow = [];
        const thirdRow = [];
        const fourthRow = [];
        for (let i = 0; i < TRIALS; i++) {
            const pyramid = generatePyramid(correctLetters, new Set());
            firstRow.push(pyramid[0]);
            secondRow.push(pyramid[1]);
            thirdRow.push(pyramid[2]);
            fourthRow.push(pyramid[3]);
        }

        const firstRowFlat = firstRow.flat();
        const secondRowFlat = secondRow.flat();
        const thirdRowFlat = thirdRow.flat();
        const fourthRowFlat = fourthRow.flat();

        const mostCommonLetters = Object.keys(letterLines).filter(letter => letterLines[letter] === 4);
        const commonLetters = Object.keys(letterLines).filter(letter => letterLines[letter] === 3);
        const lessCommonLetters = Object.keys(letterLines).filter(letter => letterLines[letter] === 2);
        const rareLetters = Object.keys(letterLines).filter(letter => letterLines[letter] === 1);

        const numberOfMostCommonLettersInFirstRow = firstRowFlat.filter(letter => mostCommonLetters.includes(letter)).length;
        const numberOfMostCommonLettersInSecondRow = secondRowFlat.filter(letter => mostCommonLetters.includes(letter)).length;
        const numberOfMostCommonLettersInThirdRow = thirdRowFlat.filter(letter => mostCommonLetters.includes(letter)).length;
        const numberOfMostCommonLettersInFourthRow = fourthRowFlat.filter(letter => mostCommonLetters.includes(letter)).length;

        const numberOfCommonLettersInFirstRow = firstRowFlat.filter(letter => commonLetters.includes(letter)).length;
        const numberOfCommonLettersInSecondRow = secondRowFlat.filter(letter => commonLetters.includes(letter)).length;
        const numberOfCommonLettersInThirdRow = thirdRowFlat.filter(letter => commonLetters.includes(letter)).length;
        const numberOfCommonLettersInFourthRow = fourthRowFlat.filter(letter => commonLetters.includes(letter)).length;

        const numberOfLessCommonLettersInFirstRow = firstRowFlat.filter(letter => lessCommonLetters.includes(letter)).length;
        const numberOfLessCommonLettersInSecondRow = secondRowFlat.filter(letter => lessCommonLetters.includes(letter)).length;
        const numberOfLessCommonLettersInThirdRow = thirdRowFlat.filter(letter => lessCommonLetters.includes(letter)).length;
        const numberOfLessCommonLettersInFourthRow = fourthRowFlat.filter(letter => lessCommonLetters.includes(letter)).length;

        const numberOfRareLettersInFirstRow = firstRowFlat.filter(letter => rareLetters.includes(letter)).length;
        const numberOfRareLettersInSecondRow = secondRowFlat.filter(letter => rareLetters.includes(letter)).length;
        const numberOfRareLettersInThirdRow = thirdRowFlat.filter(letter => rareLetters.includes(letter)).length;
        const numberOfRareLettersInFourthRow = fourthRowFlat.filter(letter => rareLetters.includes(letter)).length;

        // Log distributions of letters in each row
        console.log("Distribution of letters in each row:");
        console.log(`${numberOfMostCommonLettersInFirstRow} | ${numberOfCommonLettersInFirstRow} | ${numberOfLessCommonLettersInFirstRow} | ${numberOfRareLettersInFirstRow}`);
        console.log(`${numberOfMostCommonLettersInSecondRow} | ${numberOfCommonLettersInSecondRow} | ${numberOfLessCommonLettersInSecondRow} | ${numberOfRareLettersInSecondRow}`);
        console.log(`${numberOfMostCommonLettersInThirdRow} | ${numberOfCommonLettersInThirdRow} | ${numberOfLessCommonLettersInThirdRow} | ${numberOfRareLettersInThirdRow}`);
        console.log(`${numberOfMostCommonLettersInFourthRow} | ${numberOfCommonLettersInFourthRow} | ${numberOfLessCommonLettersInFourthRow} | ${numberOfRareLettersInFourthRow}`);

        expect(numberOfMostCommonLettersInFirstRow).toBeLessThanOrEqual(firstRowFlat.length * 0.05);
        expect(numberOfMostCommonLettersInSecondRow).toBeLessThanOrEqual(secondRowFlat.length * 0.1);
    });

    it('Should have all lines filled to maximum capacity', () => {
        const pyramid = generatePyramid(correctLetters, new Set());
        expect(pyramid[0].length).toBe(1);
        expect(pyramid[1].length).toBe(2);
        expect(pyramid[2].length).toBe(3);
        expect(pyramid[3].length).toBe(4);
    });

    it('Should not have duplicate letters in the pyramid', () => {
        const pyramid = generatePyramid(correctLetters, new Set());
        const allLetters = pyramid.flat();
        const uniqueLetters = new Set(allLetters);
        expect(uniqueLetters.size).toBe(allLetters.length);
    })

    it('Should include at least one correct letter if any remain unguessed', () => {
        const remainingCorrectLetters = correctLetters.filter(letter => !guessedLetters.has(letter));
        const pyramid = generatePyramid(correctLetters, guessedLetters);
        const pyramidLetters = pyramid.flat();
        const hasCorrectLetter = remainingCorrectLetters.some(letter => pyramidLetters.includes(letter));
        expect(hasCorrectLetter).toBe(true);
    })

    it('should rarely include already-guessed letters (~1-5% of all placed letters)', () => {
        // Representative mid-game state — a handful guessed, not most of the alphabet.
        // If guessedLetters covers most of the pool, tier-3 fallback kicks in and
        // this rate climbs on purpose (see note below) — don't test that case here.
        const correctLetters = ['s', 't', 'o', 'r', 'y'];
        const guessedSet = new Set(guessedLetters);

        const TRIALS = 2000; // enough samples (20,000 letters total) to smooth out noise
        let totalLetters = 0;
        let guessedCount = 0;

        for (let i = 0; i < TRIALS; i++) {
            const pyramid = generatePyramid(correctLetters, guessedLetters);
            const flat = pyramid.flat();
            totalLetters += flat.length;
            guessedCount += flat.filter(letter => guessedSet.has(letter)).length;
        }

        const guessedPercentage = (guessedCount / totalLetters) * 100;

        // GUESSED_LETTER_CHANCE is 3% by design. This isn't pinning the exact
        // value (that would make the test flaky) — it's catching the class of
        // regression we actually hit: guessed letters slipping back into the
        // normal, unsuppressed pool.
        expect(guessedPercentage).toBeGreaterThanOrEqual(1);
        expect(guessedPercentage).toBeLessThanOrEqual(5);
    });
})