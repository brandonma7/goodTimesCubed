import React, { useEffect, useState } from 'react';
import { DialogType } from '../../../dialogs/UseDialogsContext';
import { DataType } from '../../../utils/cubingUtils';
import { getFormattedTime, classNames, getFormattedTimeBySolve } from '../../../utils/genericUtils';
import { getOllById } from '../../CasePickerComponent/OllCases';
import { getPllById } from '../../CasePickerComponent/PllCases';
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
    const isCfop = splitNames.includes('PLL');

    const [invertedBestSplitIndexes, setInvertedBestSplitIndexes] = useState<number[]>([]);
    const [bestSplitIndexes, setBestSplitIndexes] = useState<number[]>([]);

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
                                return <></>;
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
                            <td>
                                {getOllById(solves[invertedBestSplitIndexes[2]]?.analysisData?.ollCase)?.name ?? '--'}
                            </td>
                            <td>
                                {getPllById(solves[invertedBestSplitIndexes[3]]?.analysisData?.pllCase)?.name ?? '--'}
                            </td>
                        </tr>
                    )}
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
                                    {solve.splits.map((time, cellIndex, list) => {
                                        const cellText = getFormattedTime(time);
                                        const isSplitBest = bestSplitIndexes[cellIndex] === index;
                                        const isSkip =
                                            // Making the assumption that pll is the last step and oll is the second to last step
                                            (solve.analysisData?.isOllSkip && cellIndex === list.length - 2) ||
                                            (solve.analysisData?.isPllSkip && cellIndex === list.length - 1);

                                        return (
                                            <td
                                                key={cellIndex}
                                                className={classNames(
                                                    isSplitBest ? 'timer__result--best' : '',
                                                    isSkip ? 'timer__result--skip' : '',
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
