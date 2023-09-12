import { render } from '../src/utils/render';
import { defaultInput } from './defaultInput';
import { newlineChars } from '../constants'
import './styles.css';

// TODO: set default range to +/- n bars from solution - AKA put solution bar in middle, and N bars before & N bars after

const defaultBurgerMaxDepth = 30;
const defaultBarContainerAmt = 10;
const defaultAmtOfTopElves = 3;

const getBurgers = (value: number, maxAmt: number, maxBurgers: number): string => {
    const percentage = value / maxAmt;
    const length = Math.floor(percentage * maxBurgers);
    return Array.from({ length }, () => '🍔').join('');
};

const renderBars = (elvesCalories: number[]): string => {
    const max = Math.max(...elvesCalories);
    return elvesCalories.map((elfCalories) => `<span class="bar">${getBurgers(elfCalories, max, defaultBurgerMaxDepth)}&nbsp;&nbsp;${elfCalories}</span>`).join('');
};

const getElvesCaloriesFromInput = (input: string) => input.split(newlineChars + newlineChars).map((elfCaloriesString) => elfCaloriesString
    .split(newlineChars)
    .map((caloryAmtStr) => parseInt(caloryAmtStr))
    .reduce((prev, curr) => prev + curr, 0)
);


const getSortedElvesCalories = (elvesCalories: number[]) => elvesCalories
    .sort((a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
    })

const getElvesCaloriesFromRange = (input: string, startInd?: number, targetInd?: number) => {
    const elvesCalories = getElvesCaloriesFromInput(input);
    const [dStartInd, dTargetInd] = getDefaultBarRange(elvesCalories);
    const sInd = startInd ?? dStartInd;
    const tInd = targetInd ?? dTargetInd;
    return elvesCalories.slice(sInd, tInd);
};

const getDefaultBarRange = (elvesCalories: number[]) => {
    const max = Math.max(...elvesCalories);
    const maxInd = elvesCalories.indexOf(max);
    return [
        maxInd - Math.floor(defaultBarContainerAmt / 2),
        maxInd + Math.floor(defaultBarContainerAmt / 2),
    ];
};

// TODO: inputs for beginning/ending
// TODO: allow scrolling for massive ranges

const markup = `
<div>
    <div id="controls">
    </div>
    <div id="summary">
        <h2>Summary</h2>
        <h3>Prompt 1</h3>
        <p>
            Find the Elf carrying the most Calories. How many total Calories is that Elf carrying?
        </p>
        <p>
            The solution for my given input is ${Math.max(...getElvesCaloriesFromInput(defaultInput))}
        </p>
        <div class="bar-container">
            ${renderBars(getElvesCaloriesFromRange(defaultInput))}
        </div>
        <h3>Prompt 2</h3>
        <p>
            Find the top three Elves carrying the most Calories. How many Calories are those Elves carrying in total?
        </p>
        <p>
            The answer is ${getSortedElvesCalories(getElvesCaloriesFromInput(defaultInput)).slice(0, defaultAmtOfTopElves).reduce((prev, curr) => prev + curr, 0)}
        </p>
        <div class="bar-container">
            ${renderBars(getSortedElvesCalories(getElvesCaloriesFromInput(defaultInput)).slice(0, defaultBarContainerAmt))}
        </div>
    </div>
</div>
`;

render(markup);
