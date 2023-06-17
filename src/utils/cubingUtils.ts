import { getRand } from './genericUtils';

// Enums
export enum SolveStatus {
    OKAY,
    PLUS_TWO,
    DNF,
}
export enum DataType {
    SINGLE,
    MEAN,
    AVERAGE,
}
export const DataTypeToTextMap = {
    [DataType.SINGLE]: 'TIME',
    [DataType.MEAN]: 'MO',
    [DataType.AVERAGE]: 'AO',
};
export type Solve = {
    time: number;
    isDNF: boolean;
    isPlusTwo: boolean;
    scramble: string;
    date: Date;
};
// The order of these are important for the scramble algorithm!
export const TURNS = ['R', 'U', 'F', 'L', 'D', 'B'];
export const TurnModifiers = ['', '2', "'"];
export const TurnModifiersBigCubes = [...TurnModifiers, 'w', 'w2', "w'"];

export const PuzzleTypeValues = ['2x2x2', '3x3x3', '4x4x4', '5x5x5', '6x6x6', '7x7x7'];
export type PuzzleType = '2x2x2' | '3x3x3' | '4x4x4' | '5x5x5' | '6x6x6' | '7x7x7';
const bigCubes: PuzzleType[] = ['4x4x4', '5x5x5', '6x6x6', '7x7x7'];

export const PuzzleTypeMoveCount = {
    '2x2x2': 8,
    '3x3x3': 20,
    '4x4x4': 46,
    '5x5x5': 60,
    '6x6x6': 80,
    '7x7x7': 100,
};
export const IndexesToSkip = {
    '2x2x2': [1, 3, 4, 5, 7],
    '3x3x3': new Array<number>(),
    '4x4x4': [2, 7, 10, 11, 12, 13, 14, 17, 22],
    '5x5x5': new Array<number>(),
    '6x6x6': [3, 10, 17, 21, 22, 23, 24, 25, 26, 27, 31, 38, 45],
    '7x7x7': new Array<number>(),
};

export function getCubeOrder(type: PuzzleType): number {
    return parseInt(type[0]);
}

export function generateScramble(type: PuzzleType = '3x3x3'): string {
    let moveString = '';
    const scramble = [];

    // Setting these to arbitrarily high numbers so the math of the algorithm works on the first iterations
    let prev = 100;
    let prever = 100;

    const turnMods = bigCubes.includes(type) ? TurnModifiersBigCubes : TurnModifiers;

    for (let i = 0; i < PuzzleTypeMoveCount[type]; i++) {
        let turn = getRand(TURNS.length);
        if (
            // If the current turn is the same as the last turn...
            turn === prev ||
            // or the turn before the last turn (but only if the two previous turns were opposites, like R and L)...
            (Math.abs(prev - prever) === 3 && turn === prever)
        ) {
            // then increment the turn index by one while accounting for overflow
            turn = (turn + 1) % TURNS.length;
        }
        prever = prev;
        prev = turn;

        const turnMod = turnMods[getRand(turnMods.length)];

        const wideMoveLayerCount = getRand(Math.floor(getCubeOrder(type) / 2)) + 1;
        const wideMoveLayerValue = turnMod.includes('w') && wideMoveLayerCount > 2 ? wideMoveLayerCount : '';

        moveString = `${wideMoveLayerValue}${TURNS[turn]}${turnMod}`;
        scramble.push(moveString);
    }
    return scramble.join(' ');
}

export function compareSolveTimes(a: Solve, b: Solve) {
    if (a.isDNF) {
        return 1;
    }

    if (b.isDNF) {
        return -1;
    }
    return a.time - b.time;
}

export function calculateAverage(solvesData: Solve[], index: number, size: number): number {
    if (index + 1 < size) {
        return -1;
    }
    // We want to trim off the bottom and top 5 percent of values, so get that number to trim here
    const trimNum = Math.ceil(size * 0.05);

    const dataSlice = solvesData
        .slice(index - size + 1, index + 1) // Get the data we want to look average
        .sort(compareSolveTimes) // Sort so we can trim off the best/worst values
        .slice(trimNum, size - trimNum); // trim off the best/worst values

    if (dataSlice.filter((solve) => solve.isDNF).length) {
        return -2;
    }

    const average = Math.trunc(dataSlice.reduce((prev, curr) => prev + curr.time, 0) / (size - trimNum * 2));

    return average;
}

export function calculateMean(solvesData: Solve[], index: number, size: number): number {
    if (index + 1 < size) {
        return -1;
    }
    const dataSlice = solvesData.slice(index - size + 1, index + 1);

    if (dataSlice.filter((solve) => solve.isDNF).length) {
        return -2;
    }

    const mean = Math.trunc(dataSlice.reduce((prev, curr) => prev + curr.time, 0) / size);

    return mean;
}
