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
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('100'),
                    getFaceColors('110', '111', '011'),
                    getEdgeColors('100'),
                    getEdgeColors('000'),
                ],
            },
            {
                id: '26',
                name: '26. Anti Sune',
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
                name: "45. F' Sexy",
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
                name: '56. Fat Dbl Sexy',
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
