import { Color } from '../../classes/Cube';
import { Case, CaseGroup } from './CasePickerComponent';

export function getOllById(id?: string): Case | undefined {
    if (!id) {
        return;
    }
    const cases = ollCases.map((cg) => cg.cases).flat();
    const c = cases.find((c) => c.id === id);
    return c;
}

function getTileColor(value: string): Color {
    return value === '1' ? Color.YELLOW : Color.GRAY;
}

function getEdgeColors(key: string): Color[] {
    return new Array(3).fill(Color.GRAY).map((_, index) => getTileColor(key[index]));
}

function getFaceColors(top: string, mid: string, bot: string): Color[] {
    const key = `${top}${mid}${bot}`;
    return new Array(9).fill(Color.GRAY).map((_, index) => getTileColor(key[index]));
}

export const ollCases: CaseGroup = [
    {
        name: 'Cross',
        cases: [
            {
                id: '21',
                name: '21. H',
                algs: ["R U R' U R U' R' U R U2 R'"],
                algNotes: ['Double Sune'],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('101'),
                    getFaceColors('010', '111', '010'),
                    getEdgeColors('101'),
                    getEdgeColors('000'),
                ],
            },
            {
                id: '22',
                name: '22. Pi',
                algs: ["R U2' R2' U' R2 U' R2' U2' R"],
                algNotes: ['Never let go of R'],
                state: [
                    getEdgeColors('001'),
                    getEdgeColors('101'),
                    getFaceColors('010', '111', '010'),
                    getEdgeColors('000'),
                    getEdgeColors('001'),
                ],
            },
            {
                id: '23',
                name: '23. Headlights',
                algs: ["R2 D R' U2 R D' R' U2 R'"],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('000'),
                    getFaceColors('111', '111', '010'),
                    getEdgeColors('000'),
                    getEdgeColors('101'),
                ],
            },
            {
                id: '24',
                name: '24. T',
                algs: ["r U R' U' L' U R U'"],
                algNotes: ['Fat TPS'],
                state: [
                    getEdgeColors('100'),
                    getEdgeColors('000'),
                    getFaceColors('011', '111', '011'),
                    getEdgeColors('000'),
                    getEdgeColors('100'),
                ],
            },
            {
                id: '25',
                name: '25. Bowtie',
                algs: ["l' U R D' R U' R D"],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('000'),
                    getFaceColors('110', '111', '011'),
                    getEdgeColors('100'),
                    getEdgeColors('100'),
                ],
            },
            {
                id: '26',
                name: '26. Anti Sune',
                algs: ["R U2 R' U' R U' R'"],
                algNotes: ['Sune inverted'],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('100'),
                    getFaceColors('011', '111', '010'),
                    getEdgeColors('001'),
                    getEdgeColors('100'),
                ],
            },
            {
                id: '27',
                name: '27. Sune',
                algs: ["R U R' U R U2 R'"],
                algNotes: ['I mean... Sune'],
                state: [
                    getEdgeColors('100'),
                    getEdgeColors('000'),
                    getFaceColors('010', '111', '110'),
                    getEdgeColors('100'),
                    getEdgeColors('001'),
                ],
            },
        ],
    },
    {
        name: 'T',
        cases: [
            {
                id: '33',
                name: '33. TPS',
                algs: ["(R U R' U') (R' F R F')"],
                algNotes: ['(sexy) (sledge)'],
                state: [
                    getEdgeColors('110'),
                    getEdgeColors('000'),
                    getFaceColors('001', '111', '001'),
                    getEdgeColors('000'),
                    getEdgeColors('110'),
                ],
            },
            {
                id: '45',
                name: '45. Sexy T',
                algs: ["F (R U R' U') F'"],
                algNotes: ["F (sexy) F'"],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('101'),
                    getFaceColors('001', '111', '001'),
                    getEdgeColors('000'),
                    getEdgeColors('010'),
                ],
            },
        ],
    },
    {
        name: 'Square',
        cases: [
            {
                id: '5',
                name: '05. Fat Antisune (L)',
                algs: ["r U2 R' U' R U' r'"],
                algNotes: ['Lefty Fat Inverted Sune'],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('001'),
                    getFaceColors('110', '110', '000'),
                    getEdgeColors('110'),
                    getEdgeColors('011'),
                ],
            },
            {
                id: '6',
                name: '06. Fat Antisune',
                algs: ["l' U2 L U L' U l"],
                algNotes: ['Fat Inverted Sune'],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('110'),
                    getFaceColors('011', '011', '000'),
                    getEdgeColors('001'),
                    getEdgeColors('110'),
                ],
            },
        ],
    },
    {
        name: 'C',
        cases: [
            {
                id: '34',
                name: '34. TPSB',
                algs: ["(R U R' U') B' (R' F R F') B"],
                algNotes: ["(sexy) B (sledge) B'"],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('100'),
                    getFaceColors('000', '111', '101'),
                    getEdgeColors('100'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '46',
                name: '46. C Bar',
                algs: ["R' U' (R' F R F') U R"],
                algNotes: ["R' U' (sledge) U R"],
                state: [
                    getEdgeColors('111'),
                    getEdgeColors('000'),
                    getFaceColors('000', '111', '101'),
                    getEdgeColors('000'),
                    getEdgeColors('010'),
                ],
            },
        ],
    },
    {
        name: 'W',
        cases: [
            {
                id: '36',
                name: '36. Sune Sledge (L)',
                algs: ["L' U' L U' L' U L U (L F' L' F)"],
                algNotes: ['Lefty Sune, but end w/ sledge'],
                state: [
                    getEdgeColors('001'),
                    getEdgeColors('011'),
                    getFaceColors('110', '011', '001'),
                    getEdgeColors('000'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '38',
                name: '38. Sune Sledge',
                algs: ["R U R' U R U' R' U' (R' F R F')"],
                algNotes: ['Sune, but end w/ sledge'],
                state: [
                    getEdgeColors('100'),
                    getEdgeColors('000'),
                    getFaceColors('011', '110', '100'),
                    getEdgeColors('011'),
                    getEdgeColors('010'),
                ],
            },
        ],
    },
    {
        name: 'Corners',
        cases: [
            {
                id: '28',
                name: '28. Bird',
                algs: ["(r U R' U') r' R U R U' R'"],
                algNotes: ['(fat sexy) M (insert)'],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('000'),
                    getFaceColors('111', '110', '101'),
                    getEdgeColors('010'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '57',
                name: '57. H',
                algs: ["(R U R' U') M' (U R U' r')"],
                algNotes: ["(sexy) M' (fat insert)"],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('000'),
                    getFaceColors('101', '111', '101'),
                    getEdgeColors('000'),
                    getEdgeColors('010'),
                ],
            },
        ],
    },
    {
        name: 'P',
        cases: [
            {
                id: '31',
                name: '31. Bad P',
                algs: ["R' U' F (U R U' R') F' R"],
                algNotes: ["R' U' F (insert) F' R"],
                state: [
                    getEdgeColors('100'),
                    getEdgeColors('010'),
                    getFaceColors('011', '011', '001'),
                    getEdgeColors('000'),
                    getEdgeColors('110'),
                ],
            },
            {
                id: '32',
                name: '32. Bad P (L)',
                algs: ["L U F' (U' L' U L) F L'"],
                algNotes: ["L U F' (left insert) F L'"],
                state: [
                    getEdgeColors('001'),
                    getEdgeColors('000'),
                    getFaceColors('110', '110', '100'),
                    getEdgeColors('010'),
                    getEdgeColors('011'),
                ],
            },
            {
                id: '43',
                name: '43. Good P (L)',
                algs: ["F' (U' L' U L) F"],
                algNotes: ["F' (left insert) F"],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('111'),
                    getFaceColors('011', '011', '001'),
                    getEdgeColors('000'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '44',
                name: '44. Good P',
                algs: ["F (U R U' R') F'"],
                algNotes: ["F (insert) F'"],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('000'),
                    getFaceColors('110', '110', '100'),
                    getEdgeColors('111'),
                    getEdgeColors('010'),
                ],
            },
        ],
    },
    {
        name: 'Line',
        cases: [
            {
                id: '51',
                name: '51. Dbl Sexy',
                algs: ["F 2(U R U' R') F'"],
                algNotes: ["F 2(insert) F'"],
                state: [
                    getEdgeColors('110'),
                    getEdgeColors('000'),
                    getFaceColors('000', '111', '000'),
                    getEdgeColors('101'),
                    getEdgeColors('110'),
                ],
            },
            {
                id: '52',
                name: '52. Fat Bottom Sune',
                algs: ["R U R' U R d' R U' R' F'"],
                algNotes: ['Sune w/ random wide d move'],
                state: [
                    getEdgeColors('100'),
                    getEdgeColors('010'),
                    getFaceColors('010', '010', '010'),
                    getEdgeColors('111'),
                    getEdgeColors('100'),
                ],
            },
            {
                id: '55',
                name: '55. Highway',
                algs: ["R U2 R2 U' R U' R' U2 (F R F')"],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('111'),
                    getFaceColors('010', '010', '010'),
                    getEdgeColors('111'),
                    getEdgeColors('000'),
                ],
            },
            {
                id: '56',
                name: '56. Fat Dbl Insert',
                algs: ["r U r' 2(U R U' R') r U' r'"],
                algNotes: ['fat remove 2(insert) fat insert'],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('101'),
                    getFaceColors('000', '111', '000'),
                    getEdgeColors('101'),
                    getEdgeColors('010'),
                ],
            },
        ],
    },
    {
        name: 'Fish',
        cases: [
            {
                id: '9',
                name: '09. TPish',
                algs: ["(R U R' U') R' F R2 U R' U' F'"],
                algNotes: ['Like T Perm but do a U toward the end instead'],
                state: [
                    getEdgeColors('001'),
                    getEdgeColors('100'),
                    getFaceColors('010', '110', '001'),
                    getEdgeColors('010'),
                    getEdgeColors('110'),
                ],
            },
            {
                id: '10',
                name: '10. Su-Sledge-ne',
                algs: ["R U R' U (R' F R F') R U2 R'"],
                algNotes: ['su-(sledge)-ne'],
                state: [
                    getEdgeColors('110'),
                    getEdgeColors('001'),
                    getFaceColors('001', '110', '010'),
                    getEdgeColors('010'),
                    getEdgeColors('001'),
                ],
            },
            {
                id: '35',
                name: '35. U2-Sledge-U2',
                algs: ["R U2 R' (R F R F') R U2 R'"],
                algNotes: ['antisune start (sledge) sune finish'],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('010'),
                    getFaceColors('100', '011', '011'),
                    getEdgeColors('100'),
                    getEdgeColors('100'),
                ],
            },
            {
                id: '37',
                name: '37. YPS',
                algs: ["F R U' R' U' R U R' F'", "(F R' F' R) (U R U' R')"],
                algNotes: ['Start of Y Perm', '(hedge) (insert)'],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('000'),
                    getFaceColors('110', '110', '001'),
                    getEdgeColors('110'),
                    getEdgeColors('110'),
                ],
            },
        ],
    },
    {
        name: 'Knight',
        cases: [
            {
                id: '13',
                name: '13. Backward TPish',
                algs: ["F (U R U' R') R' F' R (U R U' R')"],
                algNotes: ["F (insert) R' F' R (insert)"],
                state: [
                    getEdgeColors('110'),
                    getEdgeColors('000'),
                    getFaceColors('000', '111', '100'),
                    getEdgeColors('100'),
                    getEdgeColors('011'),
                ],
            },
            {
                id: '14',
                name: '14. Sledge Knight',
                algs: ["R' F R U R' F' R F U' F'"],
                algNotes: ['Funky sledge one'],
                state: [
                    getEdgeColors('011'),
                    getEdgeColors('100'),
                    getFaceColors('000', '111', '001'),
                    getEdgeColors('000'),
                    getEdgeColors('110'),
                ],
            },
            {
                id: '15',
                name: '15. Fat Inv Sexy (L)',
                algs: ["l' U' l (L' U' L U) l' U l"],
                algNotes: ["l' U' l (sexy) l' U l "],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('001'),
                    getFaceColors('100', '111', '000'),
                    getEdgeColors('100'),
                    getEdgeColors('011'),
                ],
            },
            {
                id: '16',
                name: '16. Fat Inv Sexy',
                algs: ["r U r' (R U R' U') r U' r'"],
                algNotes: ["r U r' (sexy) r U' r'"],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('100'),
                    getFaceColors('001', '111', '000'),
                    getEdgeColors('001'),
                    getEdgeColors('110'),
                ],
            },
        ],
    },
    {
        name: 'L',
        cases: [
            {
                id: '47',
                name: '47. Dbl Inv Sexy (L)',
                algs: ["F' 2(L' U' L U) F"],
                algNotes: ["F' 2(left sexy) F"],
                state: [
                    getEdgeColors('100'),
                    getEdgeColors('010'),
                    getFaceColors('010', '011', '000'),
                    getEdgeColors('101'),
                    getEdgeColors('110'),
                ],
            },
            {
                id: '48',
                name: '48. Dbl Inv Sexy',
                algs: ["F 2(R U R' U') F'"],
                algNotes: ["F 2(sexy) F'"],
                state: [
                    getEdgeColors('001'),
                    getEdgeColors('101'),
                    getFaceColors('010', '110', '000'),
                    getEdgeColors('010'),
                    getEdgeColors('011'),
                ],
            },
            {
                id: '49',
                name: '49. r2 Away',
                algs: ["r U' r2' U r2 U r2' U' r"],
                algNotes: ['Never let go of r'],
                state: [
                    getEdgeColors('001'),
                    getEdgeColors('111'),
                    getFaceColors('010', '011', '000'),
                    getEdgeColors('000'),
                    getEdgeColors('011'),
                ],
            },
            {
                id: '50',
                name: '50. r2 toward',
                algs: ["r' U r2 U' r2' U' r2 U r'"],
                algNotes: ['Never let go of r'],
                state: [
                    getEdgeColors('011'),
                    getEdgeColors('111'),
                    getFaceColors('000', '011', '010'),
                    getEdgeColors('000'),
                    getEdgeColors('001'),
                ],
            },
            {
                id: '53',
                name: '53. Fat Dbl Sexy (L)',
                algs: ["l' U' l (L' U' L U) l' U l"],
                algNotes: ["l' U' l (left sexy) l' U l"],
                state: [
                    getEdgeColors('101'),
                    getEdgeColors('010'),
                    getFaceColors('010', '011', '000'),
                    getEdgeColors('000'),
                    getEdgeColors('111'),
                ],
            },
            {
                id: '54',
                name: '54. Fat Dbl Sexy',
                algs: ["r U r' (R U R' U') r U' r'"],
                algNotes: ["r U r' (sexy) r U' r'"],
                state: [
                    getEdgeColors('101'),
                    getEdgeColors('000'),
                    getFaceColors('010', '110', '000'),
                    getEdgeColors('010'),
                    getEdgeColors('111'),
                ],
            },
        ],
    },
    {
        name: 'Cactus',
        cases: [
            {
                id: '29',
                name: '29. Cactus (L)',
                algs: ["F U R U2' R' U' R U2' R' U' F'"],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('110'),
                    getFaceColors('010', '011', '101'),
                    getEdgeColors('100'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '30',
                name: '30. Cactus',
                algs: ["F' U' L' U2 L U L' U2 L U F"],
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('100'),
                    getFaceColors('010', '110', '101'),
                    getEdgeColors('110'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '41',
                name: '41. Sune Inv Sexy',
                algs: ["(R U R' U R U2 R') F (R U R' U') F'"],
                algNotes: ["(sune) F (sexy) F'"],
                state: [
                    getEdgeColors('101'),
                    getEdgeColors('000'),
                    getFaceColors('010', '110', '101'),
                    getEdgeColors('010'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '42',
                name: '42. Sune Inv Sexy (L)',
                algs: ["(L' U' L U' L' U2 L) F' (L' U' L U) F"],
                algNotes: ["(left sune) F' (left sexy) F"],
                state: [
                    getEdgeColors('101'),
                    getEdgeColors('010'),
                    getFaceColors('010', '011', '101'),
                    getEdgeColors('000'),
                    getEdgeColors('010'),
                ],
            },
        ],
    },
    {
        name: 'Lightning',
        cases: [
            {
                id: '7',
                name: '07. Fat Sune',
                algs: ["r U R' U R U2 r'"],
                state: [
                    getEdgeColors('100'),
                    getEdgeColors('000'),
                    getFaceColors('010', '110', '100'),
                    getEdgeColors('110'),
                    getEdgeColors('011'),
                ],
            },
            {
                id: '8',
                name: '08. Fat Sune (L)',
                algs: ["l' U' L U' L' U2 l"],
                state: [
                    getEdgeColors('001'),
                    getEdgeColors('110'),
                    getFaceColors('010', '011', '001'),
                    getEdgeColors('000'),
                    getEdgeColors('110'),
                ],
            },
            {
                id: '11',
                name: '11. Lil Lightning',
                algs: ["S' U2 (R U R' U R U2 R') S"],
                algNotes: ["S' U2 (sune) S"],
                state: [
                    getEdgeColors('100'),
                    getEdgeColors('001'),
                    getFaceColors('011', '110', '000'),
                    getEdgeColors('010'),
                    getEdgeColors('011'),
                ],
            },
            {
                id: '12',
                name: '12. Lil Lightning (L)',
                algs: ["S U2 (L' U' L U' L' U2 L) S'"],
                algNotes: ["S U2 (left sune) S'"],
                state: [
                    getEdgeColors('001'),
                    getEdgeColors('010'),
                    getFaceColors('110', '011', '000'),
                    getEdgeColors('001'),
                    getEdgeColors('110'),
                ],
            },
            {
                id: '39',
                name: '39. Big Lightning',
                algs: ["f R' F' R (U R U' R') S'"],
                algNotes: ["f R' F' R (insert) S'"],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('000'),
                    getFaceColors('100', '111', '001'),
                    getEdgeColors('100'),
                    getEdgeColors('110'),
                ],
            },
            {
                id: '40',
                name: '40. Big Lightning (L)',
                algs: ["f' L F L' (U' L' U L) S"],
                algNotes: ["f' L F L' (insert) S"],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('100'),
                    getFaceColors('001', '111', '100'),
                    getEdgeColors('000'),
                    getEdgeColors('011'),
                ],
            },
        ],
    },
    {
        name: 'Dot',
        cases: [
            {
                id: '1',
                name: '01. U2 Sl U2 Sl',
                algs: ["R U2 R' (R' F R F') U2 (R' F R F')"],
                algNotes: ["R U2 R' (sledge) U2 (sledge)"],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('111'),
                    getFaceColors('000', '010', '000'),
                    getEdgeColors('111'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '2',
                name: '02. Inv Sexy U2 Sexy',
                algs: ["F (R U R' U') F' U2 F (U R U' R') F'"],
                algNotes: ["F (sexy) F' U2 F (insert) F'"],
                state: [
                    getEdgeColors('011'),
                    getEdgeColors('111'),
                    getFaceColors('000', '010', '000'),
                    getEdgeColors('010'),
                    getEdgeColors('011'),
                ],
            },
            {
                id: '3',
                name: '03. 10:30',
                algs: ["F (U R U' R') F' U F (R U R' U') F'"],
                algNotes: ["F (insert) F' U F (sexy) F'"],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('011'),
                    getFaceColors('100', '010', '000'),
                    getEdgeColors('110'),
                    getEdgeColors('011'),
                ],
            },
            {
                id: '4',
                name: '04. 7:30',
                algs: ["F (U R U' R') F' U' F (R U R' U') F'"],
                algNotes: ["F (insert) F' U' F (sexy) F'"],
                state: [
                    getEdgeColors('011'),
                    getEdgeColors('110'),
                    getFaceColors('000', '010', '100'),
                    getEdgeColors('011'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '17',
                name: '17. Arrow',
                algs: ["R U R' U (R' F R F') U2 (R' F R F')"],
                algNotes: ["R U R' U (sledge) U2 (sledge)"],
                state: [
                    getEdgeColors('011'),
                    getEdgeColors('011'),
                    getFaceColors('100', '010', '001'),
                    getEdgeColors('010'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '18',
                name: '18. Fat Sune U2 Fat Sune',
                algs: ["r U R' U R U2 r U2 l' U' L U' L' U2 l"],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('010'),
                    getFaceColors('101', '010', '000'),
                    getEdgeColors('010'),
                    getEdgeColors('111'),
                ],
            },
            {
                id: '19',
                name: '19. V dot',
                algs: ["r' R U (R U R' U') M' (R' F R F')"],
                algNotes: ["M U (sexy) M' (sledge)"],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('011'),
                    getFaceColors('101', '010', '000'),
                    getEdgeColors('011'),
                    getEdgeColors('010'),
                ],
            },
            {
                id: '20',
                name: '20. X dot',
                algs: ["r' R U (R U R' U') M2 (U R U' r')"],
                algNotes: ['M U (sexy) M2 (fat insert)'],
                state: [
                    getEdgeColors('010'),
                    getEdgeColors('010'),
                    getFaceColors('101', '010', '101'),
                    getEdgeColors('010'),
                    getEdgeColors('010'),
                ],
            },
        ],
    },
];
