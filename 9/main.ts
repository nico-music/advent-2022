import { defaultInput } from './defaultInput';
import { newlineChars } from '../constants'
// const testInput = 
// `R 5
// U 8
// L 8
// D 3
// R 17
// D 10
// L 25
// U 20`;
// const input = testInput;
const input = defaultInput;
const headInstructions = input.split(newlineChars); // [dir, amt][]
interface ICoord {
    x: number;
    y: number;
}
const setCoords: Set<string> = new Set();
type direction = 'L' | 'R' | 'U' | 'D';
const deltaMap: Record<direction, ICoord> = {
    U: {
        x: 0,
        y: -1,
    },
    D: {
        x: 0,
        y: 1,
    },
    L: {
        x: -1,
        y: 0,
    },
    R: {
        x: 1,
        y: 0,
    },
};
let headCoords: ICoord = {
    x: 0,
    y: 0,
}, tailCoords: ICoord = {
    x: 0,
    y: 0,
};
setCoords.add(`${tailCoords.x} ${tailCoords.y}`);

const ROPE_LENGTH = 10;

const simRope: ICoord[] = Array.from({ length: ROPE_LENGTH }, () => ({ x: 0, y: 0}));
for (const instruction of headInstructions) {
    const [dir, amtStr] = instruction.split(' ') as [direction, string];
    let amt = parseInt(amtStr, 10);
    for (const { x: dX, y: dY } of Array.from({ length: amt }, () => deltaMap[dir])) {
        headCoords = {
            x: headCoords.x + dX,
            y: headCoords.y + dY,
        };
        simRope[0] = headCoords;
        for (let i = 1; i < simRope.length; i++) {
            const [currNode, prevNode] = [simRope[i], simRope[i - 1]];
            const [diffX, diffY] = [prevNode.x - currNode.x, prevNode.y - currNode.y];
            if (Math.abs(diffX) > 1 || Math.abs(diffY) > 1) {
                simRope[i].x += Math.sign(diffX);
                simRope[i].y += Math.sign(diffY);
                if (i === simRope.length - 1)setCoords.add(`${simRope[i].x} ${simRope[i].y}`);
            }
        }
    }
}

console.log(setCoords.size)
