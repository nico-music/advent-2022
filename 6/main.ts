import { defaultInput } from "./defaultInput";

const input = defaultInput;

const getUniqueIndexAt = (str: string, numUniqueChars: number) => {
    for (let right = numUniqueChars; right <= str.length; right++) {
        const substring = str.substring(right - numUniqueChars, right);
        if (new Set(substring).size === numUniqueChars) return right;
    }
};

const partOneMarkerCount = 4;
const partTwoMarkerCount = 14;
