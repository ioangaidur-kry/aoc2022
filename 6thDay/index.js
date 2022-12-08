const exampleInput = 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw';

const fs = require('fs');
const fileData = fs.readFileSync('data.txt', 'utf8');

const startOfPacketMarker = (data) => {
    for (let i = 0; i < data.length - 4; i++) {
        const toCheck = data.slice(i, i + 4).split('');

        const set = new Set(toCheck);
        if(set.size === 4) {
            return i + 4;
        }
    }
    return 0;
}

const startOfMessageMarker = (data) => {
    for (let i = 0; i < data.length - 14; i++) {
        const toCheck = data.slice(i, i + 14).split('');

        const set = new Set(toCheck);
        if(set.size === 14) {
            return i + 14;
        }
    }
    return 0;
}

console.log("First part", startOfPacketMarker(fileData));
console.log("Second part", startOfMessageMarker(fileData));
