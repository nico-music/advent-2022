import { defaultIntervalMS, newlineChars } from "../constants";
import { render } from "../src/utils/render";
import { defaultInput } from "./defaultInput";
import './styles.css';

const input = defaultInput;
const pairs = input.split(newlineChars);
const sectionAssignments = pairs.map((pair) => {
    const [one, two] = pair.split(',');
    const sectionsOne = one.split('-').map((char) => parseInt(char));
    const sectionsTwo = two.split('-').map((char) => parseInt(char));
    return [sectionsOne, sectionsTwo];
});
const sumOne = sectionAssignments.filter(([[initOne, termOne], [initTwo, termTwo]]) => {
    return ((initOne === initTwo) || (initOne <= initTwo && termOne >= termTwo) || (initTwo <= initOne && termTwo >= termOne));
}).length;
const sumTwo = sectionAssignments.filter(([[initOne, termOne], [initTwo, termTwo]]) => {
    return (
        (initOne <= initTwo && termOne >= initTwo)
        || (initTwo <= initOne && termTwo >= initOne)
    );
}).length;

const renderList = (gridDiv: HTMLDivElement) => {
    let index = 0, counter = 0;
    const renderPair = ([[initOne, termOne], [initTwo, termTwo]]: number[][]) => {
        const tiles = gridDiv.querySelectorAll('.tile');
        let innerIndex = 0;

        const displayThree = gridDiv.querySelector('.display>div:nth-child(3)')!
        if ((initOne <= initTwo && termOne >= initTwo) || (initTwo <= initOne && termTwo >= initOne)) setTimeout(() => {
            displayThree.innerHTML = `# overlapped: ${++counter}`;
        }, defaultIntervalMS * 2);

        const innerIncrement = setInterval(() => {
            const displayOne = gridDiv.querySelector('.display>div:nth-child(1)')!
            const displayTwo = gridDiv.querySelector('.display>div:nth-child(2)')!
            displayOne.innerHTML = `Assignment 1: ${initOne} - ${termOne}`;
            displayTwo.innerHTML = `Assignment 2: ${initTwo} - ${termTwo}`;
            if (innerIndex === 0) {
                // render one
                tiles.forEach((tile, i) => {
                    tile.classList.remove('active-one', 'active-two');
                    if (i >= initOne && i <= termOne) tile.classList.add('active-one');
                });
            }
            if (innerIndex === 1) {
                tiles.forEach((tile, i) => {
                    if (i >= initTwo && i <= termTwo) tile.classList.add('active-two');
                });
            }
            if (innerIndex === 2) {
                tiles.forEach((tile) => {
                    tile.classList.remove('active-one', 'active-two');
                });
                clearInterval(innerIncrement);
            }
            innerIndex++;
        }, defaultIntervalMS);
    };
    const increment = setInterval(() => {
        // if (index < 0) {
        //     clearInterval(increment);
        //     return;
        // }
        const pair = sectionAssignments[index];
        renderPair(pair);
        index++;
    }, defaultIntervalMS * 3);
};

const sectionTiles = Array.from({ length: 100 }, () => {
    const div = document.createElement('div');
    div.classList.add('tile');
    return div;
});
const displayDiv = document.createElement('div');
displayDiv.append(document.createElement('div'), document.createElement('div'), document.createElement('div'))
displayDiv.classList.add('display');
const sectionsGridDiv = document.createElement('div');
sectionsGridDiv.classList.add('sections-grid')
sectionsGridDiv.id = 'section-assignment-pairs-grid';
sectionsGridDiv.append(...sectionTiles, displayDiv);

const markup = `
<div>
    ${sectionsGridDiv.outerHTML}
</div>
`;

render(markup);
renderList(document.querySelector(`#${sectionsGridDiv.id}`)!);
