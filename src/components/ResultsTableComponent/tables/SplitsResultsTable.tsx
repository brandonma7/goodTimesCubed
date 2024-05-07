import React, { useEffect, useState } from 'react';
import { DataType } from '../../../utils/cubingUtils';
import { getFormattedTime, classNames, getFormattedTimeBySolve } from '../../../utils/genericUtils';
import { getOllById } from '../../../utils/cases/3x3x3/oll';
import { getPllById } from '../../../utils/cases/3x3x3/pll';
import { NormalResultsTableProps } from './NormalResultsTable';

type SplitsTableProps = Omit<NormalResultsTableProps, 'settings'> & {
    numSplits?: number;
    splitNames?: string[];
};

function getSplitsTableHeader(titles: string[], onHeaderCellClick?: (index: number) => void): JSX.Element {
    return (
        <thead>
            <tr>
                <th onClick={() => onHeaderCellClick && onHeaderCellClick(-1)}></th>
                {titles.map((name, index) => {
                    return (
                        <th key={name} onClick={() => onHeaderCellClick && onHeaderCellClick(index)}>
                            {name}
                        </th>
                    );
                })}
                <th onClick={() => onHeaderCellClick && onHeaderCellClick(titles.length)}>Total</th>
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

export function SplitsResultsTable({ results, splitNames = [], setSolveDetailsIndex }: SplitsTableProps): JSX.Element {
    const { solves, bests } = results;
    const isCfop = splitNames.includes('Cross');
    const [columnIndexSort, setColumnIndexSort] = useState(-1);
    const [isAscending, setIsAscending] = useState(true);

    const [invertedBestSplitIndexes, setInvertedBestSplitIndexes] = useState<number[]>([]);
    const [bestSplitIndexes, setBestSplitIndexes] = useState<number[]>([]);
    const [isShortList, setIsShortList] = useState(false);
    // Hardcoding because Ao12, might make a setting later
    const lengthOfShortList = 12;

    const sortedSolves = solves.slice(isShortList ? -lengthOfShortList : 0);

    if (columnIndexSort >= 0) {
        sortedSolves.sort((a, b) => {
            if (columnIndexSort >= (a?.splits?.length ?? 999)) {
                const aValue = a.time;
                const bValue = b.time;
                if (isAscending) {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            }
            const aValue = a.splits == null ? 0 : a.splits[columnIndexSort];
            const bValue = b.splits == null ? 0 : b.splits[columnIndexSort];
            if (isAscending) {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    } else {
        if (isAscending) {
            sortedSolves.reverse();
        }
    }

    const onHeaderCellClick = (index: number) => {
        if (index === columnIndexSort) {
            setIsAscending(!isAscending);
        } else {
            setColumnIndexSort(index);
            setIsAscending(true);
        }
    };

    useEffect(() => {
        // This one is called inverted because it's inverted relative to how the table renders
        const invertedBest: number[] =
            (solves.length
                ? solves[0].splits
                      // Put all times for all solves for a particular split, return an array of each step
                      ?.map((_, splitIndex) => {
                          return solves.map((solve) => {
                              if (!solve.splits) {
                                  return -1;
                              }
                              // Making the assumption that pll is the last step and oll is the second to last step
                              if (solve.analysisData?.isOllSkip && splitIndex === solve.splits.length - 2) {
                                  return -1;
                              }
                              if (solve.analysisData?.isPllSkip && splitIndex === solve.splits.length - 1) {
                                  return -1;
                              }
                              return solve.splits[splitIndex];
                          });
                      })
                      // Reduce that array of arrays to just a single array that has the best indexes
                      .map((splitTimes) => {
                          const fastestTime = [...splitTimes].sort((a, b) => a - b).find((time) => time > 0) ?? 0;
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
                            if (bestIndex >= solves.length) {
                                return <React.Fragment key={index}></React.Fragment>;
                            }
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
                                    if (curr >= solves.length) {
                                        return 0;
                                    }
                                    const currSplits = solves[curr].splits ?? [];
                                    return prev + (index > currSplits.length ? 0 : currSplits[index]);
                                }, 0),
                            )}
                        </td>
                    </tr>
                    {isCfop && (
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{getOllById(solves[invertedBestSplitIndexes[2]]?.analysisData?.oll)?.name ?? '--'}</td>
                            <td>{getPllById(solves[invertedBestSplitIndexes[3]]?.analysisData?.pll)?.name ?? '--'}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <table className='timer__results'>
                {getSplitsTableHeader(splitNames, onHeaderCellClick)}
                <tbody>
                    {sortedSolves.map((solve, index) => {
                        const tableIndex = isAscending
                            ? solves.length - index - 1
                            : index + solves.length - sortedSolves.length;
                        if (solve.splits == null) {
                            return <tr key={index}></tr>;
                        }
                        const isPenalty = solve.isPlusTwo || solve.isDNF;
                        const isBest = tableIndex === bests[DataType.SINGLE]?.index;

                        return (
                            <tr
                                key={index}
                                onClick={() => {
                                    if (columnIndexSort === -1) {
                                        setSolveDetailsIndex(tableIndex);
                                    }
                                }}
                            >
                                <td className={classNames(columnIndexSort === -1 && 'clickable')}>{tableIndex + 1}</td>
                                {solve.splits.map((time, cellIndex, list) => {
                                    const cellText = getFormattedTime(time);
                                    const isSplitBest = bestSplitIndexes[cellIndex] === index;
                                    const isSkip: boolean =
                                        // Making the assumption that pll is the last step and oll is the second to last step
                                        ((solve.analysisData?.isOllSkip && cellIndex === list.length - 2) ||
                                            (solve.analysisData?.isPllSkip && cellIndex === list.length - 1)) ??
                                        false;

                                    return (
                                        <td
                                            key={cellIndex}
                                            className={classNames(
                                                columnIndexSort === -1 && 'clickable',
                                                isSplitBest && 'timer__result--best',
                                                isSkip && 'timer__result--skip',
                                            )}
                                        >
                                            {cellText}
                                        </td>
                                    );
                                })}
                                <td
                                    key={index}
                                    className={classNames(
                                        columnIndexSort === -1 && 'clickable',
                                        isPenalty && 'timer__result--penalty',
                                        isBest && 'timer__result--best',
                                    )}
                                >
                                    {getFormattedTimeBySolve(solve)}
                                </td>
                            </tr>
                        );
                    })}

                    {solves.length > lengthOfShortList && (
                        <tr>
                            <td
                                className='clickable'
                                colSpan={splitNames.length + 2}
                                onClick={() => setIsShortList(!isShortList)}
                                style={{ textAlign: 'center' }}
                            >
                                See {isShortList ? 'More' : 'Less'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    ) : (
        getEmptyTable(splitNames)
    );
}
