
/**
 * 
 * 
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
 * 
 */

import { newlineChars } from "../constants";
import { render } from "../src/utils/render";
import { defaultInput } from "./defaultInput";

// move {amt} from {initLoc} to {termLoc}
// {loc}: [top..bottom]

// (amt, initLoc, termLoc) => termLoc.unshift( initLoc.splice(0, amt) )

const testInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;



const input = defaultInput;

const stackRows = input.split(newlineChars + newlineChars)[0].split(newlineChars);
const stacks: string[][] = Array.from({ length: Math.ceil(stackRows[0].length / 4) }, (_, i) => []);
stackRows.forEach((rowString) => {
    for (let i = 0; i < stacks.length; i++) {
        const slice = rowString.slice(i * 4, i * 4 + 4);
        if (slice.match(/([A-Z])/g)) {
            stacks[i].push(slice.replace(/(\[|\]|\s)/g, ''));
        }
    }
});

const instructions = input.split(newlineChars + newlineChars)[1].split(newlineChars);

const movePackages = (isPartOne = true) => {
    instructions.forEach((instructionStr) => {
        const [amt, initLoc, termLoc] = instructionStr.replace(/(move|from|to)/g, '').split(' ').filter((s) => s !== '').map((s) => parseInt(s));
        const removedPackages = stacks[initLoc - 1].splice(0, amt);
        if (isPartOne) removedPackages.reverse();
        stacks[termLoc - 1].unshift(...removedPackages);
    });

};

/**
 * IDEA
 * 
 * Show the CrateMover config
 * 
 * 
 * Initial render:
 * - Vert tiles (only render tile if char, otherwise empty space)
 * - Contained in grid w/ specific template rules set
 * - Each tile is a 'pkg'
 * - Controls to right box
 *   - toggle (v9000/v9001)
 *   - label: instruction text at index
 *   - label: current stackTopPkgString (aka stacks.map((s) => s[0]).join(''))
 * 
 * 
 * Each tick:
 * - tile(s) to move is highlighted and animated (on following ticks)
 *   - get target list coords using getBoundingClientRect()
 *   - isPartOne:
 *     - for each tile, per tick, offset per tile (aka each goes in sequence, starting after tick 1 of prev tile):
 *       - translateY to (height) of max(target list height, current list height)
 *       - translateX to (x + (width / 2)) of target list
 *       - translateY to (top + tileHeight) of target list top tile
 *   - !isPartOne:
 *     - all tiles translateY to same height
 *     - all tiles translateX to (x + (width / 2)) of target list rect
 *     - for each tile, per tick:
 *         - translateY to specified location in target list via style="grid-something: some-config"
 * - update
 * 
 */

const renderPackages = (pkgDiv: HTMLDivElement) => {
    // create tiles

    // append tiles to pkgDiv



};

const pkgDiv = document.createElement('div');
pkgDiv.id = 'pkg-container';

const markup = `
<div>
    ${pkgDiv.outerHTML}
</div>
`;

render(markup);
renderPackages(document.querySelector(`#${pkgDiv.id}`)!);
