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
import { BestsData, getBestOfType, SolveData } from '../../components/Timer';
import { calculateAverage, calculateMean, DataType } from '../../utils/cubingUtils';
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

export default function InsightsDialog({ solves = [], bests }: InsightsDialogProps): JSX.Element {
    const { dialogData, closeDialog } = useContext(DialogContext);
    const { solveSettings } = useContext(SettingsContext);

    if (dialogData?.dialogType !== DialogType.INSIGHTS || !dialogData.isOpen) {
        return <></>;
    }

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
            <ResponsiveContainer height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid stroke='0' />
                    <XAxis dataKey='name' tickLine={false} />
                    <YAxis min={0} max={yAxisMax + 100} tickFormatter={(value) => getFormattedTime(value)} />
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
        </div>
    );
}
