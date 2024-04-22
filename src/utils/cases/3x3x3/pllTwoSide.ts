import { Color } from '../../../classes/Cube';
import { FaceState, scrambleLetterColors } from '../../../components/CubeVisualizationComponent';

export type PllTwoSidesType = {
    id: PllTwoSideId;
    name: string;
    state: number[][];
    patterns: PllTwoSidesPatternType[];
};

type PllTwoSidesPatternType = {
    name: string;
    description: string;
    state: number[][];
    hidden?: boolean;
};
export const pllTwoSideIdList = [
    'threeBar',
    'dblHeadlights',
    'lightsTwoBar',
    'loneLights',
    'dblTwoBar',
    'outerTwoBar',
    'innerTwoBar',
    'bookends',
    'noBookends',
    'all',
] as const;

export type PllTwoSideId = (typeof pllTwoSideIdList)[number];

const topColorMapping: {
    [k in (typeof scrambleLetterColors)[number]]: Color[];
} = {
    yellow: [Color.GREEN, Color.ORANGE, Color.BLUE, Color.RED],
    white: [Color.GREEN, Color.RED, Color.BLUE, Color.ORANGE],
    red: [Color.YELLOW, Color.BLUE, Color.WHITE, Color.GREEN],
    orange: [Color.YELLOW, Color.GREEN, Color.WHITE, Color.BLUE],
    green: [Color.RED, Color.WHITE, Color.ORANGE, Color.YELLOW],
    blue: [Color.RED, Color.YELLOW, Color.ORANGE, Color.WHITE],
};

export function getStateColors(pattern: number[][], topColor: string, offset: number): FaceState {
    const colorCodes = topColorMapping[topColor];
    const colors = pattern.map((side) =>
        side.map((sticker) => (sticker === -1 ? Color.GRAY : colorCodes[(sticker + offset) % colorCodes.length])),
    );
    return colors;
}

