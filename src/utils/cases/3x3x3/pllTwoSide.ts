import { Color } from '../../../classes/Cube';
import { FaceState } from '../../../components/CubeVisualizationComponent';

export type PllTwoSidesType = {
    id: PllTwoSideId;
    name: string;
    state: FaceState;
    patterns: PllTwoSidesPatternType[];
};

type PllTwoSidesPatternType = {
    name: string;
    description: string;
    state: FaceState;
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
// type PllTwoSideId =
//     | 'threeBar'
//     | 'dblHeadlights'
//     | 'lightsTwoBar'
//     | 'loneLights'
//     | 'dblTwoBar'
//     | 'outerTwoBar'
//     | 'innerTwoBar'
//     | 'bookends'
//     | 'noBookends'
//     | 'all';

export const pllTwoSides: PllTwoSidesType[] = [
    {
        id: 'threeBar',
        name: '3-Bar',
        state: [
            [Color.GREEN, Color.GREEN, Color.GREEN],
            [Color.GRAY, Color.GRAY, Color.GRAY],
        ],
        patterns: [
            {
                name: 'Ua',
                description: 'Headlights with adj center',
                state: [
                    [Color.GREEN, Color.GREEN, Color.GREEN],
                    [Color.ORANGE, Color.BLUE, Color.ORANGE],
                ],
            },
            {
                name: 'Ub',
                description: 'Headlights with opp center',
                state: [
                    [Color.GREEN, Color.GREEN, Color.GREEN],
                    [Color.ORANGE, Color.RED, Color.ORANGE],
                ],
            },
            {
                name: 'Ja',
                description: '2-bar attached',
                state: [
                    [Color.GREEN, Color.GREEN, Color.GREEN],
                    [Color.ORANGE, Color.ORANGE, Color.BLUE],
                ],
            },
            {
                name: 'Jb',
                description: '2-bar unattached',
                state: [
                    [Color.GREEN, Color.GREEN, Color.GREEN],
                    [Color.ORANGE, Color.BLUE, Color.BLUE],
                ],
            },
            {
                name: 'F',
                description: '4 colors',
                state: [
                    [Color.GREEN, Color.GREEN, Color.GREEN],
                    [Color.ORANGE, Color.RED, Color.BLUE],
                ],
            },
        ],
    },
    {
        id: 'dblHeadlights',
        name: 'Double Headlights',
        state: [
            [Color.GREEN, Color.GRAY, Color.GREEN],
            [Color.ORANGE, Color.GRAY, Color.ORANGE],
        ],
        patterns: [
            {
                name: 'Z',
                description: '2 color checkerboard',
                state: [
                    [Color.GREEN, Color.ORANGE, Color.GREEN],
                    [Color.ORANGE, Color.GREEN, Color.ORANGE],
                ],
            },
            {
                name: 'Z',
                description: '4 colors, edges adj to corners',
                state: [
                    [Color.GREEN, Color.RED, Color.GREEN],
                    [Color.ORANGE, Color.BLUE, Color.ORANGE],
                ],
            },
            {
                name: 'H',
                description: 'Edges opp to corners',
                state: [
                    [Color.GREEN, Color.BLUE, Color.GREEN],
                    [Color.ORANGE, Color.RED, Color.ORANGE],
                ],
            },
            {
                name: 'Ua',
                description: '2:1 pattern, 3 colors, adj center',
                state: [
                    [Color.GREEN, Color.ORANGE, Color.GREEN],
                    [Color.ORANGE, Color.BLUE, Color.ORANGE],
                ],
            },
            {
                name: 'Ub',
                description: '2:1 pattern, 3 colors, opp center',
                state: [
                    [Color.GREEN, Color.BLUE, Color.GREEN],
                    [Color.ORANGE, Color.GREEN, Color.ORANGE],
                ],
            },
        ],
    },
    {
        id: 'lightsTwoBar',
        name: 'Lights and 2-Bar',
        state: [
            [Color.GREEN, Color.GRAY, Color.GREEN],
            [Color.ORANGE, Color.ORANGE, Color.GRAY],
        ],
        patterns: [
            {
                name: 'T',
                description: 'Inner bar, opp center in headlights',
                state: [
                    [Color.GREEN, Color.BLUE, Color.GREEN],
                    [Color.ORANGE, Color.ORANGE, Color.BLUE],
                ],
            },
            {
                name: 'Rb',
                description: 'Inner bar, adj center in headlights',
                state: [
                    [Color.GREEN, Color.RED, Color.GREEN],
                    [Color.ORANGE, Color.ORANGE, Color.BLUE],
                ],
            },
            {
                name: 'Aa',
                description: 'Outer bar, 4 checkerboard',
                state: [
                    [Color.GREEN, Color.ORANGE, Color.GREEN],
                    [Color.ORANGE, Color.BLUE, Color.BLUE],
                ],
            },
            {
                name: 'Ga',
                description: 'Outer bar, 3 colors',
                state: [
                    [Color.GREEN, Color.RED, Color.GREEN],
                    [Color.ORANGE, Color.BLUE, Color.BLUE],
                ],
            },
        ],
    },
    {
        id: 'loneLights',
        name: 'Lone Lights',
        state: [
            [Color.GREEN, Color.GRAY, Color.GREEN],
            [Color.GRAY, Color.GRAY, Color.GRAY],
        ],
        patterns: [
            {
                name: 'Ra',
                description: '5 Checkboard',
                state: [
                    [Color.GREEN, Color.ORANGE, Color.GREEN],
                    [Color.ORANGE, Color.GREEN, Color.BLUE],
                ],
            },
            {
                name: 'Gc',
                description: '4 Checkboard',
                state: [
                    [Color.GREEN, Color.ORANGE, Color.GREEN],
                    [Color.ORANGE, Color.RED, Color.BLUE],
                ],
            },
            {
                name: 'Gb',
                description: 'Opp center in headlights',
                state: [
                    [Color.GREEN, Color.BLUE, Color.GREEN],
                    [Color.ORANGE, Color.RED, Color.BLUE],
                ],
            },
            {
                name: 'Ab',
                description: 'Adj center in headlights',
                state: [
                    [Color.GREEN, Color.RED, Color.GREEN],
                    [Color.ORANGE, Color.GREEN, Color.BLUE],
                ],
            },
        ],
    },
    {
        id: 'dblTwoBar',
        name: 'Double 2-Bar',
        state: [
            [Color.GREEN, Color.GREEN, Color.GRAY],
            [Color.GRAY, Color.ORANGE, Color.ORANGE],
        ],
        patterns: [
            {
                name: 'Y',
                description: 'Both outer',
                state: [
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                    [Color.RED, Color.ORANGE, Color.ORANGE],
                ],
            },
            {
                name: 'Ab',
                description: 'Both inner and bookends',
                state: [
                    [Color.BLUE, Color.GREEN, Color.GREEN],
                    [Color.ORANGE, Color.ORANGE, Color.BLUE],
                ],
            },
            {
                name: 'V',
                description: 'Both inner and no bookends',
                state: [
                    [Color.BLUE, Color.GREEN, Color.GREEN],
                    [Color.ORANGE, Color.ORANGE, Color.RED],
                ],
            },
            {
                name: 'Ja',
                description: 'Same side and bookends',
                state: [
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                    [Color.RED, Color.RED, Color.BLUE],
                ],
            },
            {
                name: 'Nb',
                description: 'Same side and no bookends',
                state: [
                    [Color.GREEN, Color.RED, Color.GREEN],
                    [Color.ORANGE, Color.GREEN, Color.BLUE],
                ],
            },
        ],
    },
    {
        id: 'outerTwoBar',
        name: 'Outer 2-Bar',
        state: [
            [Color.GREEN, Color.GREEN, Color.GRAY],
            [Color.GRAY, Color.GRAY, Color.GRAY],
        ],
        patterns: [
            {
                name: 'V',
                description: 'No bookends',
                state: [
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                    [Color.RED, Color.BLUE, Color.ORANGE],
                ],
            },
            {
                name: 'Rb',
                description: 'Adj appears twice',
                state: [
                    [Color.GREEN, Color.GREEN, Color.ORANGE],
                    [Color.BLUE, Color.ORANGE, Color.GREEN],
                ],
            },
            {
                name: 'Gd',
                description: 'Opp appears twice',
                state: [
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                    [Color.RED, Color.BLUE, Color.GREEN],
                ],
            },
            {
                name: 'T',
                description: 'Adj by bar and 4 colors',
                state: [
                    [Color.GREEN, Color.GREEN, Color.ORANGE],
                    [Color.BLUE, Color.RED, Color.GREEN],
                ],
            },
            {
                name: 'Aa',
                description: 'Opp by bar and 4 colors',
                state: [
                    [Color.GREEN, Color.GREEN, Color.BLUE],
                    [Color.RED, Color.ORANGE, Color.GREEN],
                ],
            },
        ],
    },
    {
        id: 'innerTwoBar',
        name: 'Inner 2-Bar',
        state: [
            [Color.GRAY, Color.GREEN, Color.GREEN],
            [Color.GRAY, Color.GRAY, Color.GRAY],
        ],
        patterns: [
            {
                name: 'Ga',
                description: 'Adj appears twice',
                state: [
                    [Color.RED, Color.GREEN, Color.GREEN],
                    [Color.ORANGE, Color.BLUE, Color.RED],
                ],
            },
            {
                name: 'Gd',
                description: 'Opp appears twice',
                state: [
                    [Color.BLUE, Color.GREEN, Color.GREEN],
                    [Color.ORANGE, Color.RED, Color.BLUE],
                ],
            },
            {
                name: 'Y',
                description: 'No bookends',
                state: [
                    [Color.BLUE, Color.GREEN, Color.GREEN],
                    [Color.ORANGE, Color.BLUE, Color.RED],
                ],
            },
        ],
    },
    {
        id: 'bookends',
        name: 'Bookends No Bar',
        state: [
            [Color.GREEN, Color.GRAY, Color.GRAY],
            [Color.GRAY, Color.GRAY, Color.GREEN],
        ],
        patterns: [
            {
                name: 'F',
                description: 'Enclosed 4 checker',
                state: [
                    [Color.GREEN, Color.RED, Color.BLUE],
                    [Color.RED, Color.BLUE, Color.GREEN],
                ],
            },
            {
                name: 'Rb',
                description: 'Adj appears twice',
                state: [
                    [Color.GREEN, Color.RED, Color.BLUE],
                    [Color.RED, Color.ORANGE, Color.GREEN],
                ],
            },
            {
                name: 'Gc',
                description: 'Opp appears twice',
                state: [
                    [Color.GREEN, Color.BLUE, Color.ORANGE],
                    [Color.BLUE, Color.RED, Color.GREEN],
                ],
            },
        ],
    },
    {
        id: 'noBookends',
        name: 'No Bookends',
        state: [
            [Color.GREEN, Color.GRAY, Color.GRAY],
            [Color.GRAY, Color.GRAY, Color.ORANGE],
        ],
        patterns: [
            {
                name: 'V',
                description: 'Inner 4 checker',
                state: [
                    [Color.GREEN, Color.RED, Color.BLUE],
                    [Color.RED, Color.BLUE, Color.ORANGE],
                ],
            },
            {
                name: 'Y',
                description: 'Outer 4 checker',
                state: [
                    [Color.GREEN, Color.ORANGE, Color.BLUE],
                    [Color.RED, Color.GREEN, Color.ORANGE],
                ],
            },
            {
                name: 'E',
                description: 'Fuck you',
                state: [
                    [Color.GREEN, Color.RED, Color.BLUE],
                    [Color.RED, Color.GREEN, Color.ORANGE],
                ],
            },
        ],
    },
];
