import { Color, getSolidFace, getSolvedState } from '../../../classes/Cube';
import { CaseGroup } from '../../../components/CasePickerComponent/CasePickerComponent';
import { FaceState } from '../../../components/CubeVisualizationComponent';

type FaceStateForGeneration = {
    face: number;
    sticker: number;
    color: Color;
};

function generateFaceState(overrides: FaceStateForGeneration[]) {
    const state: FaceState = getSolvedState(5);
    overrides.forEach((override) => {
        state[override.face][override.sticker] = override.color;
    });
    return state;
}

function generateGrayFaceState(overrides: FaceStateForGeneration[]) {
    const state: FaceState = [];
    for (let i = 0; i < 6; i++) {
        state.push(getSolidFace(5, Color.GRAY));
    }
    overrides.forEach((override) => {
        state[override.face][override.sticker] = override.color;
    });
    return state;
}

export const fourBldCases: CaseGroup = [
    {
        name: 'Centers, Ubl buffer',
        cases: [
            {
                id: 'ufb',
                name: 'U/F/B rotation',
                algs: ["r U2 r' d2 r U2 r' d2"],
                algNotes: ['Ubl -> Fdr -> Bdl, use when swapping opposite faces'],
                state: generateFaceState([
                    { face: 0, sticker: 6, color: Color.BLUE },
                    { face: 2, sticker: 18, color: Color.WHITE },
                    { face: 4, sticker: 18, color: Color.GREEN },
                ]),
            },
            {
                id: 'ufr',
                name: 'U/F/R rotation',
                algs: ["r U2 r' d' r U2 r' d"],
                algNotes: ['Ubl -> Fdr -> Rdb, use when swapping adjacent faces'],
                state: generateFaceState([
                    { face: 0, sticker: 6, color: Color.RED },
                    { face: 2, sticker: 18, color: Color.WHITE },
                    { face: 3, sticker: 18, color: Color.GREEN },
                ]),
            },
            {
                id: 'ufu',
                name: 'U/F/U rotation',
                algs: ["f u' f' U' f u f' U"],
                algNotes: ['Ubl -> Ful -> Ufl, use when swapping just two faces'],
                state: generateFaceState([
                    { face: 0, sticker: 6, color: Color.GRAY },
                    { face: 0, sticker: 16, color: Color.GREEN },
                    { face: 2, sticker: 6, color: Color.WHITE },
                ]),
            },
        ],
    },
    {
        name: 'Edges Df (U) buffer',
        cases: [
            {
                id: 'notMSlice',
                name: 'Not on M slice',
                algs: ['(setup) r2 (undo setup)'],
                algNotes: ['Just like M2!'],
                // state: generateFaceState(0, 5, Color.WHITE),
            },
            {
                id: 'lSlice',
                name: 'On L slice (C, K, Q, W)',
                algs: ["(l/l'/l2) (U R' U' B' R2 B) r2 (B' R2 B U R U') (l'/l/l2)"],
                algNotes: ['Use l to put on Q, same setup for Q as M2'],
                state: generateGrayFaceState([
                    { face: 2, sticker: 21, color: Color.GREEN },
                    { face: 5, sticker: 21, color: Color.YELLOW },
                    { face: 0, sticker: 21, color: Color.WHITE },
                    { face: 4, sticker: 21, color: Color.BLUE },
                ]),
            },
            {
                id: 'a',
                name: 'A',
                algs: ['r2'],
                state: generateGrayFaceState([{ face: 0, sticker: 3, color: Color.WHITE }]),
            },
            {
                id: 'i',
                name: 'I',
                algs: ["F d R U R' d' R U' R' F' r2"],
                algNotes: ['If second in pair, do S'],
                state: generateGrayFaceState([{ face: 2, sticker: 3, color: Color.GREEN }]),
            },
            {
                id: 's',
                name: 'S',
                algs: ["r2 F R U R' d R U' R' d' F'"],
                algNotes: ['If second in pair, do I'],
                state: generateGrayFaceState([{ face: 4, sticker: 3, color: Color.BLUE }]),
            },
            {
                id: 'parity',
                name: 'Parity',
                algs: ["r' U2 r U2 r' U2 x (r U2)*3 r2 U2 x' r' U2"],
                algNotes: ['When there is an odd number of edges, irrelevant of other steps'],
                // state: generateFaceState(1, 3, Color.ORANGE),
            },
        ],
    },
];
