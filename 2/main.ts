import { render } from '../src/utils/render';
import { defaultIntervalMS, newlineChars } from '../constants';
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
const targetOutcomeMap = {
    X: 'lose',
    Y: 'draw',
    Z: 'win',
};
const getTargetShape = (opponentShape: string, intendedOutcome: string) => {
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
// const getSum = (isPartTwo = false) => rows
//     .map((row) => {
//         const [opponentEncodedShape, selfEncodedShape] = row.split(' ')
//         const opponentShape = opponentShapeMap[opponentEncodedShape];
//         const selfShape = isPartTwo ? getTargetShape(opponentShape, selfEncodedShape) : selfShapeMap[selfEncodedShape] ;
//         return getScore(opponentShape, selfShape);
//     })
//     .reduce((prev, curr) => prev + curr, 0);

const shapeEmojiMap: Record<string, string> = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️',
};

const renderRowPartOne = (rowDivPartOne: HTMLDivElement, row: [string, string]): void => {
    const [oShapeStr, sShapeStr] = row;
    const [opponentShape, selfShape] = [opponentShapeMap[oShapeStr], selfShapeMap[sShapeStr]];
    let index = 0;
    const increment = setInterval(() => {
        const indicator = rowDivPartOne.querySelector('.index-indicator')!;
        const tiles = rowDivPartOne.querySelectorAll('.tile');
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

const rowDivPartOne = document.createElement('div');
const tilesPartOne = [
    document.createElement('div'), // opponentShape
    document.createElement('div'), // selfShape
    document.createElement('div'), // outcome
    document.createElement('div'), // score
];
tilesPartOne.forEach((tile, i) => {
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
    rowDivPartOne.append(tile);
});
const indicatorSpanPartOne = document.createElement('span');
indicatorSpanPartOne.classList.add('index-indicator', 'terminal');
rowDivPartOne.append(indicatorSpanPartOne);
rowDivPartOne.classList.add('container');
rowDivPartOne.id = 'row-part-one';

const renderRowPartTwo = (rowDivPartOne: HTMLDivElement, row: [string, string]): void => {
    const [oShapeStr, tOutcomeStr] = row;
    const [opponentShape, targetOutcome] = [opponentShapeMap[oShapeStr], targetOutcomeMap[tOutcomeStr]];
    let index = 0;
    const increment = setInterval(() => {
        const indicator = rowDivPartOne.querySelector('.index-indicator')!;
        const tiles = rowDivPartOne.querySelectorAll('.tile');
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
        const targetShape = getTargetShape(opponentShape, tOutcomeStr);
        if (index === 1) {
            indicator.classList.remove('terminal');
            indicator.classList.add('active');
            body.innerHTML = shapeEmojiMap[opponentShape];
        }
        if (index === 2) {
            body.innerHTML = targetOutcome;
        }
        if (index === 3) {
            body.innerHTML = shapeEmojiMap[targetShape];
        }
        if (index === 4) {
            body.innerHTML = getScore(opponentShape, targetShape).toString();
        }
        indicator.setAttribute('style', `transform: translateX(${transformLeft}px)`);
    }, defaultIntervalMS);
};

const rowDivPartTwo = document.createElement('div');
const tilesPartTwo = [
    document.createElement('div'), // opponentShape
    document.createElement('div'), // target outcome
    document.createElement('div'), // selfShape
    document.createElement('div'), // score
];
tilesPartTwo.forEach((tile, i) => {
    const label = document.createElement('div');
    const body = document.createElement('div');
    label.classList.add('label');
    body.classList.add('body');
    if (i === 0) {
        label.innerHTML = 'Opponent';
    }
    if (i === 1) {
        label.innerHTML = 'Target outcome';
    }
    if (i === 2) {
        label.innerHTML = 'Self shape';
    }
    if (i === 3) {
        label.innerHTML = 'Score'
    }
    tile.append(label);
    tile.append(body);
    tile.classList.add('tile');
    rowDivPartTwo.append(tile);
});
const indicatorSpanPartTwo = document.createElement('span');
indicatorSpanPartTwo.classList.add('index-indicator', 'terminal');
rowDivPartTwo.append(indicatorSpanPartTwo);
rowDivPartTwo.classList.add('container');
rowDivPartTwo.id = 'row-part-two';

const markup = `
<div>
    <h2>Rock Paper Scissors fun</h2>
    <div>
        <h3>Part one</h3>
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
            <p>
                Outcome scores
            </p>
            <ul>
                <li>Win: 6</li>
                <li>Draw: 3</li>
                <li>Lose: 0</li>
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
        ${rowDivPartOne.outerHTML}
    </div>
    <div>
        <h3>Part two</h3>
        <div>
            Strategy guide key
        </div>
        <div>
            <p>
                Opponent shapes remained the same for this puzzle, but the 'self' shapes were updated to
                become the target for each match.
            </p>
            <ul>
                <li>X: Lose</li>
                <li>Y: Draw</li>
                <li>Z: Win</li>
            </ul>
            <p>
                Given the opponent's shape and the target outcome, the 'self' shape is declared and then summed just like part one.
            </p>
        </div>
    </div>
    <div>
        ${rowDivPartTwo.outerHTML}
    </div>
</div>
`;

render(markup); 
renderRowPartOne(document.querySelector<HTMLDivElement>(`#${rowDivPartOne.id}`)!, ['A', 'Y']);
renderRowPartTwo(document.querySelector<HTMLDivElement>(`#${rowDivPartTwo.id}`)!, ['A', 'X']);
