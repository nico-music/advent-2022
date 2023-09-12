// TODO: add link to "this day in Advent of Code" prompt AKA link with href pointing at path
// TODO: add string input to allow visualization(s) from string input (if no input, then render default)
// TODO: add "reset to default" button if custom input is rendered
// TODO: add "get input for this puzzle" using api https://adventofcode.com/{year}/day/{dayNum}/input

export const render = (markup: string): void => {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = markup;
};
