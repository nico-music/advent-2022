import { newlineChars } from '../constants';
import { defaultInput } from "./defaultInput";

type dirEntry<T> = Record<string, T>
interface directory extends dirEntry<directory|number> {}
type compareFn = (num: number) => boolean;

const input = defaultInput;
const instructions = input.split(newlineChars);
const cmdPrefix = '$ ';
const changeDirStr = 'cd ';
const changeDirToParentStr = '..';
const lsStr = 'ls';
const dirStr = 'dir ';
const maxSizeForDeletion = 100000;
const maxMemory = 70000000;
const minFreeMemoryRequired = 30000000;
const topLevelDir: directory = {
    '/': {
        
    },
};
let currDir = topLevelDir;
let parentDir = {} as directory;
let rowIndex = 0;

const changeDir = (dirName: string) => {
    if (dirName === changeDirToParentStr) {
        currDir = currDir.parent as directory ?? topLevelDir;
        return;
    }
    parentDir = currDir;
    currDir = currDir[dirName] as directory;
    currDir.parent = parentDir;
};
const addItemsToCurrDir = () => {
    const rowStr = instructions[rowIndex];
    // assume `{dirStr}{dirName}` or `{fileSize} {fileName}`
    if (rowStr.indexOf(dirStr) > -1) {
        // add directory
        const [, dirName] = rowStr.split(dirStr);
        console.log('ADD DIR ' + dirName);
        currDir[dirName] = {} as directory;
        return;
    }
    // add file
    const [fileSizeStr, fileName] = rowStr.split(' ');
    console.log('ADD FILE ' + fileName + ' : ' + fileSizeStr);
    currDir[fileName] = parseInt(fileSizeStr);
    return;
};
const checkMaxSizeForDeletion: compareFn = (num) => num <= maxSizeForDeletion;

// core loop
const processLine = () => {
    const rowStr = instructions[rowIndex];
    if (rowStr.indexOf(cmdPrefix) > -1 && rowStr.indexOf(changeDirStr) > -1) {
        const [, dirName] = rowStr.split(changeDirStr); // ['$ cd ', dirName]
        changeDir(dirName);
        ++rowIndex;
        return;
    }
    if (rowStr.indexOf(cmdPrefix) > -1 && rowStr.indexOf(lsStr) > -1) {
        while (rowIndex < instructions.length && instructions[++rowIndex] && instructions[rowIndex].indexOf(cmdPrefix) === -1) {
            addItemsToCurrDir();
        }
        return;
    }
};

while (rowIndex < instructions.length) {
    processLine();
}

const getAllDirSizesByCompare = (dir: directory, compare?: compareFn): number[] => {
    const targetList: number[] = [];
    const getAllNestedDirSizes = (childDir: directory): number => {
        return Object
            .keys(childDir)
            .map((dirKey) => {
                if (dirKey === 'parent') return 0;
                if (typeof childDir[dirKey] === 'object') {
                    const dirSize = getAllNestedDirSizes(childDir[dirKey] as directory);
                    if (compare) targetList.push(dirSize);
                    return dirSize;
                }
                return childDir[dirKey] as number;
            })
            .reduce((prev, curr) => prev + curr, 0);
    };
    const totalSize = getAllNestedDirSizes(dir);
    if (compare) return targetList.filter(compare);
    return [totalSize];
};
const memoryMinToDelete = minFreeMemoryRequired - (maxMemory - getAllDirSizesByCompare(topLevelDir)[0]);
const checkMinSizeForDeletion: compareFn = (num) => num >= memoryMinToDelete;

// Part 1
console.log(
    getAllDirSizesByCompare(topLevelDir, checkMaxSizeForDeletion).reduce((prev, curr) => prev + curr, 0),
);

// Part 2
console.log(
    getAllDirSizesByCompare(topLevelDir, checkMinSizeForDeletion).sort((a, b) => {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    })[0],
);

/**
 * 
 * IDEA - PART 1


UZE OBZERVABLEZ

<terminal device>

instructions (only show trailing n lines in frame)

- each tick:
    - render instruction text to frame

- slice instructions by (current)

- on ls:
    - is command? break
    - is not command? highlight row

</terminal>


<display>

- each tick:


- when item is added to dir:
    - update JSON ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

</display>


 */


