import React, { useState } from 'react';
import { DataType, DataTypeToTextMap, calculateAverage, calculateMean } from '../../../utils/cubingUtils';
import { getFormattedTime, getFormattedTimeBySolve, classNames } from '../../../utils/genericUtils';
import { getBestOfType } from '../../GoodTimes';
import { GoalSettings, SolveSetting } from '../../../dialogs/SettingsView';
import { ResultsTableComponentProps } from '../ResultsTableComponent';

export type NormalResultsTableProps = {
    results: ResultsTableComponentProps;
    settings: SolveSetting[];
    goals?: GoalSettings;
    setSolveDetailsIndex: (value: number, size?: number, isMean?: boolean) => void;
};

export function NormalResultsTable({
    results,
    settings,
    goals,
    setSolveDetailsIndex,
}: NormalResultsTableProps): JSX.Element {
    const { solves, bests } = results;
    const getHeaderString = (type: DataType, size: number) => `${DataTypeToTextMap[type]}${size > 1 ? size : ''}`;
    const [isShortList, setIsShortList] = useState(false);
    // Hardcoding because Ao12, might make a setting later
    const lengthOfShortList = 12;

    return solves?.length ? (
        <table className='timer__results'>
            <thead>
                <tr>
                    <th></th>
                    {settings.map((setting, index) => {
                        if (setting.size <= solves.length) {
                            return <th key={index}>{getHeaderString(setting.type, setting.size)}</th>;
                        }
                    })}
                </tr>
            </thead>
            <tbody>
                {solves
                    .slice(isShortList ? -lengthOfShortList : 0)
                    .reverse()
                    .map((solve, index) => {
                        const tableIndex = solves.length - index - 1;

                        // Less than 3 or 4 is a small enough list to easily see, so only
                        // show group indicators for setting sizes bigger than that
                        const isEndOfSettingGroup =
                            index > 3 && settings.map((setting) => setting.size).includes(index + 1);

                        return (
                            <tr key={index} className={isEndOfSettingGroup ? 'timer__group-indicator' : undefined}>
                                <td
                                    className='clickable'
                                    onClick={() => {
                                        setSolveDetailsIndex(tableIndex);
                                    }}
                                >
                                    {tableIndex + 1}
                                </td>
                                {settings.map((setting, cellIndex) => {
                                    const { type, size } = setting;
                                    // Only show data point if there enough solves to be able to calculate it
                                    if (size <= solves.length) {
                                        let cellText = '';
                                        let isPenalty = false;
                                        let isBest = false;
                                        let beatsGoal = false;

                                        const { singleGoal = 0, averageGoal = 0, meanGoal = 0 } = goals ?? {};

                                        if (type === DataType.AVERAGE) {
                                            const average = calculateAverage(solves, tableIndex, size);
                                            cellText = getFormattedTime(average);
                                            isPenalty = cellText === 'DNF';
                                            const bestIndex = getBestOfType(bests, DataType.AVERAGE, size)?.index;
                                            isBest = bestIndex === tableIndex;
                                            beatsGoal = average < averageGoal;
                                        } else if (type === DataType.MEAN) {
                                            const mean = calculateMean(solves, tableIndex, size);
                                            cellText = getFormattedTime(mean);
                                            isPenalty = cellText === 'DNF';
                                            const bestIndex = getBestOfType(bests, DataType.MEAN, size)?.index;
                                            isBest = bestIndex === tableIndex;
                                            beatsGoal = mean < meanGoal;
                                        } else {
                                            cellText = getFormattedTimeBySolve(solve);
                                            isPenalty = solve.isPlusTwo || solve.isDNF;
                                            isBest = tableIndex === bests[DataType.SINGLE]?.index;
                                            beatsGoal = solve.time < singleGoal;
                                        }

                                        return (
                                            <td
                                                key={cellIndex}
                                                className={classNames(
                                                    'clickable',
                                                    isPenalty && 'timer__result--penalty',
                                                    isBest
                                                        ? 'timer__result--best'
                                                        : beatsGoal && 'timer__result--beats-goal',
                                                )}
                                                onClick={() => {
                                                    if (
                                                        setting.type === DataType.AVERAGE ||
                                                        setting.type === DataType.MEAN
                                                    ) {
                                                        setSolveDetailsIndex(
                                                            tableIndex,
                                                            setting.size,
                                                            setting.type === DataType.MEAN,
                                                        );
                                                    } else {
                                                        setSolveDetailsIndex(tableIndex);
                                                    }
                                                }}
                                            >
                                                {cellText}
                                            </td>
                                        );
                                    }
                                })}
                            </tr>
                        );
                    })}
                {solves.length > lengthOfShortList && (
                    <tr>
                        <td
                            className='clickable'
                            colSpan={settings.length + 1}
                            onClick={() => setIsShortList(!isShortList)}
                            style={{ textAlign: 'center' }}
                        >
                            See {isShortList ? 'More' : 'Less'}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    ) : (
        <table className='timer__results'>
            <thead>
                <tr>
                    <th></th>
                    <th>TIME</th>
                    <th>AO5</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            </tbody>
        </table>
    );
}
