import { getUserInputInterval, render } from '../src/utils/render';
import { defaultInput } from './defaultInput';
import { defaultIntervalMS, newlineChars } from '../constants'
import './styles.css';

const testInput = 
`Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

// const input = testInput;
const input = defaultInput;
type TPartnerMonkeys = [number, number]; // true, false
interface IMonkey {
    items: number[];
    partnerMonkeys: TPartnerMonkeys;
    divisor: number;
    operate: (itm: number) => number;
    inspectionTotal: number;
}
const toMonkey = (str: string): IMonkey => {
    const [_,
        startItemsStr,
        operationStr,
        testStr,
        testTrueStr,
        testFalseStr,
    ] = str.split(newlineChars);
    const [operatorStr, numStr] = operationStr.split('Operation: new = old ')[1].split(' ');
    const coefficient = parseInt(numStr, 10);

    return {
        items: startItemsStr.split('Starting items: ')[1].split(', ').map((ch) => parseInt(ch, 10)),
        operate: (operatorStr === '+') ?
            (itm: number) => itm + (numStr === 'old' ? itm : coefficient)
            : (itm: number) => itm * (numStr === 'old' ? itm : coefficient), // toOperationCallback(operationStr),
        // test: toTestCallback(testStr),
        divisor: parseInt(testStr.split('Test: divisible by ')[1], 10),
        partnerMonkeys: [
            parseInt(testTrueStr.split('throw to monkey ')[1], 10),
            parseInt(testFalseStr.split('throw to monkey ')[1], 10),
        ],
        inspectionTotal: 0,
    };
};

const monkeys: IMonkey[] = input.split(newlineChars + newlineChars).map(toMonkey);
const MAX_ACTIVE_MONKEYS = 2;

// prevent memory overflow
const divisorsProductUpperLimit = monkeys.reduce((prev, { divisor }) => prev * divisor, 1);

const solve = (isPartTwo?: boolean) => {
    const ROUNDS_AMT = isPartTwo ? 10000 : 20;
    for (let i = 0; i < ROUNDS_AMT; i++) {
        for (let j = 0; j < monkeys.length; j++) {
            const currMonkey = monkeys[j];
            currMonkey.inspectionTotal += currMonkey.items.length;
            while (currMonkey.items.length > 0) {
                const itm = currMonkey.operate(currMonkey.items.shift()!) % divisorsProductUpperLimit;
                const currItem = isPartTwo ? itm : Math.floor(itm/3);
                monkeys[currMonkey.partnerMonkeys[Math.sign(currItem % currMonkey.divisor)]].items.push(currItem);
            }
        }
    }
    console.log(
        monkeys
            .map(({ inspectionTotal }) => inspectionTotal)
            .sort((a, b) => {
                if (a < b) return 1;
                if (a > b) return -1;
                return 0;
            })
            .slice(0, MAX_ACTIVE_MONKEYS)
            .reduce((prev, curr) => prev * curr, 1)
    );
}

solve();
// solve(true);
