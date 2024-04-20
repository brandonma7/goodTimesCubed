import { Color } from '../../../classes/Cube';
import { CaseGroup } from '../../../components/CasePickerComponent/CasePickerComponent';

const solidYellowFace = new Array(9).fill(Color.YELLOW);

export const ohCases: CaseGroup = [
    {
        name: 'PLL',
        cases: [
            {
                id: 'jaPerm',
                name: 'Ja Perm',
                algs: ["R' U2' R U R' U2' L U' R U L'"],
                algNotes: ['Like doing soon from the back, but then taking back L slot out right before'],
                auf: ['Bar remains on F'],
                state: [
                    [Color.BLUE, Color.ORANGE, Color.ORANGE],
                    [Color.RED, Color.RED, Color.RED],
                    solidYellowFace,
                    [Color.GREEN, Color.BLUE, Color.BLUE],
                    [Color.GREEN, Color.GREEN, Color.ORANGE],
                ],
            },
            {
                id: 'naPerm',
                name: 'Na Perm',
                algs: ["4(r D r' U2) r D r'"],
                auf: ['Opp bar ends up on F'],
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
                algs: ["4(r' D r U2) r' D r"],
                auf: ['Opp bar ends up on F'],
                state: [
                    [Color.GREEN, Color.BLUE, Color.BLUE],
                    [Color.ORANGE, Color.ORANGE, Color.RED],
                    solidYellowFace,
                    [Color.ORANGE, Color.RED, Color.RED],
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                ],
            },
            {
                id: 'zPerm',
                name: 'Z Perm',
                algs: ["R' U' R U' R U R U' R' U R U R2 U' R'"],
                algNotes: ['Front swaps with left instead of right'],
                auf: ['Opp of front headlights will end up on F'],
                state: [
                    [Color.RED, Color.BLUE, Color.RED],
                    [Color.GREEN, Color.ORANGE, Color.GREEN],
                    solidYellowFace,
                    [Color.BLUE, Color.RED, Color.BLUE],
                    [Color.ORANGE, Color.GREEN, Color.ORANGE],
                ],
            },
            {
                id: 'hPerm',
                name: 'H Perm',
                algs: ['R2 U2 R U2 R2 U2 R2 U2 R U2 R2'],
                auf: ['Corners remain oriented'],
                state: [
                    [Color.BLUE, Color.GREEN, Color.BLUE],
                    [Color.RED, Color.ORANGE, Color.RED],
                    solidYellowFace,
                    [Color.ORANGE, Color.RED, Color.ORANGE],
                    [Color.GREEN, Color.BLUE, Color.GREEN],
                ],
            },
            {
                id: 'ePerm',
                name: 'E Perm',
                algs: ["y U2 R2 F 3(R U R' U') F' R2 U2"],
                algNotes: ['Start from U of normal alg'],
                auf: ['Centers remain oriented'],
                state: [
                    [Color.ORANGE, Color.BLUE, Color.RED],
                    [Color.BLUE, Color.RED, Color.GREEN],
                    solidYellowFace,
                    [Color.BLUE, Color.ORANGE, Color.GREEN],
                    [Color.ORANGE, Color.GREEN, Color.RED],
                ],
            },
        ],
    },
];
