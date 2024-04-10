import React, { useContext, useEffect, useState } from 'react';

import CubeVisualizationComponent from '../../components/CubeVisualizationComponent';
import { SolveDataAction } from '../../components/GoodTimes';
import { AlertsContext, MetaDataContext } from '../../TimerApp';
import { PuzzleType, Solve } from '../../utils/cubingUtils';
import { getFormattedTime, unFormatTime } from '../../utils/genericUtils';

import './SolveDetails.scss';
import { SessionType, SessionTypeMap } from '../../components/SessionManagementComponent';
import CasePickerComponent from '../../components/CasePickerComponent';

export type SolveDetailsData = {
    isOpen: boolean;
    index: number;
};

type SolveDetailsProps = {
    solve: Solve;
    solveIndex: number;
    puzzleType: PuzzleType;
    sessionType: SessionType;
    solveDispatcher: React.Dispatch<SolveDataAction>;
    onAction: () => void;
};

export default function SolveDetails({
    solve,
    solveIndex,
    puzzleType,
    sessionType,
    solveDispatcher,
    onAction,
}: SolveDetailsProps): JSX.Element {
    const { isMobile } = useContext(MetaDataContext);

    const [isOllSelectionMode, setIsOllSelectionMode] = useState(false);
    const [isPllSelectionMode, setIsPllSelectionMode] = useState(false);

    const { pushAlert } = useContext(AlertsContext);
    const [solveTimeEntry, setSolveTimeEntry] = useState(getFormattedTime(solve?.time ?? 0, false, true));
    const [isTryingToDelete, setIsTryingToDelete] = useState(false);

    useEffect(() => {
        if (solve?.time != null) {
            setSolveTimeEntry(getFormattedTime(solve.time, false, true));
        }
    }, [solve?.time]);

    if (solve == null) {
        return <></>;
    }

    const { time, scramble, date, isDNF, isPlusTwo, analysisData } = solve;

    const { isOllSkip, isPllSkip, ollCase, pllCase } = analysisData ?? {};

    const dateObject = new Date(date);
    const formattedTime = `${dateObject.getHours()}:${dateObject.getMinutes()}.${dateObject.getSeconds()}`;
    const formattedDate = `${formattedTime} ${
        dateObject.getMonth() + 1
    }/${dateObject.getDate()}/${dateObject.getFullYear()}`;

    return (
        <div>
            <div className='timer__solve-details-inner'>
                <div>Solve #{solveIndex + 1}</div>
                <input
                    type='text'
                    className='timer__solve-details-time'
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
                                        index: solveIndex,
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
                <div className='timer__solve-details-date'>{formattedDate}</div>
                <div className='timer__solve-details-scramble'>{scramble}</div>

                <div className='timer__solve-details-actions'>
                    <button
                        className={isDNF ? 'timer__button timer__button--active' : 'timer__button'}
                        onClick={() => {
                            if (time > 0) {
                                onAction();
                                solveDispatcher({
                                    type: 'SET_DNF',
                                    data: {
                                        index: solveIndex,
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
                                        index: solveIndex,
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

                <div className='timer__solve-details-actions'>
                    <button
                        className={isOllSkip ? 'timer__button timer__button--active' : 'timer__button'}
                        onClick={() => {
                            if (time > 0) {
                                onAction();
                                solveDispatcher({
                                    type: 'SET_OLL_SKIP',
                                    data: {
                                        index: solveIndex,
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
                                        index: solveIndex,
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
                                setIsPllSelectionMode(false);
                                setIsOllSelectionMode(!isOllSelectionMode);
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
                                setIsOllSelectionMode(false);
                                setIsPllSelectionMode(!isPllSelectionMode);
                            } else {
                                pushAlert('To edit this solve, the time must first be valid!');
                            }
                        }}
                    >
                        {pllCase ?? 'PLL'}
                    </button>
                </div>

                <div className='timer__solve-details-case-pickers'>
                    {isOllSelectionMode && (
                        <CasePickerComponent
                            algSet='oll'
                            solve={solve}
                            dispatchSolveData={solveDispatcher}
                            solveIndex={solveIndex}
                        />
                    )}
                    {isPllSelectionMode && (
                        <CasePickerComponent
                            algSet='pll'
                            solve={solve}
                            dispatchSolveData={solveDispatcher}
                            solveIndex={solveIndex}
                        />
                    )}
                </div>
                <CubeVisualizationComponent
                    puzzleType={puzzleType}
                    scramble={scramble}
                    width={isMobile ? 160 : 200}
                    height={isMobile ? 120 : 150}
                />

                <div className='timer__solve-details-actions'>
                    {isTryingToDelete ? (
                        <>
                            <button
                                className='timer__button'
                                onClick={async () => {
                                    setIsTryingToDelete(false);
                                }}
                            >
                                Nevermind!
                            </button>
                            <button
                                className='timer__button'
                                onClick={async () => {
                                    onAction();
                                    // Need to await this for some reason or else the delete doesn't happen :shrug:
                                    await solveDispatcher({
                                        type: 'DELETE_SOLVE',
                                        data: solveIndex,
                                    });
                                    setIsTryingToDelete(false);
                                }}
                            >
                                Confirm Delete
                            </button>
                        </>
                    ) : (
                        <button
                            className='timer__button'
                            onClick={async () => {
                                setIsTryingToDelete(true);
                            }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
