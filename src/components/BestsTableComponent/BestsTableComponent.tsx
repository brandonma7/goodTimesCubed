import React, { useContext } from 'react';
import { SolveSetting, SettingsContext } from '../../dialogs/SettingsDialog';
import { DialogContext, DialogType } from '../../dialogs/UseDialogsContext';
import { calculateAverage, calculateMean, DataType, DataTypeToTextMap, Solve } from '../../utils/cubingUtils';
import { getFormattedTime, getFormattedTimeBySolve } from '../../utils/genericUtils';

import { BestsData, SolveData, getBestOfType } from '../GoodTimes';

import './BestsTableComponent.scss';

type BestsTableComponentProps = {
    solves: SolveData;
    bests: BestsData;
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

export default function BestsTableComponent({ solves, bests }: BestsTableComponentProps) {
    const { openDialog } = useContext(DialogContext);
    const { solveSettings: settings } = useContext(SettingsContext);

    const rows = settings.map((setting, index) => {
        const { size, type } = setting;
        if (size > solves.length) {
            return;
        }

        const nameCellText = `${DataTypeToTextMap[type]}${size > 1 ? size : ''}`;
        let currentCellText = '';
        let bestCellText = '';

        if (type === DataType.AVERAGE) {
            currentCellText = getFormattedTime(calculateAverage(solves, solves.length - 1, size));
            const bestTime = getBestOfType(bests, type, size)?.time ?? -1;
            bestCellText = getFormattedTime(bestTime);
        } else if (type === DataType.MEAN) {
            currentCellText = getFormattedTime(calculateMean(solves, solves.length - 1, size));
            const bestTime = getBestOfType(bests, type, size)?.time ?? -1;
            bestCellText = getFormattedTime(bestTime);
        } else {
            currentCellText = getFormattedTimeBySolve(solves.at(-1));
            bestCellText = getFormattedTime(bests[DataType.SINGLE]?.time);
        }

        return (
            <tr key={index}>
                <td>{nameCellText}</td>
                <td
                    onClick={() => {
                        if (type === DataType.AVERAGE || type === DataType.MEAN) {
                            openDialog({
                                dialogType: DialogType.MULTISOLVE,
                                isOpen: true,
                                index: solves.length - 1,
                                size: size,
                                isMean: type === DataType.MEAN,
                                solves,
                            });
                        } else {
                            /*openDialog({
                                dialogType: DialogType.SOLVE,
                                isOpen: true,
                                index: solves.length - 1,
                            });*/
                        }
                    }}
                >
                    {currentCellText}
                </td>
                <td
                    onClick={() => {
                        const index = bests[DataType.SINGLE]?.index ?? -1;
                        if (index >= 0) {
                            if (type === DataType.AVERAGE || type === DataType.MEAN) {
                                openDialog({
                                    dialogType: DialogType.MULTISOLVE,
                                    isOpen: true,
                                    index: getBestOfType(bests, type, size)?.index ?? 0,
                                    size: size,
                                    isMean: type === DataType.MEAN,
                                    solves,
                                });
                            } else {
                                /* openDialog({
                                    dialogType: DialogType.SOLVE,
                                    isOpen: true,
                                    index,
                                });*/
                            }
                        }
                    }}
                >
                    {bestCellText}
                </td>
            </tr>
        );
    });

    return (
        <table className='timer__bests'>
            <thead>
                <tr>
                    <th></th>
                    <th>CURRENT</th>
                    <th>BEST</th>
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
                    </tr>
                )}
            </tbody>
        </table>
    );
}
