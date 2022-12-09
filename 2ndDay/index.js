const exampleInput = `A Y
B X
C Z`;

const fs = require('fs');
const textData = fs.readFileSync('data.txt', 'utf8');

const linesInput = textData.split('\n').filter(line => line !== '');

const getScoreForChoice = (choice) => {
    switch (choice) {
        case 'X':
        case 'A':
            return 1;
        case 'Y':
        case 'B':
            return 2;
        default:
            return 3;
    }
}

const firstPart = () => {
    let score = 0;
    linesInput.forEach(line => {
        const [elf, me] = line.split(' ');
        if ((elf === 'A' && me === 'X') ||
            (elf === 'B' && me === 'Y') ||
            (elf === 'C' && me === 'Z')) {
            score += getScoreForChoice(me) + 3;
        } else if ((elf === 'A' && me === 'Y') ||
            (elf === 'B' & me === 'Z') ||
            (elf === 'C' && me === 'X')) {
            score += getScoreForChoice(me) + 6;
        } else {
            score += getScoreForChoice(me);
        }
    })
    return score;
}

const secondPart = () => {
    let score = 0;
    linesInput.forEach(line => {
        const [elf, outcome] = line.split(' ');
        switch (outcome) {
            case 'X':
                score += (getScoreForChoice(elf) - 1) % 3 || 3;
                break;
            case 'Y':
                score += getScoreForChoice(elf) + 3;
                break;
            default:
                score += (getScoreForChoice(elf) % 3) + 1 + 6;
        }
    });
    return score;
}

console.log("First part", firstPart());
console.log("Second part", secondPart());
