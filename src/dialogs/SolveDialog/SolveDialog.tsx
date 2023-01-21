import React, { useContext, useEffect, useState } from 'react';

import CubeVisualizationComponent from '../../components/CubeVisualizationComponent';
import { SolveData, SolveDataAction } from '../../components/Timer';
import { AlertsContext } from '../../TimerApp';
import { getFormattedTime, unFormatTime } from '../../utils/genericUtils';
import { DialogContext, DialogType } from '../UseDialogsContext';

import './SolveDialog.scss';

export type SolveDialogData = {
    dialogType: DialogType.SOLVE;
    isOpen: boolean;
    index: number;
};

type SolveDialogProps = {
    solves: SolveData;
    solveDispatcher: React.Dispatch<SolveDataAction>;
    onAction: () => void;
};

export default function SolveDialog({ solves, solveDispatcher, onAction }: SolveDialogProps): JSX.Element {
    const { dialogData: ddata, closeDialog } = useContext(DialogContext);
    // So the component know what specific Dialog Data it's dealing with
    const dialogData = ddata as SolveDialogData;
    const solve = solves[dialogData.index];

    const { pushAlert } = useContext(AlertsContext);
    const [solveTimeEntry, setSolveTimeEntry] = useState(getFormattedTime(solve?.time ?? 0, false, false, true));

    useEffect(() => {
        if (solve?.time != null) {
            setSolveTimeEntry(getFormattedTime(solve.time, false, false, true));
        }
    }, [solve?.time]);

    if (dialogData?.dialogType !== DialogType.SOLVE || !dialogData.isOpen || solve == null) {
        return <></>;
    }

    const { index } = dialogData;
    const { time, scramble, date, isDNF, isPlusTwo } = solve;

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
                <CubeVisualizationComponent scramble={scramble} width={300} />
            </div>
        </div>
    );
}
