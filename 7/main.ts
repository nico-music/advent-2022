import { newlineChars } from '../constants';
import { defaultInput } from "./defaultInput";
import { msInputId, render } from '../src/utils/render';
import './styles.css';

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
const rowIndex = 0;

// setup DOM

const processLinesContainer = document.createElement('div');
processLinesContainer.id = 'process-lines-container';
const markup = `
<div class="container">
    ${processLinesContainer.outerHTML}
</div>
`;

render(markup);
const getUserInputInterval = () => parseInt(document.querySelector<HTMLInputElement>(`#${msInputId}`)!.value);

// reactivity

function* incrementalIndexGenerator () {
    let index = 0;
    while (true) yield index++;
}
const createPreNode = (val?: string) => {
    const preElement = document.createElement('pre');
    preElement.innerHTML = val ?? `///////////////
DONE PROCESSING
///////////////`;
    return preElement;
};
const statefulTimeoutIndex = incrementalIndexGenerator();
const mutateDOMNodeWithObservableValue = (node: HTMLElement) => (value: number) => {
    const defaultTimeout = getUserInputInterval();
    setTimeout(() => {
        node.innerHTML = createPreNode(instructions[value]).outerHTML + node.innerHTML; // update
    }, statefulTimeoutIndex.next().value as number * defaultTimeout);
};
interface IObservableNumVal {
    value: number;
}
const createProxyObjFromValue = (initValue: number, callback: (val: number) => void): [IObservableNumVal, (val: number) => number] => {
    const initVal: IObservableNumVal = {
        value: initValue,
    };
    const objProx = new Proxy(initVal, {
        set: (target, key: string, value: number) => {
            target[key] = value;
            callback(value);
            return true;
        }
    });
    // console.log('PROXXXXXXXXXYYYYY', objProx, objProx.value)
    const setRowIndex = (num: number) => {
        // console.log('SET ROW INDEX', num);
        objProx.value = num;
        return num;
    };
    return [objProx, setRowIndex];
};

// implementation

const nodeCallback = mutateDOMNodeWithObservableValue(document.querySelector(`#${processLinesContainer.id}`)!);
const [observableRowIndex, setObservableRowIndex] = createProxyObjFromValue(rowIndex, nodeCallback);

// solution logic

// TODO: callback to highlight row of this directory in DOM in panel to right
const changeDir = (dirName: string) => {
    if (dirName === changeDirToParentStr) {
        currDir = currDir.parent as directory ?? topLevelDir;
        return;
    }
    parentDir = currDir;
    currDir = currDir[dirName] as directory;
    currDir.parent = parentDir;
};

// TODO: callback to add item at correct tab index and height in panel to right
const addItemsToCurrDir = () => {
    const rowStr = instructions[observableRowIndex.value];
    if (rowStr.indexOf(dirStr) > -1) {
        const [, dirName] = rowStr.split(dirStr);
        currDir[dirName] = {} as directory;
        return;
    }
    const [fileSizeStr, fileName] = rowStr.split(' ');
    currDir[fileName] = parseInt(fileSizeStr);
    return;
};
const checkMaxSizeForDeletion: compareFn = (num) => num <= maxSizeForDeletion;
const processLine = () => {
    const rowStr = instructions[observableRowIndex.value];
    if (rowStr.indexOf(cmdPrefix) > -1 && rowStr.indexOf(changeDirStr) > -1) {
        const [, dirName] = rowStr.split(changeDirStr); // ['$ cd ', dirName]
        changeDir(dirName);
        setObservableRowIndex(observableRowIndex.value + 1);
        return;
    }
    if (rowStr.indexOf(cmdPrefix) > -1 && rowStr.indexOf(lsStr) > -1) {
        while (setObservableRowIndex(observableRowIndex.value + 1) < instructions.length && instructions[observableRowIndex.value].indexOf(cmdPrefix) === -1) {
            addItemsToCurrDir();
        }
        return;
    }
};

while (observableRowIndex.value < instructions.length) {
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
