import { getUserInputInterval, render } from '../src/utils/render';
import { defaultInput } from './defaultInput';
import { defaultIntervalMS, newlineChars } from '../constants'
import './styles.css';

const testInput = 
`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;
// const input = testInput;
const input = defaultInput;

let register = 1;
const rows = input.split(newlineChars);
const BASE_CYCLE_INDEX = 20;
const CYCLE_INDEX_COEFFICIENT = 40;

const processLinesContainer = document.createElement('div');
const cycleCounterContainerDiv = document.createElement('div');
const resultsContainerDiv = document.createElement('div');
const registerContainerDiv = document.createElement('div');

const canvas = document.createElement('canvas');

processLinesContainer.id = 'process-lines-container';
cycleCounterContainerDiv.id = 'cycle-counter-container';
resultsContainerDiv.id = 'results-container';
registerContainerDiv.id = 'register-container';

const markup = `
<canvas width="1360px" height="272px">
</canvas>
<div class="container">
    ${cycleCounterContainerDiv.outerHTML}
    ${processLinesContainer.outerHTML}
</div>
`;

render(markup)

const waitFor = async (timeoutMs = defaultIntervalMS): Promise<number> => {
    return new Promise((res) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            res(timeoutId);
        }, timeoutMs);
    });
};

// function* indexGenerator() {
//     let index = 0;
//     while (true) {
//         yield ++index;
//     }
// }
// const indexGen = indexGenerator();


// DOM manip

// strip from [0..239]
// x -> n % 40
// y -> Math.floor(n / 40)

const CRT_PIXEL_DIMENSION = 32;
const CRT_PIXEL_WIDTH = 40;
const CRT_PIXEL_HEIGHT = 6;

const initCRTGrid = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < CRT_PIXEL_HEIGHT; i++) {
        for (let j = 0; j < CRT_PIXEL_WIDTH; j++) {
            ctx.strokeRect(
                j * CRT_PIXEL_DIMENSION + CRT_PIXEL_DIMENSION,
                i * CRT_PIXEL_DIMENSION + CRT_PIXEL_DIMENSION,
                CRT_PIXEL_DIMENSION,
                CRT_PIXEL_DIMENSION,
            );
        }
    }
};

const updateCycleCounter = (content: string) => {
    document.querySelector(`#${cycleCounterContainerDiv.id}`)!.innerHTML = content;
};

const appendToConsole = (content: string) => {
    const pre = document.createElement('pre');
    pre.innerText = content;
    document.querySelector(`#${processLinesContainer.id}`)!.insertBefore(pre, document.querySelectorAll(`#${processLinesContainer.id} > *`)![0]);
};

const drawToCRT = (currCycleIndex: number, currRegister: number, ctx: CanvasRenderingContext2D) => {
    const isSpriteVisible = currCycleIndex % CRT_PIXEL_WIDTH >= (currRegister - 1) && currCycleIndex % CRT_PIXEL_WIDTH <= (currRegister + 1);
    if (isSpriteVisible) {
        ctx.fillRect(
            (currCycleIndex % CRT_PIXEL_WIDTH) * CRT_PIXEL_DIMENSION + CRT_PIXEL_DIMENSION,
            Math.floor(currCycleIndex / CRT_PIXEL_WIDTH) * CRT_PIXEL_DIMENSION + CRT_PIXEL_DIMENSION,
            CRT_PIXEL_DIMENSION,
            CRT_PIXEL_DIMENSION,
        );
        return;
    }
};

// TODO: remove implicit / global dependency, and use callbacks as props instead & invoke each during loop
function* cyclesGenerator() {
    const results: number[] = [];
    let cyclesIndex = 0;
    const ctx = document.querySelector('canvas')!.getContext('2d')!;
    initCRTGrid(ctx);
    try {
        while (true) {
            drawToCRT(cyclesIndex, register, ctx);
            if (++cyclesIndex === (results.length * CYCLE_INDEX_COEFFICIENT) + BASE_CYCLE_INDEX) results.push(cyclesIndex * register);
            // updateCycleCounter(cyclesIndex.toString());
            yield;
        }
    } finally {
        yield results;
    }
}

const cycleGen = cyclesGenerator();

for (let i = 0; i < rows.length; i++) {
    appendToConsole(rows[i]);
    const [instruction, amtStr] = rows[i].split(' ') as [string, string | undefined];
    let cyclesAmt = instruction === 'noop' ? 1 : 2;
    while (cyclesAmt-- > 0) {
        cycleGen.next();
        await waitFor(getUserInputInterval());
    }
    register += amtStr ? parseInt(amtStr) : 0;
}

// part 1
console.log(
    'OK DERE GUY',
    (cycleGen.return().value as number[]).reduce((prev, curr) => prev + curr, 0),
);

// reactivity for DOM elements:
// when results array adds item: update <div> innerHTML
// when register updates: update <div> innerHTML


/**
 IDEAS:

 - cycles increment each tick
 - when cycleGen.next() invokes, add a new setTimeout with value dependent on (current index * defaultMs)

 */
