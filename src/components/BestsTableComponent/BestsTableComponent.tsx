import React, { useContext, useState } from 'react';
import MultiSolveDetails from '../../dialogs/MultiSolveDetails';
import { SolveSetting, SettingsContext } from '../../dialogs/SettingsView';
import SolveDetails from '../../dialogs/SolveDetails';
import { calculateAverage, calculateMean, DataType, DataTypeToTextMap, Solve } from '../../utils/cubingUtils';
import { getFormattedTime, getFormattedTimeBySolve } from '../../utils/genericUtils';

import { BestsData, SolveData, getBestOfType, SolveDataAction } from '../GoodTimes';
import { SessionData } from '../SessionManagementComponent';

import './BestsTableComponent.scss';

type BestsTableComponentProps = {
    solves: SolveData;
    bests: BestsData;
    sessionData: SessionData;
    sessionId: string;
    solveDispatcher: React.Dispatch<SolveDataAction>;
    onAction: () => void;
};

export function calculateBests(settings: SolveSetting[], solves: Solve[]) {
    const bestsData: BestsData = {
        [DataType.AVERAGE]: [],
        [DataType.MEAN]: [],
    };

    settings.forEach((setting) => {
        const { size, type } = setting;

        if (size > solves.length) {
            return;
        }

        if (type === DataType.AVERAGE) {
            let startIndex = size - 1;
            let best = {
                time: calculateAverage(solves, startIndex, size),
                index: startIndex,
                size,
            };
            while (best.time < 0 && startIndex < solves.length) {
                startIndex++;

                best = {
                    time: calculateMean(solves, startIndex, size),
                    index: startIndex,
                    size,
                };
            }
            startIndex++;
            solves.slice(startIndex).forEach((_, index) => {
                const currentAverage = calculateAverage(solves, startIndex + index, size);
                if ((currentAverage < best.time || best.time <= 0) && currentAverage > 0) {
                    best.time = currentAverage;
                    best.index = startIndex + index;
                }
            });
            bestsData[DataType.AVERAGE].push(best);
        } else if (type === DataType.MEAN) {
            let startIndex = size - 1;
            let best = {
                time: calculateMean(solves, startIndex, size),
                index: startIndex,
                size,
            };
            while (best.time < 0 && startIndex < solves.length) {
                startIndex++;

                best = {
                    time: calculateMean(solves, startIndex, size),
                    index: startIndex,
                    size,
                };
            }
            startIndex++;
            solves.slice(startIndex).forEach((_, index) => {
                const currentAverage = calculateMean(solves, startIndex + index, size);
                if ((currentAverage < best.time || best.time <= 0) && currentAverage > 0) {
                    best.time = currentAverage;
                    best.index = startIndex + index;
                }
            });
            bestsData[DataType.MEAN].push(best);
        } else {
            const indexOfFirstQualifyingTime = solves.findIndex((solve) => {
                return !solve.isDNF;
            });

            if (indexOfFirstQualifyingTime === -1) {
                bestsData[DataType.SINGLE] = undefined;
            } else {
                const best = {
                    time: solves[indexOfFirstQualifyingTime].time,
                    index: indexOfFirstQualifyingTime,
                };
                solves.forEach((solve, index) => {
                    if (index <= indexOfFirstQualifyingTime) {
                        return;
                    }
                    if (!solve.isDNF && solve.time < best.time) {
                        best.time = solve.time;
                        best.index = index;
                    }
                });
                bestsData[DataType.SINGLE] = best;
            }
        }
    });
    return bestsData;
}

