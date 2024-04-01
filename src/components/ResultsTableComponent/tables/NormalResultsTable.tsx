import React from 'react';
import { DialogType, SetDialogDataType } from '../../../dialogs/UseDialogsContext';
import { DataType, DataTypeToTextMap, calculateAverage, calculateMean } from '../../../utils/cubingUtils';
import { getFormattedTime, getFormattedTimeBySolve, classNames } from '../../../utils/genericUtils';
import { getBestOfType } from '../../GoodTimes';
import { SolveSetting } from '../../../dialogs/SettingsDialog';
import { ResultsTableComponentProps } from '../ResultsTableComponent';

export type NormalResultsTableProps = {
    results: ResultsTableComponentProps;
    settings: SolveSetting[];
    setDialogData: SetDialogDataType;
};

export function NormalResultsTable({ results, settings, setDialogData }: NormalResultsTableProps): JSX.Element {
    const { solves, bests } = results;
    const getHeaderString = (type: DataType, size: number) => `${DataTypeToTextMap[type]}${size > 1 ? size : ''}`;

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
                    .slice(0)
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
                                    onClick={() => {
                                        setDialogData({
                                            dialogType: DialogType.SOLVE,
                                            isOpen: true,
                                            index: tableIndex,
                                        });
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

                                        if (type === DataType.AVERAGE) {
                                            const average = calculateAverage(solves, tableIndex, size);
                                            cellText = getFormattedTime(average);
                                            isPenalty = cellText === 'DNF';
                                            const bestIndex = getBestOfType(bests, DataType.AVERAGE, size)?.index;
                                            isBest = bestIndex === tableIndex;
                                        } else if (type === DataType.MEAN) {
                                            const mean = calculateMean(solves, tableIndex, size);
                                            cellText = getFormattedTime(mean);
                                            isPenalty = cellText === 'DNF';
                                            const bestIndex = getBestOfType(bests, DataType.MEAN, size)?.index;
                                            isBest = bestIndex === tableIndex;
                                        } else {
                                            cellText = getFormattedTimeBySolve(solve);
                                            isPenalty = solve.isPlusTwo || solve.isDNF;
                                            isBest = tableIndex === bests[DataType.SINGLE]?.index;
                                        }

                                        return (
                                            <td
                                                key={cellIndex}
                                                className={classNames(
                                                    isPenalty ? 'timer__result--penalty' : '',
                                                    isBest ? 'timer__result--best' : '',
                                                )}
                                                onClick={() => {
                                                    if (
                                                        setting.type === DataType.AVERAGE ||
                                                        setting.type === DataType.MEAN
                                                    ) {
                                                        setDialogData({
                                                            dialogType: DialogType.MULTISOLVE,
                                                            isOpen: true,
                                                            index: tableIndex,
                                                            size: setting.size,
                                                            isMean: setting.type === DataType.MEAN,
                                                        });
                                                    } else {
                                                        setDialogData({
                                                            dialogType: DialogType.SOLVE,
                                                            isOpen: true,
                                                            index: tableIndex,
                                                        });
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
