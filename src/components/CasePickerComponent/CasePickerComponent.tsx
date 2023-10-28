import React from 'react';
import { Solve } from '../../utils/cubingUtils';
//import { classNames } from '../../utils/genericUtils';

type CasePickerType = 'oll' | 'pll';

type CasePickerComponentProps = {
    solve: Solve;
    type: CasePickerType;
};

/*type BldLetter = 'A' | 'B' | 'C' | 'D';

type Case = {
    id: string;
    name: string;
    order: Turn[] | BldLetter[];
};
type CaseGroup = {
    [id: string]: {
        name: string;
        cases: Case[] | BldLetter[];
    };
};

const pllCases: CaseGroup = {
    //opposite: {},
    adjacent: {
        name: 'Adjacent',
        cases: [
            {
                id: 'tperm',
                name: 'T Perm',
                order: ['A', 'A', 'C', 'D', 'B', 'C', 'D', 'B'],
            },
        ],
    },
};

const ollCases: CaseGroup = {
    //cross: {},
    //lines: {},
    cShapes: {
        name: 'C Shapes',
        cases: [
            {
                id: 'num50',
                name: '#50',
                order: ['U', 'U', 'R', 'R', 'R', 'U', 'U', 'L'],
            },
        ],
    },
    //lShapes: {},
    //fishes: {},
    //wShapes: {},
    //knights: {},
    //cactus: {},
    //dot: {},
};

function drawOll(order: Turn[]) {
    function drawSticker(direction: Turn) {
        switch (direction) {
            case 'U':
                return <div className='timer__cube-sticker yellow' />;
            case 'B':
                return <div className='timer__cube-sticker gray border-top-yellow' />;
            case 'R':
                return <div className='timer__cube-sticker gray border-right-yellow' />;
            case 'F':
                return <div className='timer__cube-sticker gray border-bottom-yellow' />;
            case 'L':
                return <div className='timer__cube-sticker gray border-left-yellow' />;
        }
    }

    return (
        <div>
            <div className='timer__cube-face'>{order.map(drawSticker)}</div>
        </div>
    );
}

const pllStickerDirection = [
    ['border-left-', 'border-top'],
    ['border-top-'],
    ['border-top-', 'border-right'],
    ['border-right-'],
    ['border-right-', 'border-bottom'],
    ['border-bottom-'],
    ['border-bottom-', 'border-left'],
    ['border-left-'],
];

const pllStickerColors = [
    {
        A: ['green', 'red'],
        B: ['red', 'blue'],
        C: ['blue', 'orange'],
        D: ['orange', 'green'],
    },
    {
        A: ['red'],
        B: ['blue'],
        C: ['orange'],
        D: ['green'],
    },
];

function drawPll(order: BldLetter[]) {
    function drawSticker(letter: BldLetter, index: number) {
        const classes = classNames('timer__cube-sticker', 'yellow');
        switch (letter) {
            case 'A':
                return <div key={index} className={classes} />;
            case 'B':
                return <div key={index} className={classes} />;
            case 'C':
                return <div key={index} className={classes} />;
            case 'D':
                return <div key={index} className={classes} />;
        }
    }

    return (
        <div>
            <div className='timer__cube-face'>
                {order.map((letter, index) => {
                    return drawSticker(letter, index);
                })}
                <div className=''></div>
            </div>
        </div>
    );
}*/

export default function CasePickerComponent({ solve, type }: CasePickerComponentProps): JSX.Element {
    return (
        <div>
            solve: {solve.time}, type: {type}
        </div>
    );
}
