// TODO: Limit to max 2 letters per set of letters, to avoid too many duplicates in the generated letters
export function generateLetters(count = 14) {
    const vowels = ["A", "E", "I", "O", "U"];
    const consonants = [
        "B", "C", "F", "G", "H", "J",
        "R", "Z", "Y"
    ]; // Y is chosen as a consonant here for lowering its frequency in the generated letters

    const frequentConsonants = ["N", "V", "S", "T", "R", "L", "D", "K", "P", "M"];

    const result = [];

    // Helper pro vývěr jednoho náhodného prvků z pole
    const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    // 2. Garantujeme minimální počet samohlásek (cca 5 z 14)
    const vowelCount = Math.floor(count * 0.38);
    for (let i = 0; i < vowelCount; i++) {
        const vowel = getRandom(vowels);
        result.push(vowel);

        if (result.filter(letter => letter === vowel).length >= 2) {
            // Pokud už máme 2 stejné samohlásky, odstraníme ji z možností pro další výběr
            vowels.splice(vowels.indexOf(vowel), 1);
        }
    }

    // 3. Doplníme časté souhlásky (cca 7 z 14)
    const frequentCount = Math.floor(count * 0.50);
    for (let i = 0; i < frequentCount; i++) {
        const consonant = getRandom(frequentConsonants);
        result.push(consonant);

        if (result.filter(letter => letter === consonant).length >= 2) {
            // Pokud už máme 2 stejné souhlásky, odstraníme ji z možností pro další výběr
            frequentConsonants.splice(frequentConsonants.indexOf(consonant), 1);
        }
    }

    // 4. Zbytek (2 z 14) doplníme z vzácnějších souhlásek
    const remainingCount = count - result.length;
    for (let i = 0; i < remainingCount; i++) {
        const consonant = getRandom(consonants);
        result.push(consonant);

        if (result.filter(letter => letter === consonant).length >= 2) {
            // Pokud už máme 2 stejné souhlásky, odstraníme ji z možností pro další výběr
            consonants.splice(consonants.indexOf(consonant), 1);
        }
    }

    // 5. Písmena zamícháme (Fisher-Yates shuffle), aby nebyla seřazená podle typů
    return result.sort(() => Math.random() - 0.5);
}