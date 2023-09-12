import { render } from '../src/utils/render';
import { newlineChars } from '../constants';
import { defaultInput } from './defaultInput';
import './styles.css';

const opponentShapeMap = {
    A: 'rock',
    B: 'paper',
    C: 'scissors',
};
const selfShapeMap = {
    X: 'rock',
    Y: 'paper',
    Z: 'scissors',
};
const rows = defaultInput.split(newlineChars);
const shapeSolutionMap = {
    rock: 'paper',
    paper: 'scissors',
    scissors: 'rock',
};
const shapeInverseSolutionMap = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
};
const shapeSolutionKeys = Object.keys(shapeSolutionMap);
const getTargetShape = (opponentShape: string, intendedOutcome: string) => {
    // (rock, X) => scissors
    if (intendedOutcome === 'X') {
        // lose
        return shapeInverseSolutionMap[opponentShape];
    }
    if (intendedOutcome === 'Y') {
        // draw
        return opponentShape;
    }
    return shapeSolutionMap[opponentShape];
};
const getOutcome = (opponentShape: string, selfShape: string) => {
    if (opponentShape === selfShape) return 'draw';
    if (opponentShape === shapeSolutionMap[selfShape]) return 'lose';
    return 'win';
};
const getScore = (opponentShape: string, selfShape: string) => {
    const shapeScore = shapeSolutionKeys.indexOf(selfShape) + 1;
    if (opponentShape === selfShape) {
        // draw
        return shapeScore + 3;
    }
    if (shapeSolutionMap[opponentShape] === selfShape) {
        // win
        return shapeScore + 6;
    }
    return shapeScore;
};
const getSum = (isPartTwo = false) => rows
    .map((row) => {
        const [opponentEncodedShape, selfEncodedShape] = row.split(' ')
        const opponentShape = opponentShapeMap[opponentEncodedShape];
        const selfShape = isPartTwo ? getTargetShape(opponentShape, selfEncodedShape) : selfShapeMap[selfEncodedShape] ;
        return getScore(opponentShape, selfShape);
    })
    .reduce((prev, curr) => prev + curr, 0);

console.log('One', getSum());
console.log('Two', getSum(true));


/**
 * Idea: show a single version of the entire sequence
 * An "indicator" moves over the tile that's currently in sequence
 * 
 * Part 1
 *
 * Show a single row being calculated
 * - All tiles appear (no anim) horizontally
 * 
 * Group of 3 tiles:
 * - Tile 1: Opponent shape
 * - Tile 2: Self shape
 * - Tile 3: outcome
 * 
 * Separate tile:
 * - Tile 4: score
 *  
 * For each tick:
 * Reveal next tile in order:
 * - Opponent shape
 * - Self shape
 * - Score
 *   - On update this tile, update the total score tile
 * 
 * 
 * 
 * 
 */

const shapeEmojiMap: Record<string, string> = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️',
};

const defaultIntervalMS = 1000;

const renderRow = (rowDiv: HTMLDivElement, row: [string, string]): void => {
    const [opponentShape, selfShape] = row;
    let index = 0;
    const increment = setInterval(() => {
        const indicator = rowDiv.querySelector('.index-indicator')!;
        const tiles = rowDiv.querySelectorAll('.tile');
        const focusTile = tiles[index++];
        if (!focusTile) {
            indicator.classList.remove('active');
            indicator.classList.add('terminal');
            clearInterval(increment);
            return;
        }
        const body = focusTile.querySelector('.body')!;
        const { x, width } = focusTile.getBoundingClientRect();
        const transformLeft = x + (width / 2) - 20;
        if (index === 1) {
            indicator.classList.remove('terminal');
            indicator.classList.add('active');
            body.innerHTML = shapeEmojiMap[opponentShape];
        }
        if (index === 2) {
            body.innerHTML = shapeEmojiMap[selfShape];
        }
        if (index === 3) {
            // outcome
            body.innerHTML = getOutcome(opponentShape, selfShape);
        }
        if (index === 4) {
            body.innerHTML = getScore(opponentShape, selfShape).toString();
        }

        indicator.setAttribute('style', `transform: translateX(${transformLeft}px)`);

    }, defaultIntervalMS);
};

const rowDiv = document.createElement('div');
const tiles = [
    document.createElement('div'), // opponentShape
    document.createElement('div'), // selfShape
    document.createElement('div'), // outcome
    document.createElement('div'), // score
];
tiles.forEach((tile, i) => {
    const label = document.createElement('div');
    const body = document.createElement('div');
    label.classList.add('label');
    body.classList.add('body');
    if (i === 0) {
        label.innerHTML = 'Opponent';
    }
    if (i === 1) {
        label.innerHTML = 'Self';
    }
    if (i === 2) {
        label.innerHTML = 'Outcome';
    }
    if (i === 3) {
        label.innerHTML = 'Score'
    }
    tile.append(label);
    tile.append(body);
    tile.classList.add('tile');
    rowDiv.append(tile);
});
const indicatorSpan = document.createElement('span');
indicatorSpan.classList.add('index-indicator', 'terminal');
rowDiv.append(indicatorSpan);
rowDiv.classList.add('container');
rowDiv.id = 'Foo';

const markup = `
<div>
    <h2>Rock Paper Scissors fun</h2>
    <div>
        <div>
            Strategy guide key
        </div>
        <div>
            <p>
                Opponent shapes
            </p>
            <ul>
                <li>A: Rock</li>
                <li>B: Paper</li>
                <li>C: Scissors</li>
            </ul>
            <p>
                Self shapes
            </p>
            <ul>
                <li>X: Rock (score: 1)</li>
                <li>Y: Paper (score: 2)</li>
                <li>Z: Scissors (score: 3)</li>
            </ul>
        </div>
        <div>
            <div>
                Scoring
            </div>
            <div>
                outcome score + shape score = total
            </div>
        </div>
    </div>
    <div>
        ${rowDiv.outerHTML}
    </div>
</div>
`;

render(markup); 
renderRow(document.querySelector<HTMLDivElement>(`#${rowDiv.id}`)!, ['rock', 'paper']);
