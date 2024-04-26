import React, { useContext, useState } from 'react';

import { calculateAverageRaw, generateScramble, PuzzleType, PuzzleTypeValues } from '../../utils/cubingUtils';
import { MetaDataContext } from '../../TimerApp';
import { classNames, getFormattedTime } from '../../utils/genericUtils';
import { colorScramble } from '../CubeVisualizationComponent';
import './ManualCompModeComponent.scss';
import { SettingsContext } from '../../dialogs/SettingsView';

export function ManualCompModeComponent({ puzzleType: puzzle = '3x3x3' }: { puzzleType?: PuzzleType }) {
    const { isMobile } = useContext(MetaDataContext);
    const { goalSettings } = useContext(SettingsContext);
    const [puzzleType, setPuzzleType] = useState(puzzle);
    const goalsForPuzzle = goalSettings.find((goal) => goal.puzzleType === puzzleType);
    const defaultAverageGoal = goalsForPuzzle == null ? 1843 : goalsForPuzzle.averageGoal;
    const defaultSingleGoal = goalsForPuzzle == null ? 1569 : goalsForPuzzle.singleGoal;

    const [scrambles, setScrambles] = useState(new Array(5).fill('').map(() => generateScramble(puzzleType)));
    const [times, setTimes] = useState<number[]>(new Array(5).fill(0));
    const [targetAverage, setTargetAverage] = useState(defaultAverageGoal);
    const [targetSingle, setTargetSingle] = useState(defaultSingleGoal);

    const validTimes = times.filter((time) => time > 0);
    const timeToBeat = findTimeToBeatTargetAverage(times, targetAverage - 1);
    const guaranteeBeatTime = findTimeToBeatTargetAverage([...times, 999999], targetAverage - 1);
    const stayInRunningTime = findTimeToBeatTargetAverage(times, targetAverage - 1);

    const getNewScramble = (pt: PuzzleType) => {
        setScrambles(new Array(5).fill('').map(() => generateScramble(pt)));
    };

    const rawAverage = times?.length > 0 ? calculateAverageRaw(times) : 0;
    const worstCaseAverage = calculateAverageRaw([...validTimes, 100000000]);
    const bestCaseAverage = calculateAverageRaw([...validTimes, 1]);
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
            <select
                className='timer__select'
                value={puzzleType}
                onChange={(event) => {
                    const newPuzzle = event.target.value as PuzzleType;
                    setPuzzleType(newPuzzle);
                    setTargetAverage(
                        goalSettings.find((goal) => goal.puzzleType === newPuzzle)?.averageGoal ?? defaultAverageGoal,
                    );
                    setPuzzleType(newPuzzle);
                    setTargetSingle(
                        goalSettings.find((goal) => goal.puzzleType === newPuzzle)?.singleGoal ?? defaultSingleGoal,
                    );
                    getNewScramble(newPuzzle);
                }}
            >
                {PuzzleTypeValues.map((pt, index) => {
                    return (
                        <option key={index} value={pt}>
                            {pt}
                        </option>
                    );
                })}
            </select>
            <div>
                <p>
                    Target Single:
                    <input
                        className='timer__input'
                        type='text'
                        inputMode='decimal'
                        value={targetSingle}
                        onChange={(event) => setTargetSingle(parseInt(event.target.value))}
                    />
                </p>
                <p>
                    Target Average:
                    <input
                        className='timer__input'
                        type='text'
                        inputMode='decimal'
                        value={targetAverage}
                        onChange={(event) => setTargetAverage(parseInt(event.target.value))}
                    />
                </p>
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
                                    <td
                                        className={
                                            times[index] > 10 && times[index] < targetSingle ? 'timer__font--green' : ''
                                        }
                                    >
                                        {index + 1}
                                    </td>
                                    <td>
                                        <input
                                            className={classNames('timer__input', `time-input-${index}`)}
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
                                    {!isMobile && (
                                        <td className={times[index] > 0 ? 'timer__element--transparent' : ''}>
                                            {colorScramble(scramble)}
                                        </td>
                                    )}
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
                <>
                    <div>
                        Guarantee beat average:{' '}
                        {guaranteeBeatTime === null ? 'no' : getFormattedTime(guaranteeBeatTime)}
                    </div>
                    <div>
                        Max to maybe beat average:{' '}
                        {stayInRunningTime === null ? 'no' : getFormattedTime(stayInRunningTime)}
                    </div>
                </>
            )}
            {validTimes.length === 4 && (
                <>
                    <div className={bestCaseAverage > targetAverage ? 'timer__font--red' : ''}>
                        Best Possible Ao5: {getFormattedTime(bestCaseAverage)}
                    </div>
                    <div className={worstCaseAverage < targetAverage ? 'timer__font--green' : ''}>
                        Worst Possible Ao5: {getFormattedTime(worstCaseAverage)}
                    </div>
                    <div>Time to beat target: {timeToBeat === null ? 'no' : getFormattedTime(timeToBeat)}</div>
                </>
            )}
            {validTimes.length === 5 && (
                <div className={rawAverage < targetAverage ? 'timer__font--green' : ''}>
                    Ao5: {getFormattedTime(rawAverage)}
                </div>
            )}
            <div className='manual-comp-mode-actions'>
                <button
                    className='timer__button'
                    onClick={() => {
                        setScrambles(new Array(5).fill('').map(() => generateScramble(puzzleType)));
                        setTimes(new Array(5).fill(0));
                        (document.querySelector('.time-input-0') as HTMLElement)?.focus();
                    }}
                >
                    Reset
                </button>
                <button
                    className='timer__button'
                    onClick={() => {
                        setTimes(new Array(5).fill(0));
                        (document.querySelector('.time-input-0') as HTMLElement)?.focus();
                    }}
                >
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
