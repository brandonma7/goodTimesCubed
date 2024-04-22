import { CaseGroup } from '../../../components/CasePickerComponent/CasePickerComponent';

export const ortegaCases: CaseGroup = [
    {
        name: 'Special Cases',
        cases: [
            {
                id: 'c',
                name: 'C',
                algs: ['M U2 M U2'],
                algNotes: ['Use W when second in pair'],
            },
            {
                id: 'w',
                name: 'W',
                algs: ["U2 M' U2 M'"],
                algNotes: ['Use C when second in pair'],
            },
            {
                id: 'i',
                name: 'I',
                algs: ["D' M' U R2 U' M' U R2..."],
                algNotes: ['Use CS when second in pair'],
            },
            {
                id: 's',
                name: 'S',
                algs: ["U2 M' U2 M'"],
                algNotes: ['Use I when second in pair'],
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
            },
            {
                id: 'd',
                name: 'D',
                algs: ["(L' U' L U) M2 (U' L' U L)"],
                algNotes: ['Left sexy move'],
            },
        ],
    },
];
