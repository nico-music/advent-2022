import { defaultIntervalMS, newlineChars } from "../constants";
import { render } from "../src/utils/render";
import { defaultInput } from "./defaultInput";
import './styles.css';

const rucksacks = defaultInput.split(newlineChars);
const charCode_a = 'a'.charCodeAt(0);
const charCode_A = 'A'.charCodeAt(0);
const charCode_z = 'z'.charCodeAt(0);

const toPriorityScore = (charCode: number) => charCode >= charCode_a && charCode <= charCode_z ? charCode - charCode_a + 1 : charCode + 27 - charCode_A;
const getUniqueCharAcrossLists = (lists: string[]) => {
    const sets: Set<string>[] = [];
    const map = new Map<string, number>();
    for (const list of lists) {
        sets.push(new Set(list.split('')));
    }
    for (const set of sets) {
        for (const [value] of set.entries()) {
            if (!map.has(value)) {
                map.set(value, 1);
                continue;
            }
            map.set(value, map.get(value)! + 1);
            if (map.get(value) === lists.length) return value;
        }
    }
    return '';
};

const priorityScores = rucksacks.map((sack) => {
    const half = sack.length / 2;
    const left = sack.substring(0, half);
    const right = sack.substring(half);
    return toPriorityScore(getUniqueCharAcrossLists([left, right]).charCodeAt(0));
});

// console.log('SUM', priorityScores.reduce((prev, curr) => prev + curr, 0))

const groupsOfThree = Array.from({ length: rucksacks.length / 3 }, (_, i) => rucksacks.slice(i * 3, (i * 3) + 3));
const priorityScoresTwo = groupsOfThree.map((group) => toPriorityScore(getUniqueCharAcrossLists(group).charCodeAt(0)))

console.log('SUM', priorityScoresTwo.reduce((prev, curr) => prev + curr, 0));

const renderRucksacPartTwo = (rowDiv: HTMLDivElement, groupOfThree: string[]) => {
    // render 3 rows of tiles
    // animate to only unique chars
    // indicators on common char ("badge")
};

const renderRucksacPartOne = (rowDiv: HTMLDivElement, sack: string) => {
    const indicatorOne = document.createElement('span');
    const indicatorTwo = document.createElement('span');
    indicatorOne.classList.add('index-indicator', 'terminal');
    indicatorTwo.classList.add('index-indicator', 'terminal');
    rowDiv.append(indicatorOne, indicatorTwo);
    const half = sack.length / 2;
    const leftUniqueSet = new Set(sack.substring(0, half).split(''));
    const leftUnique = Array.from(leftUniqueSet);
    const right = sack.substring(half);
    const leftTiles = Array.from(leftUnique, (str) => {
        const div = document.createElement('div');
        div.innerHTML = str;
        return div;
    });
    const rightTiles = Array.from({ length: right.length }, () => document.createElement('div'));
    const compartmentOneDiv = document.createElement('div');
    const compartmentTwoDiv = document.createElement('div');
    compartmentOneDiv.classList.add('container');
    compartmentTwoDiv.classList.add('container');
    compartmentOneDiv.id = 'compartment-one';
    compartmentTwoDiv.id = 'compartment-two';
    leftTiles.forEach((tile) => {
        tile.classList.add('tile');
        compartmentOneDiv.append(tile);
    });
    rightTiles.forEach((tile, i) => {
        tile.classList.add('tile');
        tile.innerHTML = right.charAt(i);
        compartmentTwoDiv.append(tile);
    });
    rowDiv.append(compartmentOneDiv);
    rowDiv.append(compartmentTwoDiv);
    let index = 0;
    const indicators = rowDiv.querySelectorAll('.index-indicator')!;
    const increment = setInterval(() => {
        if (index === 0) {
            indicators.forEach((indicator) => {
                indicator.classList.remove('terminal');
                indicator.classList.add('active');
            });
        }
        const tiles = rowDiv.querySelectorAll('div#compartment-two>.tile');
        const focusTileRight = tiles[index];
        const { x: indRightX, width: indRightWidth } = focusTileRight.getBoundingClientRect();
        const transformRight = indRightX + (indRightWidth / 2) - 20;
        indicators[1].setAttribute('style', `transform: translateX(${transformRight}px)`);
        if (leftUniqueSet.has(right.charAt(index))) {
            const leftInd = leftUnique.indexOf(right.charAt(index));
            const leftTiles = rowDiv.querySelectorAll('div#compartment-one>.tile');
            const focusTileLeft = leftTiles[leftInd];
            const { x: indLeftX, width: indLeftWidth } = focusTileLeft.getBoundingClientRect();
            const transformLeft = indLeftX + (indLeftWidth / 2) - 20;
            indicators[0].setAttribute('style', `transform: translateX(${transformLeft}px)`);
            clearInterval(increment);
            indicators.forEach((indicator) => {
                indicator.classList.add('terminal');
                indicator.classList.remove('active');
            });
            return;
        }
        index++;
    }, defaultIntervalMS);
};

const rucksackRowDiv = document.createElement('div');
rucksackRowDiv.classList.add('container');
rucksackRowDiv.id = 'rucksack-row';

const markup = `
<div>
    F
    <div>
        <h2>Rucksacks</h2>
    </div>
    <div>
        <div>
            Method
        </div>
        <div>
            <ul>
                <li>Create sets of unique chars from each string</li>
                <li>Iterate through each set: add char to map & increment for each instance</li>
                <li>Break on char that has the same amount of instances as the amount of sets</li>
            <ul>
        </div>
    </div>
    <div>
        ${rucksackRowDiv.outerHTML}
    </div>
</div>
`;

render(markup);
renderRucksacPartOne(document.querySelector(`#${rucksackRowDiv.id}`)!, rucksacks[0]);
