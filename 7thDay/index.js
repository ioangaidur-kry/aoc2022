const exampleInput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

const fs = require('fs');
const data = fs.readFileSync('testData.txt', 'utf8');
const splitInput = data.split('\n');

const fileSystem = {type: 'folder', size: 0};

const lessThan100k = [];

const getFolder = (breadCrumbs) => {
    if (breadCrumbs.length === 1) {
        return fileSystem;
    }
    let currentFile = fileSystem;
    for (let i = 1; i < breadCrumbs.length; i++) {
        currentFile = currentFile[breadCrumbs[i]];
    }
    return currentFile;
}

const parseInput = () => {
    const breadCrumbs = [];
    let currentFolder = fileSystem;
    splitInput.forEach(line => {
        if (line.startsWith('$ cd ..')) {
            // if we go up a folder this means we are done with it so we can add the size of it to the parent
            if (currentFolder.size < 100000) {
                lessThan100k.push([...breadCrumbs]);
            }
            const oldFolder = breadCrumbs.pop();
            currentFolder = getFolder(breadCrumbs);
            currentFolder.size += currentFolder[oldFolder].size;
        } else if (line.startsWith('$ cd')) {
            const folderName = line.split('$ cd ')[1];
            breadCrumbs.push(folderName);
            if (folderName === '/') {
                currentFolder = fileSystem;
            } else {
                currentFolder = currentFolder[folderName];
            }
        } else if (line.startsWith('$ ls')) {
            // ignore this line
        } else {
            if (line.startsWith('dir')) {
                // create folder
                const folderName = line.split('dir ')[1];
                currentFolder[folderName] = {type: 'folder', size: 0};
            } else {
                // create file with size
                const splitLine = line.split(' ');
                const size = Number(splitLine[0]);
                const name = splitLine[1];
                currentFolder[name] = {size, type: 'file'};
                currentFolder.size += size;
            }
        }
    });
    while (breadCrumbs.length > 1) {
        if (currentFolder.size < 100000) {
            lessThan100k.push([...breadCrumbs]);
        }
        const oldFolder = breadCrumbs.pop();
        currentFolder = getFolder(breadCrumbs);
        currentFolder.size += currentFolder[oldFolder].size;
    }
}

const firstPart = () => {
    let sum = 0;
    lessThan100k.forEach(crumb => {
        const folder = getFolder(crumb);
        sum += folder.size;
    })

    return sum;
}

parseInput();

const totalDiskSize = 70000000;
const currentFreeSpace = totalDiskSize - fileSystem.size;
const spaceNeeded = 30000000;

const recursiveCheck = (currentFolder) => {
    let currentSmallestSize = -1;
    if(currentFreeSpace + currentFolder.size >= spaceNeeded) {
        currentSmallestSize = currentFolder.size;
    }
    const keys = Object.keys(currentFolder).filter((key) => !(key === 'size' || key === 'type' || currentFolder[key].type === 'file'));
    keys.forEach(key => {
        const smallestFromInsideFolder = recursiveCheck(currentFolder[key]);

        if(smallestFromInsideFolder !== -1 && currentSmallestSize > smallestFromInsideFolder) {
            currentSmallestSize = smallestFromInsideFolder;
        }
    });
    return currentSmallestSize;
}

console.log("First part", firstPart());
console.log("Second part", recursiveCheck(fileSystem));