export default function BestsTableComponent({
    solves,
    bests,
    sessionData,
    solveDispatcher,
    onAction,
}: BestsTableComponentProps) {
    const { solveSettings: settings, goalSettings } = useContext(SettingsContext);
    const [solveDetailsIndex, setSolveDetails] = useState(-1);
    const [solveDetailsSize, setSolveSize] = useState(1);
    const [isMean, setIsMean] = useState(false);

    const goals = goalSettings.find((goal) => goal.puzzleType === sessionData.type);

    const setSolveDetailsIndex = (value: number, size: number) => {
        setSolveDetails(value === solveDetailsIndex && size === solveDetailsSize ? -1 : value);
        setSolveSize(size ?? 1);
    };

    const rows = settings.map((setting, index) => {
        const { size, type } = setting;
        if (size > solves.length) {
            return;
        }

        const nameCellText = `${DataTypeToTextMap[type]}${size > 1 ? size : ''}`;
        let currentCellText = '';
        let bestCellText = '';
        let goalCellText = '';

        if (type === DataType.AVERAGE) {
            currentCellText = getFormattedTime(calculateAverage(solves, solves.length - 1, size));
            const bestTime = getBestOfType(bests, type, size)?.time ?? -1;
            bestCellText = getFormattedTime(bestTime);
            goalCellText =
                goals?.averageGoal != null || goals?.averageGoal !== 0 ? getFormattedTime(goals?.averageGoal) : '-';
        } else if (type === DataType.MEAN) {
            currentCellText = getFormattedTime(calculateMean(solves, solves.length - 1, size));
            const bestTime = getBestOfType(bests, type, size)?.time ?? -1;
            bestCellText = getFormattedTime(bestTime);
            goalCellText = goals?.meanGoal != null || goals?.meanGoal !== 0 ? getFormattedTime(goals?.meanGoal) : '-';
        } else {
            currentCellText = getFormattedTimeBySolve(solves.at(-1));
            bestCellText = getFormattedTime(bests[DataType.SINGLE]?.time);
            goalCellText =
                goals?.singleGoal != null || goals?.singleGoal !== 0 ? getFormattedTime(goals?.singleGoal) : '-';
        }

        return (
            <tr key={index}>
                <td>{nameCellText}</td>
                <td
                    className='clickable'
                    onClick={() => {
                        if (type === DataType.AVERAGE || type === DataType.MEAN) {
                            setSolveDetailsIndex(solves.length - 1, size);
                            setIsMean(type === DataType.MEAN);
                        } else {
                            setSolveDetailsIndex(solves.length - 1, 1);
                        }
                    }}
                >
                    {currentCellText}
                </td>
                <td
                    className='clickable'
                    onClick={() => {
                        const index = bests[DataType.SINGLE]?.index ?? -1;
                        if (index >= 0) {
                            if (type === DataType.AVERAGE || type === DataType.MEAN) {
                                setSolveDetailsIndex(getBestOfType(bests, type, size)?.index ?? 0, size);
                                setIsMean(type === DataType.MEAN);
                            } else {
                                setSolveDetailsIndex(index, 1);
                            }
                        }
                    }}
                >
                    {bestCellText}
                </td>
                <td>{goalCellText}</td>
            </tr>
        );
    });

    return (
        <>
            <table className='timer__bests'>
                <thead>
                    <tr>
                        <th></th>
                        <th>CURRENT</th>
                        <th>BEST</th>
                        <th>GOAL</th>
                    </tr>
                </thead>
                <tbody>
                    {solves.length ? (
                        rows
                    ) : (
                        <tr>
                            <td>TIME</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {solveDetailsIndex !== -1 && solveDetailsIndex < solves.length && (
                <>
                    {solveDetailsSize === 1 ? (
                        <SolveDetails
                            solve={solves[solveDetailsIndex]}
                            solveIndex={solveDetailsIndex}
                            puzzleType={sessionData.type}
                            sessionType={sessionData.sessionType}
                            solveDispatcher={solveDispatcher}
                            onAction={onAction}
                            close={() => setSolveDetailsIndex(-1, 1)}
                        />
                    ) : (
                        <MultiSolveDetails
                            solves={solves}
                            index={solveDetailsIndex}
                            size={solveDetailsSize}
                            isMean={isMean}
                            close={() => setSolveDetailsIndex(-1, 1)}
                        />
                    )}

                    <button
                        className='timer__button timer__dialog-closer'
                        onClick={() => {
                            setSolveDetailsIndex(-1, 1);
                        }}
                    >
                        Close
                    </button>
                </>
            )}
        </>
    );
}
