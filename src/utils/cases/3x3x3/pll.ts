import { Color, solidYellowFace } from '../../../classes/Cube';
import { Case, CaseGroup } from '../../../components/CasePickerComponent/CasePickerComponent';

export function getPllById(id?: string): Case | undefined {
    if (!id) {
        return;
    }
    const cases = pllCases.map((cg) => cg.cases).flat();
    const c = cases.find((c) => c.id === id);
    return c;
}

export const pllCases: CaseGroup = [
    {
        name: 'Adjacent',
        cases: [
            {
                id: 'tPerm',
                name: 'T Perm',
                algs: ["(R U R' U') R' F R2 U' R' U' R U R' F'"],
                algNotes: ['Double bar, headlights have opp center'],
                auf: ['Bar remains on F'],
                state: [
                    [Color.BLUE, Color.BLUE, Color.ORANGE],
                    [Color.RED, Color.ORANGE, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.RED, Color.BLUE],
                    [Color.GREEN, Color.GREEN, Color.ORANGE],
                ],
            },
            {
                id: 'raPerm',
                name: 'Ra Perm',
                algs: ["R2 F R U R U' R' F' R U2 R' U2 R"],
                algNotes: ['Bar in back, attached to headlights'],
                auf: ['Center remains on F, headlights remains on L'],
                state: [
                    [Color.BLUE, Color.BLUE, Color.ORANGE],
                    [Color.RED, Color.GREEN, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.ORANGE, Color.BLUE],
                    [Color.GREEN, Color.RED, Color.ORANGE],
                ],
            },
            {
                id: 'rbPerm',
                name: 'Rb Perm',
                algs: ["R U R' F' R U2 R' U2 R' F R U R U2 R'"],
                auf: ['Right remains on F, headlights remains on L'],
                state: [
                    [Color.BLUE, Color.RED, Color.ORANGE],
                    [Color.RED, Color.BLUE, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.ORANGE, Color.BLUE],
                    [Color.GREEN, Color.GREEN, Color.ORANGE],
                ],
            },
            {
                id: 'jaPerm',
                name: 'Ja Perm',
                algs: ["l2 U R U' l U2 r' U r U2"],
                algNotes: ['Solid side, bar attached to front'],
                auf: ['Bar remains on F'],
                state: [
                    [Color.BLUE, Color.ORANGE, Color.ORANGE],
                    [Color.RED, Color.RED, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.BLUE, Color.BLUE],
                    [Color.GREEN, Color.GREEN, Color.ORANGE],
                ],
            },
            {
                id: 'jbPerm',
                name: 'Jb Perm',
                algs: ["R U R' F' (R U R' U') R' F R2 U' R'"],
                algNotes: ['Solid side, bar attached to back'],
                auf: ['Bar remains on F'],
                state: [
                    [Color.BLUE, Color.BLUE, Color.ORANGE],
                    [Color.RED, Color.RED, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                    [Color.GREEN, Color.ORANGE, Color.ORANGE],
                ],
            },
            {
                id: 'fPerm',
                name: 'F Perm',
                algs: ["R' U' F' (R U R' U') R' F R2 U' R' U' R U R' U R"],
                algNotes: ["R' U' F' (T perm) F U R"],
                auf: ['Left remains on F, solid face remains on L'],
                state: [
                    [Color.BLUE, Color.GREEN, Color.ORANGE],
                    [Color.RED, Color.RED, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.ORANGE, Color.BLUE],
                    [Color.GREEN, Color.BLUE, Color.ORANGE],
                ],
            },
        ],
    },
    {
        name: 'Opposite',
        cases: [
            {
                id: 'yPerm',
                name: 'Y Perm',
                algs: ["F R U' R' U' R U R' F' (R U R' U') (R' F R F')"],
                algNotes: ['Two bar bookends'],
                auf: ['Bar remains on F'],
                state: [
                    [Color.GREEN, Color.RED, Color.BLUE],
                    [Color.ORANGE, Color.BLUE, Color.RED],
                    solidYellowFace,
                    [Color.ORANGE, Color.ORANGE, Color.RED],
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                ],
            },
            {
                id: 'vPerm',
                name: 'V Perm',
                algs: ["R U' R U R' D R D' R U' D R2 U R2 D' R2"],
                algNotes: ['Two connected bars and nothing else'],
                auf: ['Bar that appears in last 3 moves remains on F'],
                state: [
                    [Color.BLUE, Color.BLUE, Color.GREEN],
                    [Color.RED, Color.RED, Color.ORANGE],
                    solidYellowFace,
                    [Color.RED, Color.GREEN, Color.ORANGE],
                    [Color.BLUE, Color.ORANGE, Color.GREEN],
                ],
            },
            {
                id: 'naPerm',
                name: 'Na Perm',
                algs: ["R U R' U R U R' F' (R U R' U') R' F R2 U' R' U2 R U' R'"],
                algNotes: ["R U R' U (Jb perm) U2 R U' R'"],
                auf: ['Bar remains on F'],
                state: [
                    [Color.BLUE, Color.BLUE, Color.GREEN],
                    [Color.RED, Color.ORANGE, Color.ORANGE],
                    solidYellowFace,
                    [Color.RED, Color.RED, Color.ORANGE],
                    [Color.BLUE, Color.GREEN, Color.GREEN],
                ],
            },
            {
                id: 'nbPerm',
                name: 'Nb Perm',
                algs: ["R' U R U' R' F' U' F R U R' F R' F' R U' R"],
                algNotes: ['idk...'],
                auf: ['Bar remains on F'],
                state: [
                    [Color.GREEN, Color.BLUE, Color.BLUE],
                    [Color.ORANGE, Color.ORANGE, Color.RED],
                    solidYellowFace,
                    [Color.ORANGE, Color.RED, Color.RED],
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                ],
            },
        ],
    },
    {
        name: 'Edges Only',
        cases: [
            {
                id: 'uaPerm',
                name: 'Ua Perm',
                algs: ["R U' R U R U R U' R' U' R2", "R2 U' S' U2 S U' R2"],
                algNotes: ['Backward Ub', 'Awkward but fast, never let go with right hand'],
                auf: ['Corners remain oriented', 'Corners remain oriented'],
                state: [
                    [Color.BLUE, Color.BLUE, Color.BLUE],
                    [Color.RED, Color.GREEN, Color.RED],
                    solidYellowFace,
                    [Color.ORANGE, Color.RED, Color.ORANGE],
                    [Color.GREEN, Color.ORANGE, Color.GREEN],
                ],
            },
            {
                id: 'ubPerm',
                name: 'Ub Perm',
                algs: ["R2 U R U R' U' R' U' R' U R'"],
                algNotes: ['Backward Ua'],
                auf: ['Corners remain oriented'],
                state: [
                    [Color.BLUE, Color.BLUE, Color.BLUE],
                    [Color.RED, Color.ORANGE, Color.RED],
                    solidYellowFace,
                    [Color.ORANGE, Color.GREEN, Color.ORANGE],
                    [Color.GREEN, Color.RED, Color.GREEN],
                ],
            },
            {
                id: 'zPerm',
                name: 'Z Perm',
                algs: ["M' U' M2 U' M2 U' M' U2 M2"],
                algNotes: ['mumumumum'],
                auf: ['Opp of center will end up on F'],
                state: [
                    [Color.BLUE, Color.RED, Color.BLUE],
                    [Color.RED, Color.BLUE, Color.RED],
                    solidYellowFace,
                    [Color.ORANGE, Color.GREEN, Color.ORANGE],
                    [Color.GREEN, Color.ORANGE, Color.GREEN],
                ],
            },
            {
                id: 'hPerm',
                name: 'H Perm',
                algs: ["M2 U' M2 U2 M2 U' M2"],
                algNotes: ['mumum'],
                auf: ['Corners remain oriented'],
                state: [
                    [Color.BLUE, Color.GREEN, Color.BLUE],
                    [Color.RED, Color.ORANGE, Color.RED],
                    solidYellowFace,
                    [Color.ORANGE, Color.RED, Color.ORANGE],
                    [Color.GREEN, Color.BLUE, Color.GREEN],
                ],
            },
        ],
    },
    {
        name: 'Corners Only',
        cases: [
            {
                id: 'aaPerm',
                name: 'Aa Perm',
                algs: ["x L2 D2 L' U' L D2 L' U L'"],
                auf: ['Blocks remain oriented'],
                state: [
                    [Color.BLUE, Color.RED, Color.ORANGE],
                    [Color.RED, Color.GREEN, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.BLUE, Color.BLUE],
                    [Color.GREEN, Color.ORANGE, Color.ORANGE],
                ],
            },
            {
                id: 'abPerm',
                name: 'Ab Perm',
                algs: ["x' L2 D2 L U L' D2 L U' L"],
                auf: ['Blocks remain oriented'],
                state: [
                    [Color.BLUE, Color.ORANGE, Color.ORANGE],
                    [Color.RED, Color.BLUE, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                    [Color.GREEN, Color.RED, Color.ORANGE],
                ],
            },
            {
                id: 'ePerm',
                name: 'E Perm',
                algs: ["r' (U L D' L' U' L D L') (U' L D' L' U L D)"],
                auf: ['Centers remain oriented'],
                state: [
                    [Color.RED, Color.BLUE, Color.ORANGE],
                    [Color.GREEN, Color.RED, Color.BLUE],
                    solidYellowFace,
                    [Color.GREEN, Color.ORANGE, Color.BLUE],
                    [Color.RED, Color.GREEN, Color.ORANGE],
                ],
            },
        ],
    },
    {
        name: 'G',
        cases: [
            {
                id: 'gaPerm',
                name: 'Ga Perm',
                algs: ["R2 U R' U R' U' R U' R2 U' D R' U R D'"],
                algNotes: ['Bar on front'],
                auf: ['Top left remains on F, also bar that appears before final R move'],
                state: [
                    [Color.BLUE, Color.GREEN, Color.ORANGE],
                    [Color.RED, Color.BLUE, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.RED, Color.BLUE],
                    [Color.GREEN, Color.ORANGE, Color.ORANGE],
                ],
            },
            {
                id: 'gbPerm',
                name: 'Gb Perm',
                algs: ["R' U' R D' U R2 U R' U R U' R U' R2 D"],
                algNotes: ['Bar on side, toward back'],
                auf: ['Top left remains on F, also bar that appears before final R move'],
                state: [
                    [Color.BLUE, Color.RED, Color.ORANGE],
                    [Color.RED, Color.ORANGE, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                    [Color.GREEN, Color.BLUE, Color.ORANGE],
                ],
            },
            {
                id: 'gcPerm',
                name: 'Gc Perm',
                algs: ["R2 U' R U' R U R' U R2 U D' R U' R' D"],
                algNotes: ['Bar in back'],
                auf: ['Top left remains on F, also bar that appears before final R move'],
                state: [
                    [Color.BLUE, Color.ORANGE, Color.ORANGE],
                    [Color.RED, Color.GREEN, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.RED, Color.BLUE],
                    [Color.GREEN, Color.BLUE, Color.ORANGE],
                ],
            },
            {
                id: 'gdPerm',
                name: 'Gd Perm',
                algs: ["R U R' D U' R2 U' R U' R U R' U R2 D'"],
                algNotes: ['Bar on side, toward front'],
                auf: ['Top left remains on F, also bar that appears before final R move'],
                state: [
                    [Color.BLUE, Color.GREEN, Color.ORANGE],
                    [Color.RED, Color.ORANGE, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.BLUE, Color.BLUE],
                    [Color.GREEN, Color.RED, Color.ORANGE],
                ],
            },
        ],
    },
];
