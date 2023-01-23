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

export const PuzzleTypeValues = ['2x2x2', '3x3x3', '4x4x4', '5x5x5', '6x6x6', '7x7x7'];
export type PuzzleType = '2x2x2' | '3x3x3' | '4x4x4' | '5x5x5' | '6x6x6' | '7x7x7';

export function generateScramble(size = 20): string {
    let moveString = '';
    const scramble = [];
    // Setting these to arbitrarily high numbers so the math of the algorithm works on the first iterations
    let prev = 100;
    let prever = 100;
    for (let i = 0; i < size; i++) {
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

        const turnMod = TurnModifiers[getRand(TurnModifiers.length)];
        moveString = `${TURNS[turn]}${turnMod}`;
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
