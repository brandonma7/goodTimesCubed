import React from 'react';

import Cube from '../../classes/Cube';

import './CubeVisualizationComponent.scss';

type CubeVisualizationComponentProps = {
    scramble: string;
    width?: number;
    height?: number;
};

const numToColor = ['white', 'orange', 'green', 'red', 'blue', 'yellow'];

export default function CubeVisualizationComponent({
    scramble,
    width = 400,
    height,
}: CubeVisualizationComponentProps): JSX.Element {
    const cube = new Cube(scramble);
    const cubeState = cube.getState();

    const getSticker = (color: number, index: number) => {
        const colorClass = `timer__cube-sticker--${numToColor[color]}`;
        return <div key={index} className={`timer__cube-sticker ${colorClass}`} />;
    };

    return (
        <div className='timer__cube-pic' style={{ maxWidth: width, maxHeight: height ?? (width * 3) / 4 }}>
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
