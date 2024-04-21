import { Case, CaseGroup } from '../../../components/CasePickerComponent/CasePickerComponent';

export function getOrtegaById(id?: string): Case | undefined {
    if (!id) {
        return;
    }
    const cases = ortegaCases.map((cg) => cg.cases).flat();
    const c = cases.find((c) => c.id === id);
    return c;
}

export const ortegaCases: CaseGroup = [
    {
        name: 'Top Adjacent',
        cases: [
            {
                id: 'adjSolved',
                name: 'adj | sol',
                algs: ["(R U R' U') R' F R2 U' R' U' R U R' F'"],
                algNotes: ['Just T/J/R/F/G perm'],
                auf: ['Same as whatever perm'],
            },
            {
                id: 'adjAdj',
                name: 'adj | adj',
                algs: ["R2 U' B2 U2 R2 U' R2"],
                auf: ['Bars will remain on F face'],
            },
            {
                id: 'adjOpp',
                name: 'adj | opp',
                algs: ["R U' R F2 R' U R'"],
                auf: ['Bar and bottom right will remain on F face'],
            },
        ],
    },
    {
        name: 'Top Opposite',
        cases: [
            {
                id: 'oppSolved',
                name: 'opp | sol',
                algs: ["F R U' R' U' R U R' F' (R U R' U') (R' F R F')"],
                auf: ['Top left will remain on F face'],
            },
            {
                id: 'oppAdj',
                name: 'opp | adj',
                algs: ["R' D R' F2 R D' R"],
                auf: ['Bar and top right will remain on F face'],
            },
            {
                id: 'oppOpp',
                name: 'opp | opp',
                algs: ['R2 B2 R2'],
                auf: ['Left pieces will remain on F face'],
            },
        ],
    },
    {
        name: 'Top Solved',
        cases: [
            {
                id: 'solvedAdj',
                name: 'sol | adj',
                algs: ["R2 (R U R' U') R' F R2 U' R' U' R U R' F' R2"],
                algNotes: ['R2 (T/J/R/F/G perm) R2'],
                auf: ['Same as whatever perm'],
            },
            {
                id: 'solvedOpp',
                name: 'sol | opp',
                algs: ["x2 F R U' R' U' R U R' F' (R U R' U') (R' F R F')"],
                auf: ['Top left after x2 will remain on F face'],
            },
        ],
    },
];
