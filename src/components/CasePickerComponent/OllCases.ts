import { Color } from '../../classes/Cube';
import { CaseGroup } from './CasePickerComponent';

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
                name: 'Sune',
                state: [
                    getEdgeColors('100'),
                    getEdgeColors('000'),
                    getFaceColors('010', '111', '110'),
                    getEdgeColors('100'),
                    getEdgeColors('001'),
                ],
            },
            {
                id: '21',
                name: 'Anti Sune',
                state: [
                    getEdgeColors('001'),
                    getEdgeColors('100'),
                    getFaceColors('010', '111', '011'),
                    getEdgeColors('000'),
                    getEdgeColors('100'),
                ],
            },
            {
                id: '21',
                name: 'H',
                state: [
                    getEdgeColors('101'),
                    getEdgeColors('000'),
                    getFaceColors('010', '111', '010'),
                    getEdgeColors('000'),
                    getEdgeColors('101'),
                ],
            },
            {
                id: '21',
                name: 'Pi',
                state: [
                    getEdgeColors('001'),
                    getEdgeColors('101'),
                    getFaceColors('010', '111', '010'),
                    getEdgeColors('000'),
                    getEdgeColors('001'),
                ],
            },
            {
                id: '21',
                name: 'Headlights',
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('000'),
                    getFaceColors('111', '111', '010'),
                    getEdgeColors('000'),
                    getEdgeColors('101'),
                ],
            },
            {
                id: '21',
                name: 'T',
                state: [
                    getEdgeColors('100'),
                    getEdgeColors('000'),
                    getFaceColors('011', '111', '011'),
                    getEdgeColors('000'),
                    getEdgeColors('100'),
                ],
            },
            {
                id: '21',
                name: 'Bowtie',
                state: [
                    getEdgeColors('000'),
                    getEdgeColors('100'),
                    getFaceColors('011', '111', '110'),
                    getEdgeColors('000'),
                    getEdgeColors('001'),
                ],
            },
        ],
    },
];

// const ollCases: CaseGroup = {
//     //cross: {},
//     //lines: {},
//     cShapes: {
//         name: 'C Shapes',
//         cases: [
//             {
//                 id: 'num50',
//                 name: '#50',
//                 order: ['U', 'U', 'R', 'R', 'R', 'U', 'U', 'L'],
//             },
//         ],
//     },
//lShapes: {},
//fishes: {},
//wShapes: {},
//knights: {},
//cactus: {},
//dot: {},
// };