export const pllTwoSides: PllTwoSidesType[] = [
    {
        id: 'threeBar',
        name: '3-Bar',
        state: [
            [0, 0, 0],
            [-1, -1, -1],
        ],
        patterns: [
            {
                name: 'Ua',
                description: 'Headlights with adj center',
                state: [
                    [0, 0, 0],
                    [1, 2, 1],
                ],
            },
            {
                name: 'Ua',
                description: 'Headlights with opp center',
                hidden: true,
                state: [
                    [3, 1, 3],
                    [0, 0, 0],
                ],
            },
            {
                name: 'Ub',
                description: 'Headlights with opp center',
                state: [
                    [0, 0, 0],
                    [1, 3, 1],
                ],
            },
            {
                name: 'Ub',
                description: 'Headlights with adj center',
                hidden: true,
                state: [
                    [3, 2, 3],
                    [0, 0, 0],
                ],
            },
            {
                name: 'Ja',
                description: '2-bar attached',
                state: [
                    [0, 0, 0],
                    [1, 1, 2],
                ],
            },
            {
                name: 'Ja',
                description: '2-bar attached',
                hidden: true,
                state: [
                    [2, 2, 3],
                    [0, 0, 0],
                ],
            },
            {
                name: 'Jb',
                description: '2-bar unattached',
                state: [
                    [0, 0, 0],
                    [1, 2, 2],
                ],
            },
            {
                name: 'Jb',
                description: '2-bar unattached',
                hidden: true,
                state: [
                    [2, 3, 3],
                    [0, 0, 0],
                ],
            },
            {
                name: 'F',
                description: '4 colors',
                state: [
                    [0, 0, 0],
                    [1, 3, 2],
                ],
            },
            {
                name: 'F',
                description: '4 colors',
                hidden: true,
                state: [
                    [2, 1, 3],
                    [0, 0, 0],
                ],
            },
        ],
    },
    {
        id: 'dblHeadlights',
        name: 'Double Headlights',
        state: [
            [0, -1, 0],
            [1, -1, 1],
        ],
        patterns: [
            {
                name: 'Z',
                description: '2 color checkerboard',
                state: [
                    [0, 1, 0],
                    [1, 0, 1],
                ],
            },
            {
                name: 'Z',
                description: '4 colors, edges adj to corners',
                state: [
                    [0, 3, 0],
                    [1, 2, 1],
                ],
            },
            {
                name: 'H',
                description: 'Edges opp to corners',
                state: [
                    [0, 2, 0],
                    [1, 3, 1],
                ],
            },
            {
                name: 'Ua',
                description: '2:1 pattern, 3 colors, adj center',
                state: [
                    [0, 1, 0],
                    [1, 2, 1],
                ],
            },
            {
                name: 'Ua',
                description: '2:1 pattern, 3 colors, opp center',
                hidden: true,
                state: [
                    [3, 0, 3],
                    [0, 2, 0],
                ],
            },
            {
                name: 'Ub',
                description: '2:1 pattern, 3 colors, opp center',
                state: [
                    [0, 2, 0],
                    [1, 0, 1],
                ],
            },
            {
                name: 'Ub',
                description: '2:1 pattern, 3 colors, adj center',
                hidden: true,
                state: [
                    [3, 2, 3],
                    [0, 3, 0],
                ],
            },
        ],
    },
    {
        id: 'lightsTwoBar',
        name: 'Lights and 2-Bar',
        state: [
            [0, -1, 0],
            [1, 1, -1],
        ],
        patterns: [
            {
                name: 'T',
                description: 'Inner bar, opp center in headlights',
                state: [
                    [0, 2, 0],
                    [1, 1, 2],
                ],
            },
            {
                name: 'T',
                description: 'Inner bar, opp center in headlights',
                hidden: true,
                state: [
                    [2, 3, 3],
                    [0, 2, 0],
                ],
            },
            {
                name: 'Ra',
                description: 'Inner bar, adj center in headlights',
                hidden: true,
                state: [
                    [2, 3, 3],
                    [0, 1, 0],
                ],
            },
            {
                name: 'Rb',
                description: 'Inner bar, adj center in headlights',
                state: [
                    [0, 3, 0],
                    [1, 1, 2],
                ],
            },
            {
                name: 'Aa',
                description: 'Outer bar, 4 checkerboard',
                state: [
                    [0, 1, 0],
                    [1, 2, 2],
                ],
            },
            {
                name: 'Ab',
                description: 'Outer bar, 4 checkerboard',
                hidden: true,
                state: [
                    [2, 2, 3],
                    [0, 3, 0],
                ],
            },
            {
                name: 'Ga',
                description: 'Outer bar, 3 colors',
                state: [
                    [0, 3, 0],
                    [1, 2, 2],
                ],
            },
            {
                name: 'Gc',
                description: 'Outer bar, 3 colors',
                hidden: true,
                state: [
                    [2, 2, 3],
                    [0, 1, 0],
                ],
            },
        ],
    },
    {
        id: 'loneLights',
        name: 'Lone Lights',
        state: [
            [0, -1, 0],
            [-1, -1, -1],
        ],
        patterns: [
            {
                name: 'Ra',
                description: '5 Checkboard',
                state: [
                    [0, 1, 0],
                    [1, 0, 2],
                ],
            },
            {
                name: 'Rb',
                description: '5 Checkboard',
                hidden: true,
                state: [
                    [2, 0, 3],
                    [0, 3, 0],
                ],
            },
            {
                name: 'Ga',
                description: '4 Checkboard',
                hidden: true,
                state: [
                    [2, 1, 3],
                    [0, 3, 0],
                ],
            },
            {
                name: 'Gc',
                description: '4 Checkboard',
                state: [
                    [0, 1, 0],
                    [1, 3, 2],
                ],
            },
            {
                name: 'Gb',
                description: 'Opp center in headlights',
                state: [
                    [0, 2, 0],
                    [1, 3, 2],
                ],
            },
            {
                name: 'Gb',
                description: 'Opp center in headlights',
                hidden: true,
                state: [
                    [2, 0, 3],
                    [0, 2, 0],
                ],
            },
            {
                name: 'Gd',
                description: 'Opp center in headlights',
                hidden: true,
                state: [
                    [0, 2, 0],
                    [1, 0, 2],
                ],
            },
            {
                name: 'Gd',
                description: 'Opp center in headlights',
                hidden: true,
                state: [
                    [2, 1, 3],
                    [0, 2, 0],
                ],
            },
            {
                name: 'Aa',
                description: 'Adj center in headlights',
                hidden: true,
                state: [
                    [2, 0, 3],
                    [0, 1, 0],
                ],
            },
            {
                name: 'Ab',
                description: 'Adj center in headlights',
                state: [
                    [0, 3, 0],
                    [1, 0, 2],
                ],
            },
        ],
    },
    {
        id: 'dblTwoBar',
        name: 'Double 2-Bar',
        state: [
            [0, 0, -1],
            [-1, 1, 1],
        ],
        patterns: [
            {
                name: 'Y',
                description: 'Both outer',
                state: [
                    [0, 0, 2],
                    [3, 1, 1],
                ],
            },
            {
                name: 'Aa',
                description: 'Both inner and bookends',
                hidden: true,
                state: [
                    [3, 0, 0],
                    [1, 1, 3],
                ],
            },
            {
                name: 'Ab',
                description: 'Both inner and bookends',
                state: [
                    [2, 0, 0],
                    [1, 1, 2],
                ],
            },
            {
                name: 'V',
                description: 'Both inner and no bookends',
                state: [
                    [2, 0, 0],
                    [1, 1, 3],
                ],
            },
            {
                name: 'Ja',
                description: 'Same side and bookends',
                state: [
                    [0, 0, 2],
                    [3, 3, 0],
                ],
            },
            {
                name: 'Ja',
                description: 'Same side and bookends',
                hidden: true,
                state: [
                    [0, 0, 1],
                    [2, 2, 0],
                ],
            },
            {
                name: 'Jb',
                description: 'Same side and bookends',
                hidden: true,
                state: [
                    [3, 0, 0],
                    [1, 3, 3],
                ],
            },
            {
                name: 'Jb',
                description: 'Same side and bookends',
                hidden: true,
                state: [
                    [2, 0, 0],
                    [1, 2, 2],
                ],
            },
            {
                name: 'Na',
                description: 'Same side and no bookends',
                state: [
                    [2, 0, 0],
                    [1, 3, 3],
                ],
            },
            {
                name: 'Nb',
                description: 'Same side and no bookends',
                hidden: true,
                state: [
                    [0, 0, 2],
                    [3, 3, 1],
                ],
            },
        ],
    },
    {
        id: 'outerTwoBar',
        name: 'Outer 2-Bar',
        state: [
            [0, 0, -1],
            [-1, -1, -1],
        ],
        patterns: [
            {
                name: 'V',
                description: 'No bookends',
                state: [
                    [0, 0, 2],
                    [3, 2, 1],
                ],
            },
            {
                name: 'V',
                description: 'No bookends',
                hidden: true,
                state: [
                    [3, 2, 1],
                    [2, 0, 0],
                ],
            },
            {
                name: 'Ra',
                description: 'Adj appears twice',
                hidden: true,
                state: [
                    [0, 3, 2],
                    [3, 0, 0],
                ],
            },
            {
                name: 'Rb',
                description: 'Adj appears twice',
                state: [
                    [0, 0, 1],
                    [2, 1, 0],
                ],
            },
            {
                name: 'Gb',
                description: 'Opp appears twice',
                hidden: true,
                state: [
                    [0, 2, 1],
                    [2, 0, 0],
                ],
            },
            {
                name: 'Gd',
                description: 'Opp appears twice',
                state: [
                    [0, 0, 2],
                    [3, 2, 0],
                ],
            },
            {
                name: 'T',
                description: 'Adj by bar and 4 colors',
                state: [
                    [0, 0, 1],
                    [2, 3, 0],
                ],
            },
            {
                name: 'T',
                description: 'Adj by bar and 4 colors',
                hidden: true,
                state: [
                    [0, 1, 2],
                    [3, 0, 0],
                ],
            },
            {
                name: 'Aa',
                description: 'Opp by bar and 4 colors',
                state: [
                    [0, 0, 2],
                    [3, 1, 0],
                ],
            },
            {
                name: 'Ab',
                description: 'Opp by bar and 4 colors',
                hidden: true,
                state: [
                    [0, 3, 1],
                    [2, 0, 0],
                ],
            },
        ],
    },
    {
        id: 'innerTwoBar',
        name: 'Inner 2-Bar',
        state: [
            [-1, 0, 0],
            [-1, -1, -1],
        ],
        patterns: [
            {
                name: 'Ga',
                description: 'Bookends adj color',
                state: [
                    [3, 0, 0],
                    [1, 2, 3],
                ],
            },
            {
                name: 'Gc',
                description: 'Bookends adj color',
                hidden: true,
                state: [
                    [1, 2, 3],
                    [0, 0, 1],
                ],
            },
            {
                name: 'Gb',
                description: 'Bookends opp color',
                state: [
                    [2, 0, 0],
                    [1, 3, 2],
                ],
            },
            {
                name: 'Gd',
                description: 'Bookends opp color',
                hidden: true,
                state: [
                    [2, 1, 3],
                    [0, 0, 2],
                ],
            },
            {
                name: 'Y',
                description: 'No bookends',
                state: [
                    [2, 0, 0],
                    [1, 2, 3],
                ],
            },
            {
                name: 'Y',
                description: 'No bookends',
                hidden: true,
                state: [
                    [1, 2, 3],
                    [0, 0, 2],
                ],
            },
        ],
    },
    {
        id: 'bookends',
        name: 'Bookends No Bar',
        state: [
            [0, -1, -1],
            [-1, -1, 0],
        ],
        patterns: [
            {
                name: 'F',
                description: 'Enclosed 4 checker',
                state: [
                    [0, 3, 2],
                    [3, 2, 0],
                ],
            },
            {
                name: 'F',
                description: 'Enclosed 4 checker',
                hidden: true,
                state: [
                    [0, 2, 1],
                    [2, 1, 0],
                ],
            },
            {
                name: 'Ra',
                description: 'Adj appears twice',
                hidden: true,
                state: [
                    [0, 3, 1],
                    [2, 1, 0],
                ],
            },
            {
                name: 'Rb',
                description: 'Adj appears twice',
                state: [
                    [0, 3, 2],
                    [3, 1, 0],
                ],
            },
            {
                name: 'Ga',
                description: 'Opp appears twice',
                hidden: true,
                state: [
                    [0, 1, 2],
                    [3, 2, 0],
                ],
            },
            {
                name: 'Gc',
                description: 'Opp appears twice',
                state: [
                    [0, 2, 1],
                    [2, 3, 0],
                ],
            },
        ],
    },
    {
        id: 'noBookends',
        name: 'No Bookends',
        state: [
            [0, -1, -1],
            [-1, -1, 1],
        ],
        patterns: [
            {
                name: 'V',
                description: 'Inner 4 checker',
                state: [
                    [0, 3, 2],
                    [3, 2, 1],
                ],
            },
            {
                name: 'Y',
                description: 'Outer 4 checker',
                state: [
                    [0, 1, 2],
                    [3, 0, 1],
                ],
            },
            {
                name: 'E',
                description: '5 checker w/ opp middle',
                state: [
                    [0, 3, 2],
                    [3, 0, 1],
                ],
            },
            {
                name: 'E',
                description: '5 checker w/ opp middle',
                hidden: true,
                state: [
                    [0, 1, 2],
                    [3, 2, 1],
                ],
            },
        ],
    },
];
