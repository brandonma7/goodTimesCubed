import React, { useContext, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis,
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { getOllById } from '../../components/CasePickerComponent/OllCases';
import { getPllById } from '../../components/CasePickerComponent/PllCases';
import { BestsData, getBestOfType, SolveData } from '../../components/GoodTimes';
import { calculateAverage, calculateMean, DataType, Solve } from '../../utils/cubingUtils';
import { mean, sum, getFormattedTime, valueAtPercentile } from '../../utils/genericUtils';
import { SettingsContext } from '../SettingsDialog';

import './InsightsDialog.scss';

type InsightsDialogProps = {
    solves?: SolveData;
    bests: BestsData;
    isMobile?: boolean;
};

type InsightsDataPoint = {
    [key: string]: {
        timesSeen: number;
        solveTimes: number[];
        splitTimes: number[];
    };
};

export default function InsightsDialog({ solves = [], bests, isMobile = false }: InsightsDialogProps): JSX.Element {
    return (
        <div className='timer__insights-view'>
            {solves.length === 0 ? (
                'No insights for this session, go solve a cube!'
            ) : (
                <>
                    <SolveDataChart solves={solves} bests={bests} />
                    <RandomDataTable solves={solves} />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-around',
                            flexGrow: 1,
                        }}
                    >
                        <div>
                            <div style={{ margin: 16 }}>OLL Data</div>
                            <InsightsTable
                                solves={solves}
                                getCase={getOllById}
                                caseKey={'ollCase'}
                                totalCases={57}
                                isMobile={isMobile}
                            />
                        </div>
                        <div>
                            <div style={{ margin: 16 }}>PLL Data</div>
                            <InsightsTable
                                solves={solves}
                                getCase={getPllById}
                                caseKey={'pllCase'}
                                totalCases={21}
                                isMobile={isMobile}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function RandomDataTable({ solves }: { solves: Solve[] }): JSX.Element {
    const goodSolves = solves.filter((solve) => !solve.isDNF);
    if (goodSolves.length === 0) {
        return <></>;
    }
    const timesList = goodSolves.map((solve) => solve.time).sort();
    const splitsLists = goodSolves.map((solve) => solve.splits ?? []);
    const splitsTableData = splitsLists[0]?.map((_, index) => {
        return splitsLists.map((s) => s[index]).sort((a, b) => a - b);
    });

    return (
        <div>
            <table className='basic-table' style={{ width: '80%' }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Fastest</th>
                        <th>20th %</th>
                        <th>40th %</th>
                        <th>Median</th>
                        <th>60th %</th>
                        <th>80th %</th>
                        <th>Slowest</th>
                        <th>Mean</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Solve</td>
                        <td>{timesList[0] / 100}</td>
                        <td>{valueAtPercentile(0.2, timesList)}</td>
                        <td>{valueAtPercentile(0.4, timesList)}</td>
                        <td>{valueAtPercentile(0.5, timesList)}</td>
                        <td>{valueAtPercentile(0.6, timesList)}</td>
                        <td>{valueAtPercentile(0.8, timesList)}</td>
                        <td>{(timesList.at(-1) ?? 0) / 100}</td>
                        <td>{Math.trunc(mean(timesList)) / 100}</td>
                    </tr>
                    {splitsTableData.map((splitList, index) => {
                        return (
                            <tr key={index}>
                                <td>Split {index + 1}</td>
                                <td>{splitList[0] / 100}</td>
                                <td>{valueAtPercentile(0.2, splitList)}</td>
                                <td>{valueAtPercentile(0.4, splitList)}</td>
                                <td>{valueAtPercentile(0.5, splitList)}</td>
                                <td>{valueAtPercentile(0.6, splitList)}</td>
                                <td>{valueAtPercentile(0.8, splitList)}</td>
                                <td>{(splitList.at(-1) ?? 0) / 100}</td>
                                <td>{Math.trunc(mean(splitList)) / 100}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function InsightsTable({
    solves,
    getCase,
    caseKey,
    totalCases,
    isMobile = false,
}: {
    solves: Solve[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCase: (id: string) => any;
    caseKey: 'ollCase' | 'pllCase';
    totalCases: number;
    isMobile?: boolean;
}): JSX.Element {
    const applicableSolves = solves.filter((solve) => solve?.analysisData?.[caseKey] != null);
    const data: InsightsDataPoint = {};
    const [sortBy, setSortBy] = useState(1);
    if (applicableSolves.length === 0) {
        return <></>;
    }
    const hasSplits = applicableSolves[0].splits && applicableSolves[0].splits.length > 2;

    applicableSolves.forEach((solve) => {
        const id = solve?.analysisData?.[caseKey] ?? 'unknown';
        if (data[id] == null) {
            data[id] = {
                timesSeen: 0,
                solveTimes: [],
                splitTimes: [],
            };
        }
        data[id].timesSeen++;
        data[id].solveTimes.push(solve.time / 100);
        // Same condition as hasSplits, but need to check the specific solve for type safety
        if (solve.splits && solve.splits.length > 2) {
            data[id].splitTimes.push(solve.splits[2] / 100);
        }
    });

    const formatData = (value: number) => Math.trunc(value * 100) / 100;

    const tableData: [string, ...number[]][] = Object.keys(data).map((id) => {
        const c = data[id];
        // This is to add the splits to the dataset conditionally, so we can just hide the whole-ass columns
        const splitSubset = hasSplits ? [formatData(mean(c.splitTimes)), formatData(Math.min(...c.splitTimes))] : [];
        return [
            getCase(id)?.name ?? 'unknown',
            c.timesSeen,
            ...splitSubset,
            formatData(mean(c.solveTimes)),
            formatData(Math.min(...c.solveTimes)),
        ];
    });
    const sortBySetter = (index: number) => () => sortBy === index ? setSortBy(-index) : setSortBy(index);
    // Needs to start at 1 because negative values will denote DESC order, therefore we can't use 0
    let sortByIndex = 1;
    return (
        <table className='basic-table' style={!isMobile ? { width: 400 } : {}}>
            <thead>
                <tr>
                    <th onClick={sortBySetter(sortByIndex++)} style={!isMobile ? { minWidth: 180 } : {}}>
                        Case
                    </th>
                    <th onClick={sortBySetter(sortByIndex++)}>No. Seen</th>
                    {hasSplits && (
                        <>
                            <th onClick={sortBySetter(sortByIndex++)}>Avg Split</th>
                            <th onClick={sortBySetter(sortByIndex++)}>Best Split</th>
                        </>
                    )}
                    <th onClick={sortBySetter(sortByIndex++)}>Avg Solve</th>
                    <th onClick={sortBySetter(sortByIndex++)}>Best Solve</th>
                </tr>
            </thead>
            <tbody>
                {tableData
                    .sort((a, b) => {
                        const aVal = a[Math.abs(sortBy) - 1];
                        const bVal = b[Math.abs(sortBy) - 1];
                        if (typeof aVal === 'number' && typeof bVal === 'number') {
                            return sortBy > 0 ? aVal - bVal : bVal - aVal;
                        }
                        if (typeof aVal === 'string' && typeof bVal === 'string') {
                            return sortBy > 0 ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                        }
                        return 0;
                    })
                    .map((row, index) => {
                        return (
                            <tr key={index}>
                                {row.map((cell, index) => {
                                    return <td key={index}>{cell}</td>;
                                })}
                            </tr>
                        );
                    })}
                <tr>
                    <td>
                        {tableData.length} / {totalCases} {tableData.length === totalCases ? 'Nice!' : ''}
                    </td>
                    <td>{sum(tableData.map((d) => d[1]))}</td>
                    {hasSplits && (
                        <>
                            <td>{formatData(mean(tableData.map((d) => d[2])))}</td>
                            <td>{formatData(Math.min(...tableData.map((d) => d[3])))}</td>
                        </>
                    )}
                    <td>{formatData(mean(tableData.map((d) => d[hasSplits ? 4 : 2])))}</td>
                    <td>{formatData(Math.min(...tableData.map((d) => d[hasSplits ? 5 : 3])))}</td>
                </tr>
            </tbody>
        </table>
    );
}

function SolveDataChart({ solves = [], bests }: InsightsDialogProps): JSX.Element {
    const { solveSettings } = useContext(SettingsContext);
    const lineColors = ['#FFF', '#FFA500', '#5E5', '#F44', '#26F', '#FFFF00'];

    let yAxisMax = 0;

    const chartData = solves.map((solve, solveIndex) => {
        if (solve.time > yAxisMax) {
            yAxisMax = solve.time;
        }
        // eslint-disable-next-line
        const dataPoint = {} as any;

        solveSettings.forEach((setting) => {
            const { type, size } = setting;

            if (type === DataType.AVERAGE) {
                const average = calculateAverage(solves, solveIndex, size);
                dataPoint[`ao${size}`] = average > 0 ? average : undefined;
            } else if (type === DataType.MEAN) {
                const mean = calculateMean(solves, solveIndex, size);
                dataPoint[`mo${size}`] = mean > 0 ? mean : undefined;
            } else {
                dataPoint.single = solve.isDNF ? undefined : solve.time;
            }
        });

        return dataPoint;
    });

    const CustomTooltip = (props: TooltipProps<ValueType, NameType>): JSX.Element => {
        const data = props.payload ?? [{ dataKey: 'error', value: 0 }];
        return (
            <div className='timer__tooltip'>
                {data.map((dataPoint, index) => {
                    return (
                        <div
                            key={index}
                            className='timer__tooltip-label'
                            style={{ color: lineColors[index % lineColors.length] }}
                        >
                            <div className='timer__tooltip-label-key'>{dataPoint.dataKey}</div>
                            <div>{getFormattedTime(dataPoint.value as number)}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <ResponsiveContainer height={300}>
            <LineChart data={chartData}>
                <CartesianGrid stroke='0' />
                <XAxis dataKey='name' tickLine={false} />
                <YAxis min={0} max={yAxisMax + 100} width={60} tickFormatter={(value) => getFormattedTime(value)} />
                <Tooltip content={CustomTooltip} />
                <Legend />
                {solveSettings.map((setting, index) => {
                    const { type, size } = setting;
                    const dataKey =
                        type === DataType.AVERAGE ? `ao${size}` : type === DataType.MEAN ? `mo${size}` : 'single';

                    const best = getBestOfType(bests, type, size);
                    const color = lineColors[index % lineColors.length];
                    return (
                        <React.Fragment key={index}>
                            <ReferenceLine x={best?.index} stroke={color} />
                            <Line type='monotone' dataKey={dataKey} stroke={color} dot={solves.length < 50} />
                        </React.Fragment>
                    );
                })}
            </LineChart>
        </ResponsiveContainer>
    );
}
