const exampleInput = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`

const fs = require('fs');
const textData = fs.readFileSync('data.txt', 'utf8');

const caloriesPerElf = [];

const parseInput = () => {
    let currentElfIndex = 0;
    textData.split('\n').forEach(line => {
        if(line === '') {
            currentElfIndex++;
            return;
        }
        const calories = Number(line);
        if(caloriesPerElf[currentElfIndex]) {
            caloriesPerElf[currentElfIndex] += calories;
        } else {
            caloriesPerElf[currentElfIndex] = calories;
        }
    });
}

const firstPart = () => {
    return Math.max(...caloriesPerElf);
}

const secondPart = () => {
    caloriesPerElf.sort((a, b) => {
        if (a > b) return -1;
        return 1;
    });
    return caloriesPerElf[0] + caloriesPerElf[1] + caloriesPerElf[2];
}

parseInput();
console.log("First part", firstPart());
console.log("Second part", secondPart());
