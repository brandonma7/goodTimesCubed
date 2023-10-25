import React, { useEffect, useState } from 'react';
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

    const [invertedBestSplitIndexes, setInvertedBestSplitIndexes] = useState<number[]>([]);
    const [bestSplitIndexes, setBestSplitIndexes] = useState<number[]>([]);

    useEffect(() => {
        // This one is called inverted because it's inverted relative to how the table renders
        const invertedBest: number[] =
            (solves.length
                ? solves[0].splits
                      ?.map((_, splitIndex) => {
                          return solves.map((solve) => {
                              return solve.splits ? solve.splits[splitIndex] : 0;
                          });
                      })
                      .map((splitTimes) => {
                          const fastestTime = [...splitTimes].sort((a, b) => a - b)[0];
                          return splitTimes.indexOf(fastestTime);
                      })
                : []) ?? [];
        // The indexes are reversed so it works with the reversed order of the table
        const best = invertedBest.map((index) => solves.length - index - 1);

        setInvertedBestSplitIndexes(invertedBest);
        setBestSplitIndexes(best);
    }, [solves]);

    return solves?.length ? (
        <>
            <table className='timer__results'>
                {getSplitsTableHeader(splitNames)}
                <tbody>
                    <tr>
                        <td></td>
                        {invertedBestSplitIndexes.map((bestIndex, index) => {
                            const splits = solves[bestIndex].splits ?? [];
                            return (
                                <td key={index} style={{ width: 100 }}>
                                    {splits.length ? getFormattedTime(splits[index]) : '--'}
                                </td>
                            );
                        })}
                        <td>
                            {getFormattedTime(
                                invertedBestSplitIndexes.reduce((prev, curr, index) => {
                                    const currSplits = solves[curr].splits ?? [];
                                    return prev + (index > currSplits.length ? 0 : currSplits[index]);
                                }, 0),
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
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
                            const isPenalty = solve.isPlusTwo || solve.isDNF;
                            const isBest = tableIndex === bests[DataType.SINGLE]?.index;

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
                                        const isSplitBest = bestSplitIndexes[cellIndex] === index;

                                        return (
                                            <td
                                                key={cellIndex}
                                                className={classNames(isSplitBest ? 'timer__result--best' : '')}
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
                                    <td
                                        key={index}
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
                                        {getFormattedTimeBySolve(solve)}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </>
    ) : (
        getEmptyTable(splitNames)
    );
}
