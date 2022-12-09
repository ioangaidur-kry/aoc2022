const exampleInput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const fs = require('fs');
const textData = fs.readFileSync('data.txt', 'utf8');

const inputLines = textData.split('\n');

const elfPairs = [];

const parseInput = () => {
    inputLines
        .filter(line => line !== '')
        .forEach(line => {
            const [firstElfString, secondElfString] = line.split(',');
            const [firstElfStart, firstElfEnd] = firstElfString.split('-').map(Number);
            const [secondElfStart, secondElfEnd] = secondElfString.split('-').map(Number);
            const elfPair = [
                {start: firstElfStart, end: firstElfEnd},
                {start: secondElfStart, end: secondElfEnd}
            ];
            elfPairs.push(elfPair);
        });
}

const firstPart = () => {
    let result = 0;
    elfPairs.forEach(elfPair => {
        const [firstElf, secondElf] = elfPair;
        const {start: firstElfStart, end: firstElfEnd} = firstElf;
        const {start: secondElfStart, end: secondElfEnd} = secondElf;
        if (firstElfStart <= secondElfStart && firstElfEnd >= secondElfEnd) {
            result++;
        } else if (secondElfStart <= firstElfStart && secondElfEnd >= firstElfEnd) {
            result++;
        }
    });
    return result;
}

const secondPart = () => {
    let result = 0;
    elfPairs.forEach(elfPair => {
        const [firstElf, secondElf] = elfPair;
        const {start: firstElfStart, end: firstElfEnd} = firstElf;
        const {start: secondElfStart, end: secondElfEnd} = secondElf;
        if (firstElfStart <= secondElfEnd && firstElfEnd >= secondElfStart) {
            result++;
        }
    });
    return result;
}

parseInput();
console.log("First part", firstPart());
console.log("Second part", secondPart());
