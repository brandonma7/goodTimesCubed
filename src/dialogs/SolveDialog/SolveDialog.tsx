import React, { useContext, useEffect, useState } from 'react';

import CubeVisualizationComponent from '../../components/CubeVisualizationComponent';
import { SolveData, SolveDataAction } from '../../components/Timer';
import { AlertsContext } from '../../TimerApp';
import { PuzzleType } from '../../utils/cubingUtils';
import { getFormattedTime, unFormatTime } from '../../utils/genericUtils';
import { DialogContext, DialogType } from '../UseDialogsContext';

import './SolveDialog.scss';
import { SessionType, SessionTypeMap } from '../../components/SessionManagementComponent';

export type SolveDialogData = {
    dialogType: DialogType.SOLVE;
    isOpen: boolean;
    index: number;
};

type SolveDialogProps = {
    solves: SolveData;
    puzzleType: PuzzleType;
    sessionType: SessionType;
    solveDispatcher: React.Dispatch<SolveDataAction>;
    onAction: () => void;
};

export default function SolveDialog({
    solves,
    puzzleType,
    sessionType,
    solveDispatcher,
    onAction,
}: SolveDialogProps): JSX.Element {
    const { dialogData: ddata, closeDialog } = useContext(DialogContext);
    // So the component know what specific Dialog Data it's dealing with
    const dialogData = ddata as SolveDialogData;
    const solve = solves[dialogData.index];

    const { pushAlert } = useContext(AlertsContext);
    const [solveTimeEntry, setSolveTimeEntry] = useState(getFormattedTime(solve?.time ?? 0, false, true));

    useEffect(() => {
        if (solve?.time != null) {
            setSolveTimeEntry(getFormattedTime(solve.time, false, true));
        }
    }, [solve?.time]);

    if (dialogData?.dialogType !== DialogType.SOLVE || !dialogData.isOpen || solve == null) {
        return <></>;
    }

    const { index } = dialogData;
    const { time, scramble, date, isDNF, isPlusTwo, analysisData } = solve;

    const { isOllSkip, isPllSkip, ollCase, pllCase } = analysisData ?? {};

    const dateObject = new Date(date);
    const formattedTime = `${dateObject.getHours()}:${dateObject.getMinutes()}.${dateObject.getSeconds()}`;
    const formattedDate = `${formattedTime} ${
        dateObject.getMonth() + 1
    }/${dateObject.getDate()}/${dateObject.getFullYear()}`;

    return (
        <div
            className='timer__solve-dialog'
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.code === 'Escape') {
                    event.preventDefault();
                    closeDialog();
                }
            }}
        >
            <div className='timer__solve-dialog-inner'>
                <div>Solve #{index + 1}</div>
                <input
                    type='text'
                    className='timer__solve-dialog-time'
                    value={solveTimeEntry}
                    onChange={(event) => {
                        setSolveTimeEntry(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            const newTime = unFormatTime(solveTimeEntry);

                            if (newTime > 0) {
                                onAction();
                                solveDispatcher({
                                    type: 'SET_TIME',
                                    data: {
                                        index,
                                        time: newTime,
                                    },
                                });
                            } else {
                                pushAlert('Invalid time, get your shit together!');
                            }
                        }
                    }}
                />
                {(solve.splits?.length ?? 1) > 1 && (
                    <table className='timer__results'>
                        <thead>
                            <tr>
                                {SessionTypeMap[sessionType].splitNames?.map((name) => {
                                    return <th key={name}>{name}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {solve.splits?.map((split, index) => {
                                    return <td key={index}>{getFormattedTime(split)}</td>;
                                })}
                            </tr>
                        </tbody>
                    </table>
                )}
                <div>{scramble}</div>
                <div className='timer__solve-dialog-date'>{formattedDate}</div>

                <div className='timer__solve-dialog-actions'>
                    <button
                        className={isDNF ? 'timer__button timer__button--active' : 'timer__button'}
                        onClick={() => {
                            if (time > 0) {
                                onAction();
                                solveDispatcher({
                                    type: 'SET_DNF',
                                    data: {
                                        index,
                                        value: !isDNF,
                                    },
                                });
                            } else {
                                pushAlert('To edit this solve, the time must first be valid!');
                            }
                        }}
                    >
                        DNF
                    </button>
                    <button
                        className={isPlusTwo ? 'timer__button timer__button--active' : 'timer__button'}
                        onClick={() => {
                            if (time > 0) {
                                onAction();
                                solveDispatcher({
                                    type: 'SET_PLUS_TWO',
                                    data: {
                                        index,
                                        value: !isPlusTwo,
                                    },
                                });
                            } else {
                                pushAlert('To edit this solve, the time must first be valid!');
                            }
                        }}
                    >
                        +2
                    </button>
                </div>

                <div className='timer__solve-dialog-actions'>
                    <button
                        className={isOllSkip ? 'timer__button timer__button--active' : 'timer__button'}
                        onClick={() => {
                            if (time > 0) {
                                onAction();
                                solveDispatcher({
                                    type: 'SET_OLL_SKIP',
                                    data: {
                                        index,
                                        value: !isOllSkip,
                                    },
                                });
                            } else {
                                pushAlert('To edit this solve, the time must first be valid!');
                            }
                        }}
                    >
                        OLL Skip?
                    </button>
                    <button
                        className={isPllSkip ? 'timer__button timer__button--active' : 'timer__button'}
                        onClick={() => {
                            if (time > 0) {
                                onAction();
                                solveDispatcher({
                                    type: 'SET_PLL_SKIP',
                                    data: {
                                        index,
                                        value: !isPllSkip,
                                    },
                                });
                            } else {
                                pushAlert('To edit this solve, the time must first be valid!');
                            }
                        }}
                    >
                        PLL Skip?
                    </button>
                    <button
                        className={ollCase ? 'timer__button timer__button--active' : 'timer__button'}
                        onClick={() => {
                            if (time > 0) {
                                console.log('open oll picker');
                            } else {
                                pushAlert('To edit this solve, the time must first be valid!');
                            }
                        }}
                    >
                        {ollCase ?? 'OLL'}
                    </button>
                    <button
                        className={pllCase ? 'timer__button timer__button--active' : 'timer__button'}
                        onClick={() => {
                            if (time > 0) {
                                console.log('open pll picker');
                            } else {
                                pushAlert('To edit this solve, the time must first be valid!');
                            }
                        }}
                    >
                        {pllCase ?? 'PLL'}
                    </button>
                </div>

                <div className='timer__solve-dialog-actions'>
                    <button
                        className='timer__button'
                        onClick={() => {
                            closeDialog();
                        }}
                    >
                        Close
                    </button>
                    <button
                        className='timer__button'
                        onClick={async () => {
                            onAction();
                            // Need to await this for some reason or else the delete doesn't happen :shrug:
                            await solveDispatcher({
                                type: 'DELETE_SOLVE',
                                data: index,
                            });
                            closeDialog();
                        }}
                    >
                        Delete
                    </button>
                </div>
                <CubeVisualizationComponent puzzleType={puzzleType} scramble={scramble} width={300} />
            </div>
        </div>
    );
}
