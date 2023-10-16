import { defaultIntervalMS, newlineChars } from '../constants';
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
const consoleContainer = document.createElement('div');
consoleContainer.id = 'console-container';
const markup = `
<div class="container">
    ${processLinesContainer.outerHTML}
    ${consoleContainer.outerHTML}
</div>
`;

render(markup);
const getUserInputInterval = () => 25 // parseInt(document.querySelector<HTMLInputElement>(`#${msInputId}`)!.value);

// reactivity
// store: [obj -> objProxy -> set method] -> set obj val: (update val in store) -> callback: (node -> updatedProps -> mutatedNode)

// idea: use generator function* to instantiate & use stateful values in object

const waitFor = async (val: number) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(val);
        }, val);
    })
};

async function* incrementalIndexGenerator () {
    let index = 0;
    while (true) {
        await waitFor(defaultIntervalMS);
        console.log('INDEX', index);
        yield index++;
    }

}
const createPreNode = (val?: string | number) => {
    const preElement = document.createElement('pre') as HTMLElement;
    preElement.innerHTML = String(val) ?? `///////////////
DONE PROCESSING
///////////////`;
    return preElement;
};

const updateConsoleNode = (val?: string | number) => {
    const divElement = document.createElement('div');
    divElement.innerHTML = String(val);
    return divElement;
}
const statefulTimeoutIndex = incrementalIndexGenerator();

const updatePreNodes = (node: HTMLElement, value: number) => {
    node.innerHTML = createPreNode(instructions[value]).outerHTML + node.innerHTML;
}

// node is container
// pass instructions on updating that container, given val(s)
const mutateDOMNodeWithObservableValue = (node: HTMLElement, callback: (value?: number | string) => HTMLElement) => async (value: number | string) => {
    const defaultTimeout = getUserInputInterval();
    await statefulTimeoutIndex.next();
    // setTimeout(() => {
        // instructions for given node
        node.innerHTML = callback(value).innerHTML;
        // node.innerHTML = createPreNode(instructions[value]).outerHTML + node.innerHTML; // update
    // }, statefulTimeoutIndex.next().value as number * defaultTimeout);
};
interface IObservableNumOrStringVal {
    value: number | string;
}
const createProxyObjFromValue = (initValue: number | string, callback: (val: number | string) => void): [IObservableNumOrStringVal, (val: number | string) => number | string] => {
    const initVal: IObservableNumOrStringVal = {
        value: initValue,
    };
    const objProx = new Proxy(initVal, {
        set: (target, key: string, value: number | string) => {
            target[key] = value;
            callback(value);
            return true;
        }
    });
    // console.log('PROXXXXXXXXXYYYYY', objProx, objProx.value)
    const setRowIndex = (num: number | string) => {
        // console.log('SET ROW INDEX', num);

        // TODO: install setTimeout here
        objProx.value = num;
        return num;
    };
    return [objProx, setRowIndex];
};

// implementation

const nodeCallback = mutateDOMNodeWithObservableValue(
    document.querySelector(`#${processLinesContainer.id}`)!,
    (val?: string | number) => createPreNode(instructions[val as number]),
);
const [observableRowIndex, setObservableRowIndex] = createProxyObjFromValue(rowIndex, nodeCallback) as [{ value: number }, (val: number) => number];

const consoleNodeCallback = mutateDOMNodeWithObservableValue(
    document.querySelector(`#${consoleContainer.id}`)!,
    updateConsoleNode,
);
const [observableDirJSON, setObservableDirJSON] = createProxyObjFromValue('', consoleNodeCallback);



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

// function* stateful

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


const toNonCyclicDir = (dir: directory) => {
    const safeDirKeys: [string, directory | number][] = Object
        .keys(dir)
        .filter((k) => k !== 'parent')
        .map((k) => {
            if (typeof dir[k] === 'number') return [k, dir[k]];
            return [k, toNonCyclicDir(dir[k] as directory)];
        });
    return Object.fromEntries(safeDirKeys);
};

    // setObservableDirJSON(JSON.stringify(topLevelDir));
    // setObservableDirJSON(JSON.stringify(toNonCyclicDir(topLevelDir)[0]));

    console.log(topLevelDir)
    console.log(toNonCyclicDir(topLevelDir['/'] as directory))
    console.log(
        JSON.stringify(toNonCyclicDir(topLevelDir['/'] as directory)),
    );



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
