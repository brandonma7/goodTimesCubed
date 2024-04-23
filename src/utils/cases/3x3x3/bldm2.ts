import { Color, solidGrayFace, solidOrangeFace, solidRedFace, solidYellowFace } from '../../../classes/Cube';
import { CaseGroup } from '../../../components/CasePickerComponent/CasePickerComponent';

function generateFaceState(face: number, sticker: number, color: Color) {
    const state = [];
    for (let i = 0; i < 6; i++) {
        state.push(solidGrayFace.map((s) => s));
    }
    state[face][sticker] = color;
    return state;
}

export const bldM2Cases: CaseGroup = [
    {
        name: 'Special Cases',
        cases: [
            {
                id: 'c',
                name: 'C',
                algs: ['M U2 M U2'],
                algNotes: ['Use W when second in pair'],
                state: generateFaceState(0, 7, Color.WHITE),
            },
            {
                id: 'w',
                name: 'W',
                algs: ["U2 M' U2 M'"],
                algNotes: ['Use C when second in pair'],
                state: generateFaceState(5, 7, Color.YELLOW),
            },
            {
                id: 'i',
                name: 'I',
                algs: ["D' M' U R2 U' M' U R2 U' D' M2"],
                algNotes: ['Use S when second in pair'],
                state: generateFaceState(2, 1, Color.GREEN),
            },
            {
                id: 's',
                name: 'S',
                algs: ["M2 D U R2 U' M' U R2 U' M D"],
                algNotes: ['Use I when second in pair'],
                state: generateFaceState(4, 7, Color.BLUE),
            },
            {
                id: 'a',
                name: 'A',
                algs: ['M2'],
                state: generateFaceState(0, 1, Color.WHITE),
            },
            {
                id: 'q',
                name: 'Q',
                algs: ["(U R' U') (B' R2 B) M2 (B' R2 B) (U R U')"],
                algNotes: ['(Set up T) (set up P) M2 (undo P setup) (undo T setup)'],
                state: generateFaceState(4, 1, Color.BLUE),
            },
        ],
    },
    {
        name: 'Setup moves',
        cases: [
            {
                id: 'b',
                name: 'B',
                algs: ["(R U R' U') M2 (U R U' R')"],
                algNotes: ['Sexy move'],
                state: generateFaceState(0, 5, Color.WHITE),
            },
            {
                id: 'd',
                name: 'D',
                algs: ["(L' U' L U) M2 (U' L' U L)"],
                algNotes: ['Left sexy move'],
                state: generateFaceState(0, 3, Color.WHITE),
            },
            {
                id: 'e',
                name: 'E',
                algs: ["(B L' B') M2' (B L B')"],
                state: generateFaceState(1, 1, Color.ORANGE),
            },
            {
                id: 'f',
                name: 'F',
                algs: ["(B L2 B') M2' (B L2 B')"],
                state: generateFaceState(1, 5, Color.ORANGE),
            },
            {
                id: 'g',
                name: 'G',
                algs: ["(B L B') M2' (B L' B')"],
                state: generateFaceState(1, 7, Color.ORANGE),
            },
            {
                id: 'h',
                name: 'H',
                algs: ["(L' B L B') M2' (B L' B' L)"],
                state: generateFaceState(1, 3, Color.ORANGE),
            },
            {
                id: 'j',
                name: 'J',
                algs: ["(U R U') M2' (U R' U')"],
                state: generateFaceState(2, 5, Color.GREEN),
            },
            {
                id: 'l',
                name: 'L',
                algs: ["(U' L' U) M2' (U' L U)"],
                state: generateFaceState(2, 3, Color.GREEN),
            },
            {
                id: 'm',
                name: 'M',
                algs: ["(B' R B) M2' (B' R' B)"],
                state: generateFaceState(3, 1, Color.RED),
            },
            {
                id: 'n',
                name: 'N',
                algs: ["(R B' R' B) M2' (B' R B R')"],
                state: generateFaceState(3, 5, Color.RED),
            },
            {
                id: 'o',
                name: 'O',
                algs: ["(B' R' B) M2' (B' R B)"],
                state: generateFaceState(3, 7, Color.RED),
            },
            {
                id: 'p',
                name: 'P',
                algs: ["(B' R2 B) M2' (B' R2 B)"],
                state: generateFaceState(3, 3, Color.RED),
            },
            {
                id: 'r',
                name: 'R',
                algs: ["(U' L U) M2' (U' L' U)"],
                state: generateFaceState(4, 5, Color.BLUE),
            },
            {
                id: 't',
                name: 'T',
                algs: ["(U R' U') M2' (U R U')"],
                state: generateFaceState(4, 3, Color.BLUE),
            },
            {
                id: 'v',
                name: 'V',
                algs: ["(U R2 U') M2' (U R2 U')"],
                state: generateFaceState(5, 5, Color.YELLOW),
            },
            {
                id: 'x',
                name: 'X',
                algs: ["(U' L2 U) M2' (U' L2 U)"],
                state: generateFaceState(5, 3, Color.YELLOW),
            },
        ],
    },
    {
        name: 'Misc',
        cases: [
            {
                id: 'edgeFlip',
                name: 'Edge Flip',
                algs: ["(M' U' M' U' M' U2) (M U' M U' M U2)"],
                algNotes: ['Set up edges to be in A/Q and C/I positions'],
                state: [
                    [
                        Color.WHITE,
                        Color.BLUE,
                        Color.WHITE,
                        Color.WHITE,
                        Color.WHITE,
                        Color.WHITE,
                        Color.WHITE,
                        Color.GREEN,
                        Color.WHITE,
                    ],
                    solidOrangeFace,
                    [
                        Color.GREEN,
                        Color.WHITE,
                        Color.GREEN,
                        Color.GREEN,
                        Color.GREEN,
                        Color.GREEN,
                        Color.GREEN,
                        Color.GREEN,
                        Color.GREEN,
                    ],
                    solidRedFace,
                    [
                        Color.BLUE,
                        Color.WHITE,
                        Color.BLUE,
                        Color.BLUE,
                        Color.BLUE,
                        Color.BLUE,
                        Color.BLUE,
                        Color.BLUE,
                        Color.BLUE,
                    ],
                    solidYellowFace,
                ],
            },
        ],
    },
];
