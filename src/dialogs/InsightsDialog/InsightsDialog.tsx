import React, { useContext } from 'react';
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
import { BestsData, getBestOfType, SolveData } from '../../components/Timer';
import { calculateAverage, calculateMean, DataType, mean, Solve } from '../../utils/cubingUtils';
import { getFormattedTime } from '../../utils/genericUtils';
import { SettingsContext } from '../SettingsDialog';
import { DialogContext, DialogType } from '../UseDialogsContext';

import './InsightsDialog.scss';

export type InsightsDialogData = {
    dialogType: DialogType.INSIGHTS;
    isOpen: boolean;
};

type InsightsDialogProps = {
    solves?: SolveData;
    bests: BestsData;
};

type InsightsDataPoint = {
    [key: string]: {
        timesSeen: number;
        solveTimes: number[];
        splitTimes: number[];
    };
};

export default function InsightsDialog({ solves = [], bests }: InsightsDialogProps): JSX.Element {
    const { dialogData, closeDialog } = useContext(DialogContext);

    if (dialogData?.dialogType !== DialogType.INSIGHTS || !dialogData.isOpen) {
        return <></>;
    }
    return (
        <div
            className='timer__insights-dialog'
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.code === 'Escape') {
                    event.preventDefault();
                    closeDialog();
                }
            }}
        >
            <div>
                <button
                    className='timer__button'
                    onClick={() => {
                        closeDialog();
                    }}
                >
                    Close
                </button>
            </div>
            <SolveDataChart solves={solves} bests={bests} />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexGrow: 1 }}>
                <div>
                    <div>OLL Data</div>
                    <InsightsTable solves={solves} getName={getOllById} caseKey={'ollCase'} />
                </div>
                <div>
                    <div>PLL Data</div>
                    <InsightsTable solves={solves} getName={getPllById} caseKey={'pllCase'} />
                </div>
            </div>
            <RandomDataTable solves={solves} />
        </div>
    );
}

function RandomDataTable({ solves }: { solves: Solve[] }): JSX.Element {
    const timesList = solves.filter((solve) => !solve.isDNF).map((solve) => solve.time);
    const medianIndex = Math.round(timesList.length / 2);
    return (
        <div>
            <div>Total mean: {Math.trunc(mean(timesList)) / 100}</div>
            <div>Total median: {timesList.sort()[medianIndex] / 100}</div>
        </div>
    );
}

function InsightsTable({
    solves,
    getName,
    caseKey,
}: {
    solves: Solve[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getName: (id: string) => any;
    caseKey: 'ollCase' | 'pllCase';
}): JSX.Element {
    const applicableSolves = solves.filter((solve) => solve?.analysisData?.[caseKey] != null);
    const data: InsightsDataPoint = {};
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
        if (solve.splits && solve.splits.length > 2) {
            data[id].splitTimes.push(solve.splits[2] / 100);
        }
    });
    return (
        <table style={{ width: 400 }}>
            <thead>
                <tr>
                    <th style={{ minWidth: 150, textAlign: 'right' }}>Case</th>
                    <th>No. Seen</th>
                    <th>Avg Solve</th>
                    <th>Best Solve</th>
                    <th>Avg Split</th>
                    <th>Best Split</th>
                </tr>
            </thead>
            {Object.keys(data).map((id, index) => {
                const c = data[id];
                return (
                    <tr key={index}>
                        <td style={{ minWidth: 150, textAlign: 'right' }}>{getName(id)?.name ?? 'unknown'}</td>
                        <td>{c.timesSeen}</td>
                        <td>{Math.trunc(mean(c.solveTimes) * 100) / 100}</td>
                        <td>{Math.trunc(Math.min(...c.solveTimes) * 100) / 100}</td>
                        <td>{Math.trunc(mean(c.splitTimes) * 100) / 100}</td>
                        <td>{Math.trunc(Math.min(...c.splitTimes) * 100) / 100}</td>
                    </tr>
                );
            })}
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
                <YAxis min={0} max={yAxisMax + 100} width={100} tickFormatter={(value) => getFormattedTime(value)} />
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
