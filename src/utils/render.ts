// TODO: add link to "this day in Advent of Code" prompt AKA link with href pointing at path
// TODO: add string input to allow visualization(s) from string input (if no input, then render default)
// TODO: add "reset to default" button if custom input is rendered
// TODO: add "get input for this puzzle" using api https://adventofcode.com/{year}/day/{dayNum}/input
// TODO: add dark mode toggle

const updateTickMs = (e: MouseEvent) => {
    // console.log('E')
    window.location.href = '/';
};
const updateBtn = document.createElement('button');
updateBtn.onclick = updateTickMs;
updateBtn.id = 'back-btn';
updateBtn.innerHTML = 'Back'

const msInput = document.createElement('input');
export const msInputId = 'ms-input'
msInput.id = msInputId;
msInput.type = 'number';
msInput.placeholder = "300";
msInput.step = "25"
msInput.min = "25"
msInput.inputMode = 'numeric';

const injectedMarkup = `
<div>
    ${updateBtn.outerHTML}
</div>
<div>
    Tick value (ms): ${msInput.outerHTML}
</div>
`;

const setupChildViewElements = (btn: HTMLButtonElement, input: HTMLInputElement) => {
    btn.onclick = updateTickMs;
    input.value = "300";
}

export const getUserInputInterval = () => parseInt(document.querySelector<HTMLInputElement>(`#${msInputId}`)!.value);

export const render = (markup: string): void => {
    const appDiv = document.querySelector<HTMLDivElement>('#app')!;
    appDiv.innerHTML = markup;
    if (window.location.pathname !== '/') {
        appDiv.innerHTML = injectedMarkup + appDiv.innerHTML;
        const btn = document.querySelector<HTMLButtonElement>(`#${updateBtn.id}`)!;
        const input = document.querySelector<HTMLInputElement>(`#${msInput.id}`)!
        setupChildViewElements(btn, input);
    }
};
