import { Color } from '../../classes/Cube';
import { Case, CaseGroup } from './CasePickerComponent';

const solidYellowFace = new Array(9).fill(Color.YELLOW);

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
