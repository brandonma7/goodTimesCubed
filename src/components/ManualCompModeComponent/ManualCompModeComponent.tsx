import React, { useContext, useState } from 'react';

import { calculateAverageRaw, generateScramble, PuzzleType } from '../../utils/cubingUtils';
import { MetaDataContext } from '../../TimerApp';
import { getFormattedTime } from '../../utils/genericUtils';
import { colorScramble } from '../CubeVisualizationComponent';
import './ManualCompModeComponent.scss';

export function ManualCompModeComponent({ puzzleType = '3x3x3' }: { puzzleType?: PuzzleType }) {
    const { isMobile } = useContext(MetaDataContext);
    const [scrambles, setScrambles] = useState(new Array(5).fill('').map(() => generateScramble(puzzleType)));
    const [times, setTimes] = useState<number[]>(new Array(5).fill(0));
    const [targetAverage, setTargetAverage] = useState(1843);

    const validTimes = times.filter((time) => time > 0);
    const timeToBeat = findTimeToBeatTargetAverage(times, targetAverage);

    return (
        <div
            className='manual-comp-mode'
            style={{
                width: isMobile ? '90%' : '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: '0 auto',
            }}
        >
            <div>
                Target Average:
                <input
                    className='timer__input'
                    type='text'
                    inputMode='decimal'
                    value={targetAverage}
                    onChange={(event) => setTargetAverage(parseInt(event.target.value))}
                />
            </div>
            <table className='basic-table'>
                <thead>
                    <tr>
                        <th>Solve</th>
                        <th>Time</th>
                        {!isMobile && <th>Scramble</th>}
                    </tr>
                </thead>
                <tbody>
                    {scrambles.map((scramble, index) => {
                        return (
                            <React.Fragment key={index}>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input
                                            className='timer__input'
                                            type='text'
                                            inputMode='decimal'
                                            value={times[index]}
                                            onChange={(event) => {
                                                const timesCopy = times.map((t) => t);
                                                const intValue = parseInt(event.target.value);
                                                const newValue = isNaN(intValue) ? 0 : intValue;
                                                timesCopy[index] = newValue;
                                                setTimes(timesCopy);
                                            }}
                                        />
                                    </td>
                                    {!isMobile && <td>{colorScramble(scramble)}</td>}
                                </tr>
                                {isMobile && (
                                    <tr>
                                        <td></td>
                                        <td style={{ display: 'flex', flexWrap: 'wrap' }}>{colorScramble(scramble)}</td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            {validTimes.length === 3 && (
                <div>
                    Beat target with:{' '}
                    {timeToBeat === null ? 'no' : findTimeToBeatTargetAverage([...times, 999999], targetAverage)}
                </div>
            )}
            {validTimes.length === 4 && (
                <>
                    <div>Best Possible Ao5: {getFormattedTime(calculateAverageRaw([...validTimes, 1]))}</div>
                    <div>Worst Possible Ao5: {getFormattedTime(calculateAverageRaw([...validTimes, 100000000]))}</div>
                    <div>Time to beat target: {timeToBeat === null ? 'no' : getFormattedTime(timeToBeat)}</div>
                </>
            )}
            {validTimes.length === 5 && <div>Ao5: {getFormattedTime(calculateAverageRaw(times))}</div>}
            <div className='manual-comp-mode-actions'>
                <button
                    className='timer__button'
                    onClick={() => {
                        setScrambles(new Array(5).fill('').map(() => generateScramble(puzzleType)));
                        setTimes(new Array(5).fill(0));
                    }}
                >
                    Reset
                </button>
                <button className='timer__button' onClick={() => setTimes(new Array(5).fill(0))}>
                    Reset Times Only
                </button>
            </div>
        </div>
    );
}

function findTimeToBeatTargetAverage(times: number[], targetAverage: number): number | null {
    const validTimes = times.filter((time) => time > 0);
    if (validTimes.length !== 4 && validTimes.length !== 3) {
        return null;
    }
    validTimes.sort((a, b) => a - b);

    if (validTimes.length === 3) {
        return 3 * targetAverage - validTimes[0] - validTimes[1];
    } else {
        const bestPossible = calculateAverageRaw([...validTimes, 1]);
        if (bestPossible > targetAverage) {
            return null;
        }

        return 3 * targetAverage - validTimes[1] - validTimes[2];
    }
}
