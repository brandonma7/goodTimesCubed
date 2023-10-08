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

export type Scramble = {
    scramble: string;
    state: number[];
};
// The order of these are important for the scramble algorithm!
export const TURNS = ['R', 'U', 'F', 'L', 'D', 'B'];
export const TurnModifiers = ['', '2', "'"];
export const TurnModifiersBigCubes = [...TurnModifiers, 'w', 'w2', "w'"];

export const PuzzleTypeValues = [
    '2x2x2',
    '3x3x3',
    '4x4x4',
    '5x5x5',
    '6x6x6',
    '7x7x7',
    'skewb',
    'pyraminx',
    'square1',
    'megaminx',
    'clock',
];
export type PuzzleType =
    | '2x2x2'
    | '3x3x3'
    | '4x4x4'
    | '5x5x5'
    | '6x6x6'
    | '7x7x7'
    | 'skewb'
    | 'pyraminx'
    | 'square1'
    | 'megaminx'
    | 'clock';
const bigCubes: PuzzleType[] = ['4x4x4', '5x5x5', '6x6x6', '7x7x7'];
export const nonStandardPuzzles = ['skewb', 'pyraminx', 'square1', 'megaminx', 'clock'];

export const PuzzleTypeMoveCount = {
    '2x2x2': 8,
    '3x3x3': 20,
    '4x4x4': 46,
    '5x5x5': 60,
    '6x6x6': 80,
    '7x7x7': 100,
    skewb: 11,
    // Will need to manually add tip moves
    pyraminx: 8,
    square1: 12,
    megaminx: 77,
    clock: 13,
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
    if (nonStandardPuzzles.includes(type)) {
        switch (type) {
            case 'pyraminx':
                return generateSkewbPyraScramble(true);
            case 'skewb':
                return generateSkewbPyraScramble();
            case 'megaminx':
                return generateMegaminxScramble();
            case 'clock':
                return generateClockScramble();
            case 'square1':
                return generateSquare1Scramble();
        }
    }

    let moveString = '';
    const scramble = [];

    // Arbitrarily high numbers so the math of the algorithm works on the first iterations
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

const SKEWB_PYRA_TURNS = ['U', 'L', 'B', 'R'];
const SkewbPyraTurnModifiers = ['', "'"];
function generateSkewbPyraScramble(isPyraminx = false): string {
    let moveString = '';
    const scramble = [];
    const moveCount = PuzzleTypeMoveCount[isPyraminx ? 'pyraminx' : 'skewb'];
    // Arbitrarily high number so the math of the algorithm works on the first iterations
    let prev = 100;

    for (let i = 0; i < moveCount; i++) {
        let turn = getRand(SKEWB_PYRA_TURNS.length);
        // If the current turn is the same as the last turn...
        if (turn === prev) {
            // then increment the turn index by one while accounting for overflow
            turn = (turn + 1) % SKEWB_PYRA_TURNS.length;
        }
        prev = turn;

        const turnMod = SkewbPyraTurnModifiers[getRand(SkewbPyraTurnModifiers.length)];
        moveString = `${SKEWB_PYRA_TURNS[turn]}`;

        const modifiedMoveString = `${moveString}${turnMod}`;
        scramble.push(modifiedMoveString);
    }

    // The last 3 moves of a pyraminx scramble will be lower case for the tips
    if (isPyraminx) {
        const moveStart = getRand(SKEWB_PYRA_TURNS.length);
        let moves = SKEWB_PYRA_TURNS.slice(moveStart);
        if (moves.length < 3) {
            moves = [...moves, ...SKEWB_PYRA_TURNS.slice(0, 3 - moves.length)];
        }
        if (moves.length > 3) {
            moves = moves.slice(0, 3);
        }
        moves.forEach((m, i) => {
            const turnMod = SkewbPyraTurnModifiers[getRand(SkewbPyraTurnModifiers.length)];
            moves[i] = `${m.toLowerCase()}${turnMod}`;
        });
        scramble.push(...moves);
    }

    return scramble.join(' ');
}

function generateMegaminxScramble(): string {
    let scramble = '';
    const width = 10;
    const height = 7;
    for (let i = 0; i < height; i++) {
        if (i > 0) {
            scramble = scramble.concat('\n');
        }
        let dir = 0;
        for (let j = 0; j < width; j++) {
            if (j > 0) {
                scramble = scramble.concat(' ');
            }
            const side = j % 2 == 0 ? 'R' : 'D';
            dir = getRand(2);
            scramble = scramble.concat(side).concat(dir == 0 ? '++' : '--');
        }
        scramble = scramble.concat(' U');
        if (dir != 0) {
            scramble = scramble.concat("'");
        }
    }

    return scramble;
}

const CLOCK_TURNS = ['UR', 'DR', 'DL', 'UL', 'U', 'R', 'D', 'L', 'ALL'];
function generateClockScramble(): string {
    let scramble = '';

    for (let x = 0; x < 9; x++) {
        let turn = getRand(12) - 5;
        const clockwise = turn >= 0;
        turn = Math.abs(turn);
        scramble = scramble
            .concat(CLOCK_TURNS[x])
            .concat(`${turn}`)
            .concat(clockwise ? '+' : '-')
            .concat(' ');
    }
    scramble = scramble.concat('y2 ');
    for (let x = 4; x < 9; x++) {
        let turn = getRand(12) - 5;
        const clockwise = turn >= 0;
        turn = Math.abs(turn);
        scramble = scramble
            .concat(CLOCK_TURNS[x])
            .concat(`${turn}`)
            .concat(clockwise ? '+' : '-')
            .concat(' ');
    }

    let isFirst = true;
    for (let x = 0; x < 4; x++) {
        if (getRand(2) == 1) {
            scramble = scramble.concat(isFirst ? '' : ' ').concat(CLOCK_TURNS[x]);
            isFirst = false;
        }
    }

    return scramble;
}
function generateSquare1Scramble(): string {
    const moves: Square1Move[] = [];
    const moveCount = PuzzleTypeMoveCount['square1'];
    let movesTried: Square1Move[] = [];

    const state = [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 11, 12, 13, 13, 14, 15, 15];

    for (let i = 0; i < moveCount; i++) {
        // Get ALL the moves
        const allMoves = getAllPossibleSlashableSquare1Moves(state);
        // Remove any moves we already tried
        allMoves.filter((m) => {
            return movesTried.map((t) => t.top).includes(m.top) && movesTried.map((t) => t.bottom).includes(m.bottom);
        });
        // If there's no slashable moves, panic and go back a step
        if (moves.length > 0 && allMoves.length === movesTried.length) {
            movesTried.push(moves.pop() ?? { top: 0, bottom: 0, resultState: [] });
            i = moves.length;
            continue;
        }
        // Pick a random one
        movesTried = [];
        const move = allMoves[getRand(allMoves.length)];
        moves.push(move);
    }

    const scramble = moves
        .map((move) => {
            return `(${move.top}, ${move.bottom})`;
        })
        .join(' / ');

    return scramble;
}

type Square1Move = {
    top: number;
    bottom: number;
    resultState: number[];
};

function getAllPossibleSlashableSquare1Moves(state: number[]): Square1Move[] {
    const moves = [];
    for (let top = -5; top <= 6; top++) {
        for (let bottom = -5; bottom <= 6; bottom++) {
            if (top == 0 && bottom == 0) {
                continue;
            }
            const newState = getNewSquare1State(state, top, bottom);
            if (isSquare1Slashable(newState)) {
                moves.push({
                    top,
                    bottom,
                    resultState: newState,
                });
            }
        }
    }
    return moves;
}

function getNewSquare1State(state: number[], top: number, bottom: number): number[] {
    // Do some mysterious math to convert top and bottom to map to the index of t
    top = ((-top % 12) + 12) % 12;
    bottom = ((-bottom % 12) + 12) % 12;
    // Copy state
    const newState = [...state];

    // Grab just the first half of the state since that's the top
    let t = newState.slice(0, 12);
    for (let i = 0; i < 12; i++) {
        newState[i] = t[(top + i) % 12];
    }

    // Grab just the last half of the state since that's the bottom
    t = newState.slice(12);
    for (let i = 0; i < 12; i++) {
        newState[i + 12] = t[(bottom + i) % 12];
    }

    return newState;
}

function isSquare1Slashable(state: number[]): boolean {
    if (state[0] == state[11]) {
        return false;
    }
    if (state[6] == state[5]) {
        return false;
    }
    if (state[12] == state[23]) {
        return false;
    }
    if (state[12 + 6] == state[12 + 6 - 1]) {
        return false;
    }
    return true;
}
