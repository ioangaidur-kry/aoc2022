const exampleInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const largeExampleInput = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`;

const fs = require('fs');
const textData = fs.readFileSync('data.txt', 'utf8');

const splitInput = largeExampleInput.split('\n');

let headPosition = [0, 0];
let tailsPosition = [];
const tailsHistory = [];
for (let i = 0; i < 9; i++) {
    tailsPosition.push([0, 0]);
    tailsHistory.push([[0, 0]]);
}
const headHistory = [headPosition];

const moveHeadUp = () => {
    headPosition = [headPosition[0] - 1, headPosition[1]];
    headHistory.push(headPosition);
}

const moveHeadRight = () => {
    headPosition = [headPosition[0], headPosition[1] + 1];
    headHistory.push(headPosition);
}

const moveHeadDown = () => {
    headPosition = [headPosition[0] + 1, headPosition[1]];
    headHistory.push(headPosition);
}

const moveHeadLeft = () => {
    headPosition = [headPosition[0], headPosition[1] - 1];
    headHistory.push(headPosition);
}

const moveTailToHead = (tail, head) => {
    const xDelta = head[0] - tail[0];
    const yDelta = head[1] - tail[1];
    if (xDelta >= -1 && xDelta <= 1 && yDelta >= -1 && yDelta <= 1)
        return tail;
    return [tail[0] + (xDelta === 0 ? 0 : xDelta / Math.abs(xDelta)),
        tail[1] + (yDelta === 0 ? 0 : yDelta / Math.abs(yDelta))
    ];
}

const fancyPrintBoard = (board) => {
    let toPrint = '';
    board.forEach(line => {
        toPrint = toPrint + '\n' + line.reduce((acc, val) => acc + val.toString());
    })
    console.log(toPrint);
}

const printMoves = () => {
    let xSize = 1;
    let ySize = 1;
    let xOffset = 0;
    let yOffset = 0;
    const board = [[]]
    headHistory.forEach(head => {
        let xPos = head[0] + xOffset;
        let yPos = head[1] + yOffset;
        if (xPos < 0) {
            xOffset++;
            xPos++;
            xSize++;
        }
        if (yPos < 0) {
            yOffset++;
            yPos++;
            ySize++;
        }
        if (xPos === xSize) {
            xSize = xPos + 1;
        }
        if (yPos === ySize) {
            ySize = yPos + 1;
        }
    });
    for (let i = 0; i < xSize; i++) {
        for (let j = 0; j < ySize; j++) {
            if (!board[i]) {
                board[i] = [];
            }
            board[i][j] = '.';
        }
    }
    board[headHistory[0][0] + xOffset][headHistory[0][1] + yOffset] = 's';
    let currentIndex = 0;
    splitInput.forEach(line => {
        if (line === '') return;
        console.log(`\n== ${line} ==\n`)
        const amount = Number(line.split(' ')[1]);
        currentIndex = currentIndex + amount;
        const head = headHistory[currentIndex];
        const oldValsForTail = [];
        for (let i = 0; i < 9; i++) {
            const xTail = tailsHistory[i][currentIndex][0] + xOffset;
            const yTail = tailsHistory[i][currentIndex][1] + yOffset;
            oldValsForTail.push(board[xTail][yTail]);
            if (board[xTail][yTail] === '.' || board[xTail][yTail] === 's') {
                board[xTail][yTail] = i + 1;
            }
        }

        const xHead = head[0] + xOffset;
        const yHead = head[1] + yOffset;
        const oldValHead = board[xHead][yHead];
        board[xHead][yHead] = 'H';
        fancyPrintBoard(board);
        board[xHead][yHead] = oldValHead;
        for (let i = 8; i >= 0; i--) {
            const xTail = tailsHistory[i][currentIndex][0] + xOffset;
            const yTail = tailsHistory[i][currentIndex][1] + yOffset;
            board[xTail][yTail] = oldValsForTail.pop();
        }
    })
}

const parseInput = () => {
    splitInput.forEach(line => {
        const lineSplit = line.split(' ');
        const direction = lineSplit[0];
        const amount = Number(lineSplit[1]);
        for (let i = 0; i < amount; i++) {
            if (direction === 'U') {
                moveHeadUp();
            } else if (direction === 'R') {
                moveHeadRight();
            } else if (direction === 'D') {
                moveHeadDown();
            } else {
                moveHeadLeft();
            }
            tailsPosition[0] = moveTailToHead(tailsPosition[0], headPosition);
            tailsHistory[0].push(tailsPosition[0]);
            for (let i = 1; i < 9; i++) {
                tailsPosition[i] = moveTailToHead(tailsPosition[i], tailsPosition[i - 1]);
                tailsHistory[i].push(tailsPosition[i]);
            }
        }
    })
}

const firstPart = () => {
    const stringHistory = tailsHistory[0].map(tail => tail.toString());
    const tailSet = new Set(stringHistory);
    return tailSet.size;
}

const secondPart = () => {
    const stringHistory = tailsHistory[8].map(tail => tail.toString());
    const tailSet = new Set(stringHistory);
    return tailSet.size;
}

parseInput();
printMoves();
console.log("First part", firstPart());
console.log("Second part", secondPart());
