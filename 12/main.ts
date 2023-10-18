import { getUserInputInterval, render } from '../src/utils/render';
import { defaultInput } from './defaultInput';
import { defaultIntervalMS, newlineChars } from '../constants'
import './styles.css';

const testInput = 
`Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

// const input = testInput;
const input = defaultInput;
const mapRows = input.split(newlineChars);
const MAP_WIDTH = mapRows[0].length;
const MAP_HEIGHT = mapRows.length;

// 'E'.charCodeAt(0) === 69
// 'S'.charCodeAt(0) === 83
// 'a'.charCodeAt(0) === 97
// 'z'.charCodeAt(0) === 122

const toCoords = (idx: number) => [idx % MAP_WIDTH, Math.floor(idx / MAP_WIDTH)]; // [x, y]
const toBinaryIndex = (x: number, y: number) => y * MAP_WIDTH + x;
const MAP_VALUES_LENGTH = MAP_WIDTH * MAP_HEIGHT;
let startingCoords: [number, number] = [0, 0];

for (let i = 0; i < MAP_VALUES_LENGTH; i++) {
    const [x, y] = toCoords(i);
    if (mapRows[y][x] === 'S') {
        startingCoords = [x, y];
        break;
    }
}

const solve = (initCoords: [number, number], targetChar: string = 'E'): { value: number, targetCoords: [number, number] } => {
    let register: [number, number][] = [initCoords];
    let registerInd = 0;
    const mapValues: (number | undefined)[] = Array.from({ length: MAP_VALUES_LENGTH });
    const getNeighbors = (x: number, y: number) => {
        const neighbors: [number, number][] = [];
        if (x > 0) neighbors.push([x - 1, y]);
        if (x < MAP_WIDTH - 1) neighbors.push([x + 1, y]);
        if (y > 0) neighbors.push([x, y - 1]);
        if (y < MAP_HEIGHT - 1) neighbors.push([x, y + 1]);
        let currChar = mapRows[y][x]
        if (currChar === 'S') currChar = 'a';
        if (currChar === 'E') currChar = 'z';
        return neighbors
            .filter(([nx, ny]) => {
                const charToCheck = mapRows[ny][nx];
                if (targetChar === 'E') return (charToCheck.charCodeAt(0) <= currChar.charCodeAt(0) + 1 && charToCheck.charCodeAt(0) >= 97)
                    || (charToCheck === 'E' && (currChar === 'y' || currChar === 'z'));
                if (targetChar === 'a') return charToCheck.charCodeAt(0) >= currChar.charCodeAt(0)
                    || charToCheck.charCodeAt(0) === currChar.charCodeAt(0) - 1
                    || (charToCheck === 'S' && currChar === 'b');
            })
            .filter(([nx, ny]) => mapValues[toBinaryIndex(nx, ny)] === undefined);
    };
    mapValues[toBinaryIndex(...initCoords)] = 0;
    while(true) {
        // console.log('IND', registerInd);
        const [currX, currY] = register[registerInd++];
        const currPointVal = mapValues[toBinaryIndex(currX, currY)] as number;
        const neighbors = getNeighbors(currX, currY);
        for (let i = 0; i < neighbors.length; i++) {
            const [nx, ny] = neighbors[i];
            if (mapRows[ny][nx] === targetChar) return {
                value: currPointVal + 1,
                targetCoords: [nx, ny],
            };
            mapValues[toBinaryIndex(nx, ny)] = currPointVal + 1;
        }
        register.push(...neighbors);
    }
};

console.log(
    solve(
        solve(startingCoords).targetCoords,
        'a',
    ).value,
);
