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
                algs: ["(r U2 r') d2 (r U2 r') d2"],
                algNotes: ['Ubl -> Fdr -> Bdl, use when swapping opposite faces'],
                state: generateFaceState([
                    { face: 0, sticker: 6, color: Color.GREEN },
                    { face: 2, sticker: 18, color: Color.BLUE },
                    { face: 4, sticker: 18, color: Color.WHITE },
                ]),
            },
            {
                id: 'ufr',
                name: 'U/F/R rotation',
                algs: ["(r U2 r') d' (r U2 r') d"],
                algNotes: ['Ubl -> Fdr -> Rdb, use when swapping adjacent faces', "Swap d/d' to cycle with Ldf"],
                state: generateFaceState([
                    { face: 0, sticker: 6, color: Color.GREEN },
                    { face: 2, sticker: 18, color: Color.RED },
                    { face: 3, sticker: 18, color: Color.WHITE },
                ]),
            },
            {
                id: 'ufu',
                name: 'U/F/U rotation',
                algs: ["f u' f' U' f u f' U"],
                algNotes: ['Ubl -> Ful -> Ufl, use when swapping just two adj faces'],
                state: generateFaceState([
                    { face: 0, sticker: 6, color: Color.GREEN },
                    { face: 0, sticker: 16, color: Color.GRAY },
                    { face: 2, sticker: 6, color: Color.WHITE },
                ]),
            },
            {
                id: 'ufd',
                name: 'U/F/D rotation',
                algs: ["(U r U') l2 (U r' U') l2"],
                algNotes: ['Ubl -> Dfl -> Fur, use when swapping opp faces'],
                state: generateFaceState([
                    { face: 0, sticker: 6, color: Color.YELLOW },
                    { face: 2, sticker: 8, color: Color.WHITE },
                    { face: 5, sticker: 6, color: Color.GREEN },
                ]),
            },
            {
                id: 'udu',
                name: 'U/D/U rotation',
                algs: ["(l2 D r2 D')2"],
                algNotes: ['Ubl -> Dfl -> Ufr, use when swapping just two opp faces'],
                state: generateFaceState([
                    { face: 0, sticker: 6, color: Color.YELLOW },
                    { face: 0, sticker: 8, color: Color.GRAY },
                    { face: 5, sticker: 6, color: Color.WHITE },
                ]),
            },
        ],
    },
    {
        name: 'Edges, Df buffer',
        cases: [
            {
                id: 'notMSlice',
                name: 'Not on M slice',
                algs: ['(setup) r2 (undo setup)'],
                algNotes: ['Just like M2!'],
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
                algs: ["F (d (R U R') d' (R U' R')) F' r2"],
                algNotes: ['If second in pair, do S'],
                state: generateGrayFaceState([{ face: 2, sticker: 3, color: Color.GREEN }]),
            },
            {
                id: 's',
                name: 'S',
                algs: ["r2 F ((R U R') d (R U' R') d') F'"],
                algNotes: ['If second in pair, do I'],
                state: generateGrayFaceState([{ face: 4, sticker: 3, color: Color.BLUE }]),
            },
            {
                id: 'parity',
                name: 'Parity',
                algs: ["r' U2 r U2 r' U2 x (r U2)*3 r2 U2 x' r' U2"],
                algNotes: ['When there is an odd number of edges, irrelevant of other steps'],
            },
        ],
    },
];
