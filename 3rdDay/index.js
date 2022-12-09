const exampleInput = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

const fs = require('fs');
const textData = fs.readFileSync('data.txt', 'utf8');

const rucksacks = [];

const parseInput = () => {
    exampleInput.split('\n').filter(line => line !== '').forEach(rucksack => {
        const half = Math.ceil(rucksack.length / 2);
        const firstCompartment = rucksack.slice(0, half);
        const secondCompartment = rucksack.slice(half);
        rucksacks.push({firstCompartment, secondCompartment});
    })
}

const getPriority = (item) => {
    if (item >= 'a' && item <= 'z') {
        return item.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    } else {
        return item.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
    }
}

const firstPart = () => {
    const duplicates = [];
    rucksacks.forEach(rucksack => {
        const {firstCompartment, secondCompartment} = rucksack;
        const firstCompartmentSet = new Set(firstCompartment);
        const secondCompartmentSet = new Set(secondCompartment);
        const commonItems = new Set([...firstCompartmentSet].filter(item => secondCompartmentSet.has(item)));
        commonItems.forEach(item => {
            duplicates.push(item);
        })
    });
    return duplicates.reduce((acc, cur) => {
        return acc + getPriority(cur);
    }, 0);
}

const secondPart = () => {
    const badges = [];
    let currentGroupCommonItems;
    rucksacks.forEach((rucksack, index) => {
        const rucksackSet = new Set([...rucksack.firstCompartment, ...rucksack.secondCompartment]);
       if(index % 3 === 2) {
           currentGroupCommonItems = new Set([...currentGroupCommonItems].filter(item => rucksackSet.has(item)));
           if(currentGroupCommonItems.size === 1) {
               badges.push([...currentGroupCommonItems][0]);
           } else {
               console.error("MORE THAN ONE COMMON ITEM?");
           }
       } else if (index % 3 === 0) {
           currentGroupCommonItems = rucksackSet;
       } else {
           currentGroupCommonItems = new Set([...currentGroupCommonItems].filter(item => rucksackSet.has(item)));
       }
    });
    return badges.reduce((acc, cur) => {
        return acc + getPriority(cur);
    }, 0);
}

parseInput();

console.log("First part", firstPart());
console.log("Second part", secondPart());
