import React from 'react';
import { DialogType } from '../../../dialogs/UseDialogsContext';
import { DataType } from '../../../utils/cubingUtils';
import { getFormattedTime, classNames, getFormattedTimeBySolve } from '../../../utils/genericUtils';
import { NormalResultsTableProps } from './NormalResultsTable';

type SplitsTableProps = Omit<NormalResultsTableProps, 'settings'> & {
    numSplits?: number;
    splitNames?: string[];
};

function getSplitsTableHeader(titles: string[]): JSX.Element {
    return (
        <thead>
            <tr>
                <th></th>
                {titles.map((name) => {
                    return <th key={name}>{name}</th>;
                })}
                <th>Total</th>
            </tr>
        </thead>
    );
}

function getEmptyTable(titles: string[]) {
    return (
        <table className='timer__results'>
            {getSplitsTableHeader(titles)}
            <tbody>
                <tr>
                    <td>-</td>
                    {titles.map((name) => {
                        return <th key={name}>-</th>;
                    })}
                    <td>-</td>
                </tr>
            </tbody>
        </table>
    );
}

export function SplitsResultsTable({ results, setDialogData, splitNames = [] }: SplitsTableProps): JSX.Element {
    const { solves, bests } = results;

    return solves?.length ? (
        <table className='timer__results'>
            {getSplitsTableHeader(splitNames)}
            <tbody>
                {solves
                    .slice(0)
                    .reverse()
                    .map((solve, index) => {
                        const tableIndex = solves.length - index - 1;
                        if (solve.splits == null) {
                            return <tr key={index}></tr>;
                        }

                        return (
                            <tr
                                key={index}
                                onClick={() => {
                                    setDialogData({
                                        dialogType: DialogType.SOLVE,
                                        isOpen: true,
                                        index: tableIndex,
                                    });
                                }}
                            >
                                <td>{tableIndex + 1}</td>
                                {solve.splits.map((time, cellIndex) => {
                                    const cellText = getFormattedTime(time);
                                    const isPenalty = solve.isPlusTwo || solve.isDNF;
                                    const isBest = tableIndex === bests[DataType.SINGLE]?.index;

                                    return (
                                        <td
                                            key={cellIndex}
                                            className={classNames(
                                                isPenalty ? 'timer__result--penalty' : '',
                                                isBest ? 'timer__result--best' : '',
                                            )}
                                            onClick={() => {
                                                setDialogData({
                                                    dialogType: DialogType.SOLVE,
                                                    isOpen: true,
                                                    index: tableIndex,
                                                });
                                            }}
                                        >
                                            {cellText}
                                        </td>
                                    );
                                })}
                                <td>{getFormattedTimeBySolve(solve)}</td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    ) : (
        getEmptyTable(splitNames)
    );
}
