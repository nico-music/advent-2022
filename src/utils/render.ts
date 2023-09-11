export const render = (markup: string): void => {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = markup;
};
