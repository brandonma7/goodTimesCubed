import React from 'react';

import Cube from '../../classes/Cube';
import { IndexesToSkip, PuzzleType } from '../../utils/cubingUtils';

import './CubeVisualizationComponent.scss';

type CubeVisualizationComponentProps = {
    scramble: string;
    puzzleType: PuzzleType;
    width?: number;
    height?: number;
};

const numToColor = ['white', 'orange', 'green', 'red', 'blue', 'yellow'];

export default function CubeVisualizationComponent({
    scramble,
    puzzleType,
    width = 400,
    height,
}: CubeVisualizationComponentProps): JSX.Element {
    const cube = new Cube(scramble, puzzleType);
    const cubeState = cube.getState();

    const order = parseInt(puzzleType[0]);
    const isEven = order % 2 === 0;

    const getSticker = (color: number, index: number) => {
        if (isEven && IndexesToSkip[puzzleType].includes(index)) {
            return null;
        }

        const colorClass = `timer__cube-sticker--${numToColor[color]}`;
        return <div key={index} className={`timer__cube-sticker ${colorClass}`} />;
    };

    return (
        <div
            className={`timer__cube-pic timer__cube-pic--${puzzleType}`}
            style={{ maxWidth: width, maxHeight: height ?? (width * 3) / 4 }}
        >
            <div className='timer__cube-pic-row'>
                <div className='timer__cube-face'></div>
                <div className='timer__cube-face'>{cubeState[0].map(getSticker)}</div>
                <div className='timer__cube-face'></div>
                <div className='timer__cube-face'></div>
            </div>
            <div className='timer__cube-pic-row'>
                <div className='timer__cube-face'>{cubeState[1].map(getSticker)}</div>
                <div className='timer__cube-face'>{cubeState[2].map(getSticker)}</div>
                <div className='timer__cube-face'>{cubeState[3].map(getSticker)}</div>
                <div className='timer__cube-face'>{cubeState[4].map(getSticker)}</div>
            </div>
            <div className='timer__cube-pic-row'>
                <div className='timer__cube-face'></div>
                <div className='timer__cube-face'>{cubeState[5].map(getSticker)}</div>
                <div className='timer__cube-face'></div>
                <div className='timer__cube-face'></div>
            </div>
        </div>
    );
}
