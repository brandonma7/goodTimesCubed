import React, { useState } from 'react';

import Cube from '../../classes/Cube';
import { Color, IndexesToSkip, PuzzleType } from '../../utils/cubingUtils';
import { classNames } from '../../utils/genericUtils';

import './CubeVisualizationComponent.scss';

type CubeVisualizationComponentProps = {
    scramble?: string;
    state?: FaceState;
    puzzleType: PuzzleType;
    width?: number;
    height?: number;
    clickable?: boolean;
};

const numToColor = ['white', 'orange', 'green', 'red', 'blue', 'yellow', 'gray'];
export const scrambleLetterColors = ['white', 'orange', 'green', 'red', 'blue', 'yellow'];

export type FaceState = Color[][];

type SingleFaceVisualizationComponentProps = {
    faceState?: FaceState;
    puzzleType: PuzzleType;
};

export function colorScramble(scramble: string) {
    return (
        <div className='colorful-scramble-container'>
            {scramble.split(' ').map((move, index) => {
                // New color every three letters, wrapping after we get to the end of the color list
                const colorIndex = Math.trunc((index / 3) % scrambleLetterColors.length);
                return (
                    <span key={index} className={`timer__scramble-letter ${scrambleLetterColors[colorIndex]}`}>
                        {move}
                    </span>
                );
            })}
        </div>
    );
}

export default function CubeVisualizationComponent({
    scramble,
    state,
    puzzleType,
    width = 400,
    height = 300,
    clickable = true,
}: CubeVisualizationComponentProps): JSX.Element {
    const [isVisible, setIsVisible] = useState(2);
    // Annoyingly verbose way of checking this to satisfy TS IndexesToSkip check below
    if (
        puzzleType === 'skewb' ||
        puzzleType === 'pyraminx' ||
        puzzleType === 'megaminx' ||
        puzzleType === 'square1' ||
        puzzleType === 'clock'
    ) {
        return <></>;
    }
    const cubeState = scramble != null ? new Cube(scramble, puzzleType).getState() : state;
    if (cubeState == null) {
        return <></>;
    }

    const order = parseInt(puzzleType[0]);
    const isEven = order % 2 === 0;

    const getSticker = (color: number, index: number) => {
        if (isEven && IndexesToSkip[puzzleType].includes(index)) {
            return null;
        }

        const colorClass = `timer__cube-sticker--${numToColor[color]}`;
        return <div key={index} className={`timer__cube-sticker ${colorClass}`} />;
    };
    const fullCube = () => {
        return (
            <div
                className={classNames('timer__cube-pic', `timer__cube-pic--${puzzleType}`, clickable && 'clickable')}
                style={{
                    width,
                    height,
                    minHeight: height,
                }}
                onClick={() => {
                    if (clickable) {
                        setIsVisible(puzzleType !== '3x3x3' ? 0 : 1);
                    }
                }}
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
    };
    const singleFaceState = () => {
        return [
            cubeState[4].slice(0, 3).reverse(),
            cubeState[1].slice(0, 3),
            cubeState[0],
            cubeState[3].slice(0, 3).reverse(),
            cubeState[2].slice(0, 3),
        ];
    };

    switch (isVisible) {
        case 0:
            return (
                <button className='timer__button' onClick={() => setIsVisible(2)}>
                    Show Cube
                </button>
            );
        case 1:
            return puzzleType !== '3x3x3' ? (
                fullCube()
            ) : (
                <div className='clickable' onClick={() => setIsVisible(0)}>
                    <SingleFaceVisualizationComponent faceState={singleFaceState()} puzzleType='3x3x3' />
                </div>
            );
        default:
            return fullCube();
    }
}

export function SingleFaceVisualizationComponent({
    faceState,
    puzzleType,
}: SingleFaceVisualizationComponentProps): JSX.Element {
    // Annoyingly verbose way of checking this to satisfy TS IndexesToSkip check below
    if (
        puzzleType === 'skewb' ||
        puzzleType === 'pyraminx' ||
        puzzleType === 'megaminx' ||
        puzzleType === 'square1' ||
        puzzleType === 'clock' ||
        !faceState
    ) {
        return <></>;
    }
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
            style={{
                width: 90,
                height: 90,
            }}
        >
            <div className='timer__cube-face-row'>
                <div className='timer__cube-face--only column row'></div>
                <div className='timer__cube-face--only row'>{faceState[0].map(getSticker)}</div>
                <div className='timer__cube-face--only column row'></div>
            </div>
            <div className='timer__cube-face-row'>
                <div className='timer__cube-face--only column'>{faceState[1].map(getSticker)}</div>
                <div className='timer__cube-face--only'>{faceState[2].map(getSticker)}</div>
                <div className='timer__cube-face--only column'>{faceState[3].map(getSticker)}</div>
            </div>
            <div className='timer__cube-face-row'>
                <div className='timer__cube-face--only column row'></div>
                <div className='timer__cube-face--only row'>{faceState[4].map(getSticker)}</div>
                <div className='timer__cube-face--only column row'></div>
            </div>
        </div>
    );
}

export function TwoSideVisualizationComponent({ faceState }: SingleFaceVisualizationComponentProps): JSX.Element {
    // Annoyingly verbose way of checking this to satisfy TS IndexesToSkip check below
    if (!faceState) {
        return <></>;
    }
    const getSticker = (color: number, index: number) => {
        const colorClass = `timer__cube-sticker--${numToColor[color]}`;
        return <div key={index} className={`timer__two-side-sticker ${colorClass}`} />;
    };
    return (
        <div className='timer__two-side'>
            <div className='timer__two-side-row'>
                <div className='timer__two-side-face'>{faceState[0].map(getSticker)}</div>
                <div className='timer__two-side-face'>{faceState[1].map(getSticker)}</div>
            </div>
        </div>
    );
}
