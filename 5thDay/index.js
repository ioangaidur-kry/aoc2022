const exampleInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const fs = require('fs');
const textData = fs.readFileSync('data.txt', 'utf8');

const splitInput = exampleInput.split('\n');
let initialStacks;
const instructions = [];

const parseInput = () => {
    let currentLineIndex = 0;
    const reversedStacks = [];
    while (!splitInput[currentLineIndex].includes('1')) {
        let currentIndex = 0;
        while (currentIndex <= splitInput[currentLineIndex].length) {
            const stack = splitInput[currentLineIndex].slice(currentIndex, currentIndex + 4);
            const stackIndex = currentIndex / 4;
            if (stack.includes('[')) {
                if (reversedStacks[stackIndex]) {
                    reversedStacks[stackIndex].push(stack[1]);
                } else {
                    reversedStacks[stackIndex] = [stack[1]];
                }
            }
            currentIndex += 4;
        }
        currentLineIndex++;
    }

    initialStacks = reversedStacks.map(stack => stack.reverse());
    currentLineIndex += 2;
    while (currentLineIndex < splitInput.length) {
        instructions.push(splitInput[currentLineIndex]);
        currentLineIndex++;
    }
}

const moveActionSingle = (stacks, amount, from, to) => {
    for (let i = 0; i < amount; i++) {
        const value = stacks[from].pop();
        stacks[to].push(value);
    }
}

const moveActionMultiple = (stacks, amount, from, to) => {
    const values = []
    for (let i = 0; i < amount; i++) {
        const value = stacks[from].pop();
        values.push(value);
    }
    stacks[to].push(...values.reverse());
}

const prettyPrintStacks = (stacks) => {
    const biggestStack = stacks.reduce((acc, cur) => {
        return acc.length > cur.length ? acc : cur;
    });
    let toPrint = '';
    for (let pos = biggestStack.length; pos >= 0; pos--) {
        for (let i = 0; i < stacks.length; i++) {
            if (stacks[i][pos]) {
                toPrint += `[${stacks[i][pos]}] `;
            } else {
                toPrint += `    `;
            }
        }
        toPrint += '\n';
    }
    for (let i = 0; i < stacks.length; i++) {
        toPrint += ` ${i + 1}  `;
    }
    console.log(toPrint);
}

const solve = (single, debugPrint) => {
    const copyStacks = JSON.parse(JSON.stringify(initialStacks));
    if (debugPrint) {
        prettyPrintStacks(copyStacks);
    }
    instructions.forEach(instruction => {
        if(instruction === '')
            return;
        if (debugPrint) {
            console.log(`\n== ${instruction} ==\n`)
        }
        const splitLine = instruction.split(' ');
        const amount = Number(splitLine[1]);
        const from = Number(splitLine[3]) - 1;
        const to = Number(splitLine[5]) - 1;
        if (single) {
            moveActionSingle(copyStacks, amount, from, to);
        } else {
            moveActionMultiple(copyStacks, amount, from, to);
        }
        if (debugPrint) {
            prettyPrintStacks(copyStacks);
        }

    })
    let topStacks = '';
    copyStacks.forEach(stack => {
        topStacks += stack[stack.length - 1];
    })
    return topStacks;
}

parseInput();
console.log("First part", solve(true));
console.log("Second part", solve(false, true));



