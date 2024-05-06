import { CaseGroup } from '../../../components/CasePickerComponent/CasePickerComponent';
import { Color, invertAlgorithm, solidGrayFace } from '../../cubingUtils';

const yPerm = "R U' R' U' R U R' F' R U R' U' R' F R";
export function getLetterToAlgMapping() {
    const algList = bldOpCases.flatMap((group) => group.cases.map((c) => ({ id: c.name, alg: (c.algs ?? [''])[0] })));
    const mapping: {
        [key: string]: string;
    } = {};
    algList.forEach((alg) => {
        const setupMoves = alg.alg.replaceAll('(', '').replaceAll(')', '');
        mapping[alg.id] = `${setupMoves} ${yPerm} ${invertAlgorithm(setupMoves)}`;
    });
    return mapping;
}

function generateFaceState(face: number, sticker: number, color: Color) {
    const state = [];
    for (let i = 0; i < 6; i++) {
        state.push(solidGrayFace.map((s) => s));
    }
    state[face][sticker] = color;
    return state;
}
export const bldOpCases: CaseGroup = [
    {
        name: 'Corners',
        cases: [
            {
                id: 'b',
                name: 'B',
                algs: ['R2'],
                state: generateFaceState(0, 2, Color.WHITE),
            },
            {
                id: 'c',
                name: 'C',
                algs: ["R2 D'"],
                state: generateFaceState(0, 8, Color.WHITE),
            },
            {
                id: 'd',
                name: 'D',
                algs: ['F2'],
                state: generateFaceState(0, 6, Color.WHITE),
            },
            {
                id: 'f',
                name: 'F',
                algs: ["F' D"],
                state: generateFaceState(1, 2, Color.ORANGE),
            },
            {
                id: 'g',
                name: 'G',
                algs: ["F'"],
                state: generateFaceState(1, 8, Color.ORANGE),
            },
            {
                id: 'h',
                name: 'H',
                algs: ["D' R"],
                state: generateFaceState(1, 6, Color.ORANGE),
            },
            {
                id: 'i',
                name: 'I',
                algs: ["F R'"],
                state: generateFaceState(2, 0, Color.GREEN),
            },
            {
                id: 'j',
                name: 'J',
                algs: ["R'"],
                state: generateFaceState(2, 2, Color.GREEN),
            },
            {
                id: 'k',
                name: 'K',
                algs: ["F' R'"],
                state: generateFaceState(2, 8, Color.GREEN),
            },
            {
                id: 'l',
                name: 'L',
                algs: ["F2 R'"],
                state: generateFaceState(2, 6, Color.GREEN),
            },
            {
                id: 'm',
                name: 'M',
                algs: ['F'],
                state: generateFaceState(3, 0, Color.RED),
            },
            {
                id: 'n',
                name: 'N',
                algs: ["R' F"],
                state: generateFaceState(3, 2, Color.RED),
            },
            {
                id: 'o',
                name: 'O',
                algs: ['R2 F'],
                state: generateFaceState(3, 8, Color.RED),
            },
            {
                id: 'p',
                name: 'P',
                algs: ['R F'],
                state: generateFaceState(3, 6, Color.RED),
            },
            {
                id: 'q',
                name: 'Q',
                algs: ["R D'"],
                state: generateFaceState(4, 0, Color.BLUE),
            },
            {
                id: 's',
                name: 'S',
                algs: ["D F'"],
                state: generateFaceState(4, 8, Color.BLUE),
            },
            {
                id: 't',
                name: 'T',
                algs: ['R'],
                state: generateFaceState(4, 6, Color.BLUE),
            },
            {
                id: 'u',
                name: 'U',
                algs: ['D'],
                state: generateFaceState(5, 0, Color.YELLOW),
            },
            {
                id: 'v',
                name: 'V',
                algs: [''],
                state: generateFaceState(5, 2, Color.YELLOW),
            },
            {
                id: 'w',
                name: 'W',
                algs: ["D'"],
                state: generateFaceState(5, 8, Color.YELLOW),
            },
            {
                id: 'x',
                name: 'X',
                algs: ['D2'],
                state: generateFaceState(5, 6, Color.YELLOW),
            },
        ],
    },
];
