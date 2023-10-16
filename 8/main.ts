import { defaultInput } from './defaultInput';
import { newlineChars } from '../constants'
const testInput = 
`30373
25512
65332
33549
35390`;

// const input = testInput;
const input = defaultInput;

const rows: number[][] = input.split(newlineChars).map((row) => row.split('').map((char) => parseInt(char)));

let visibleTrees = rows.length * 2 + ((rows[0].length - 2) * 2);

// map each cell in 2D array to it scenic score
// scenic score: get direction scores [left, right, top, bottom]
// left: iterate treesToLeft
// if tree >= treeHeight, break on left score

let maxScenicScore = 0;
for (let rowInd = 1; rowInd < rows.length - 1; rowInd++) {
    const row = rows[rowInd];
    for (let colInd = 1; colInd < row.length - 1; colInd++) {
        const col = rows.map((tRow) => tRow[colInd]);
        const treeHeight = rows[rowInd][colInd];
        let [leftScore, rightScore, topScore, bottomScore] = [0, 0, 0, 0];
        const treesToLeft = row.slice(0, colInd).reverse();
        const treesToRight = row.slice(colInd + 1);
        const treesToTop = col.slice(0, rowInd).reverse();
        const treesToBottom = col.slice(rowInd + 1);
        while (leftScore < treesToLeft.length) {
            if (treesToLeft[leftScore++] >= treeHeight) break;
        }
        while (rightScore < treesToRight.length) {
            if (treesToRight[rightScore++] >= treeHeight) break;
        }
        while (topScore < treesToTop.length) {
            if (treesToTop[topScore++] >= treeHeight) break;
        }
        while (bottomScore < treesToBottom.length) {
            if (treesToBottom[bottomScore++] >= treeHeight) break;
        }
        maxScenicScore = Math.max(maxScenicScore, [leftScore, rightScore, topScore, bottomScore].reduce((prev, curr) => prev * curr, 1));
        if (treesToLeft.length > 0 && treeHeight > Math.max(...treesToLeft)) {
            visibleTrees++;
            continue;
        }
        if (treesToRight.length > 0 && treeHeight > Math.max(...treesToRight)) {
            visibleTrees++;
            continue;
        }
        if (treesToBottom.length > 0 && treeHeight > Math.max(...treesToBottom)) {
            visibleTrees++;
            continue;
        }
        if (treesToTop.length > 0 && treeHeight > Math.max(...treesToTop)) visibleTrees++;
    }
}

console.log('VISIBLE TREES: ' + visibleTrees.toString());
console.log('HIGHEST SCENIC SCORE: ' + maxScenicScore.toString());


// Grid to left
// render height of each tree
// for (0..9) each row is colored different green color based on height value

// reactivity for grid of trees:
// when rowInd increments: highlight cells in row: just add class name to the div for that row & remove all others
// when colInd increments: highlight that cell in the row
// when {dir}Score increments: highlight the cells from current cell +/- the {dir}Score within row/col


// Grid to right
// print maxScenicScore
// print isVisible{direction} w/ color coded
// print visibleTrees

