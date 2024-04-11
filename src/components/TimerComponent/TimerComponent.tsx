import React, { useContext, memo, useRef, useState, useEffect } from 'react';

import { SolveDataAction } from '../GoodTimes';
import CubeVisualizationComponent, { SingleFaceVisualizationComponent } from '../CubeVisualizationComponent';

import { classNames, getFormattedTime, unFormatTime } from '../../utils/genericUtils';
import { SettingsContext } from '../../dialogs/SettingsView';

import './TimerComponent.scss';
import {
    PuzzleType,
    PuzzleTypeMoveCount,
    Solve,
    NonStandardPuzzles,
    calculateAverageRaw,
} from '../../utils/cubingUtils';
import { MetaDataContext } from '../../TimerApp';
import CasePickerComponent from '../CasePickerComponent';
import { getPllById } from '../CasePickerComponent/PllCases';
import { getOllById } from '../CasePickerComponent/OllCases';

enum CompModeStep {
    SCRAMBLE,
    INSPECTION,
    SOLVE,
    RESULTS,
}

type CompSolve = {
    time: number;
    penalty: number;
    dnf: boolean;
};

type TimerComponentProps = {
    dispatchSolveData: React.Dispatch<SolveDataAction>;
    puzzleType: PuzzleType;
    scramble: string;
    newScramble: () => void;
    numSplits?: number;
    timerComponentRef: React.RefObject<HTMLDivElement>;
    mostRecentSolve?: Solve;
    mostRecentSolveIndex?: number;
    compMode?: boolean;
};

const TimerComponent = memo(function TimerComponentInternal({
    dispatchSolveData,
    puzzleType,
    scramble,
    newScramble,
    numSplits = 1,
    timerComponentRef,
    mostRecentSolve,
    mostRecentSolveIndex = 0,
    compMode = false,
}: TimerComponentProps) {
    const { isManualEntryMode, setIsManualEntryMode } = useContext(SettingsContext);
    const { isMobile, setTimerIsRunning } = useContext(MetaDataContext);
    const [timerEntry, setTimerEntry] = useState(isManualEntryMode ? '' : '0.00');
    const [isPrepping, setIsPrepping] = useState(false);
    const [isPrepped, setIsPrepped] = useState(false);
    const [splitTimes, setSplitTimes] = useState<number[]>([]);
    const [currentEntry, setCurrentEntry] = useState<Solve>();
    const [isOllSelectionMode, setIsOllSelectionMode] = useState(false);
    const [isPllSelectionMode, setIsPllSelectionMode] = useState(false);
    const [compModeStep, setCompModeStep] = useState<CompModeStep>(CompModeStep.SCRAMBLE);
    const [compModeTimes, setCompModeTimes] = useState<CompSolve[]>([]);
    const [currentCompModePenalty, setCurrentCompModePenalty] = useState(0);

    const isTimerReady = useRef(false);
    const spaceKeyIsDown = useRef(false);
    const timerIsRunning = useRef(false);

    const elapsed = useRef(0.0);

    const isTimerReadyTimeoutRef = useRef<NodeJS.Timeout>();
    const timerTimeoutRef = useRef<NodeJS.Timeout>();

    const scrambleRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimerEntry(isManualEntryMode ? '' : '0.00');
    }, [isManualEntryMode]);

    function startPreppingTimer(isDNF = false) {
        if (timerIsRunning.current) {
            const baseTime = elapsed.current / 10;
            const timeSinceLast = baseTime - (splitTimes.at(-1) ?? 0);
            // Quit out if buffer time hasn't elapsed to avoid double key presses
            if (timeSinceLast < 20) {
                return;
            }
            // Timer is running, so either need to stop or record a split
            if (splitTimes.length < numSplits - 1 && !isDNF) {
                // Record split
                setSplitTimes([...splitTimes, baseTime]);
            } else {
                timerIsRunning.current = false;
                setTimerIsRunning(false);
                clearTimeout(timerTimeoutRef.current);

                const baseTime = elapsed.current / 10;
                const formattedBaseTime = getFormattedTime(baseTime);
                setTimerEntry(`${formattedBaseTime}`);

                const splits = isDNF
                    ? new Array(numSplits).fill(0)
                    : [...splitTimes, baseTime]
                          .reverse()
                          // Right now the times are timestamps, we want the elapsed time for a specific step
                          .map((split, index, list) => {
                              if (index === list.length - 1) {
                                  return split;
                              }
                              return split - list[index + 1];
                          })
                          .reverse();

                const timeEntry: Solve = {
                    isDNF,
                    isPlusTwo: false,
                    scramble,
                    date: new Date(),
                    time: baseTime,
                    splits,
                    analysisData: {},
                };
                setCurrentEntry(timeEntry);

                if (compMode) {
                    compModeTimes.push({
                        time: baseTime,
                        penalty: Math.max(currentCompModePenalty, 0),
                        dnf: isDNF,
                    });
                } else {
                    dispatchSolveData({
                        type: 'ADD_SOLVE',
                        data: timeEntry,
                    });
                }

                newScramble();
                setSplitTimes([]);
            }
        } else {
            // Timer is not running, so start the prepping period
            if (!spaceKeyIsDown.current) {
                spaceKeyIsDown.current = true;
                elapsed.current = 0.0;
                setTimerEntry('0.00');
                setIsPrepping(true);

                isTimerReadyTimeoutRef.current = setTimeout(() => {
                    setIsPrepping(false);
                    setIsPrepped(true);
                    isTimerReady.current = true;
                }, 800);
            }
        }
    }

    function startTimer() {
        spaceKeyIsDown.current = false;
        // The prepping time has fully passed, so start the timer!
        if (isTimerReady.current) {
            setIsPrepping(false);
            setIsPrepped(false);
            timerIsRunning.current = true;
            setTimerIsRunning(true);
            isTimerReady.current = false;

            const interval = 10; // ms
            let expected = Date.now() + interval;
            const step = () => {
                const dt = Date.now() - expected; // the drift (positive for overshooting)
                if (dt > interval) {
                    console.log('oof');
                }

                elapsed.current += interval;
                setTimerEntry(getFormattedTime(elapsed.current / 10));

                expected += interval;
                timerTimeoutRef.current = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
            };
            timerTimeoutRef.current = setTimeout(step, interval);
        } else {
            // The prepping time hasn't passed when the user lifted off the keyboard/screen, so abort
            clearTimeout(isTimerReadyTimeoutRef.current);
            setIsPrepping(false);
            setIsPrepped(false);
        }
    }

    function startInspectionTimer() {
        const interval = 10; // ms
        let expected = Date.now() + interval;
        const step = () => {
            const dt = Date.now() - expected; // the drift (positive for overshooting)
            if (dt > interval) {
                console.log('oof');
            }

            elapsed.current += interval;
            setTimerEntry(getFormattedTime(elapsed.current / 10));

            expected += interval;
            timerTimeoutRef.current = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
            if (elapsed.current > 17000) {
                clearTimeout(timerTimeoutRef.current);
                compModeTimes.push({
                    time: -1,
                    penalty: 0,
                    dnf: true,
                });
                elapsed.current = 0;
                setCompModeStep(CompModeStep.RESULTS);
            } else if (elapsed.current > 15000) {
                setCurrentCompModePenalty(2);
            }
        };
        timerTimeoutRef.current = setTimeout(step, interval);
    }

    // Arbitrary font sizes for shortest move count and longest that I thought looked good
    const fontSizeFor2x2 = 32;
    const fontSizeFor7x7 = 16;
    // Over-engineered way to figure out what everything in bewteen should be lol
    const slope = (fontSizeFor2x2 - fontSizeFor7x7) / (PuzzleTypeMoveCount['2x2x2'] - PuzzleTypeMoveCount['7x7x7']);
    const yIntercept = fontSizeFor2x2 - slope * PuzzleTypeMoveCount['2x2x2'];
    const scrambleFontSize = slope * PuzzleTypeMoveCount[puzzleType] + yIntercept;
    const scrambleLetterColors = ['white', 'orange', 'green', 'red', 'blue', 'yellow'];
    // This is always true, but keeping it here in case I decide to control this via settings
    const showScrambleColors = true;

    if (compMode) {
        switch (compModeStep) {
            case CompModeStep.SCRAMBLE:
                return (
                    <div
                        className='timer__comp-mode'
                        ref={timerComponentRef}
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.code === 'Space') {
                                event.preventDefault();
                                elapsed.current = 0;
                                startInspectionTimer();
                                setCompModeStep(CompModeStep.INSPECTION);
                            }
                        }}
                    >
                        {scramble.split(' ').map((move, index) => {
                            // New color every three letters, wrapping after we get to the end of the color list
                            const colorIndex = Math.trunc((index / 3) % scrambleLetterColors.length);
                            return (
                                <span
                                    key={index}
                                    className={`timer_scramble-letter ${scrambleLetterColors[colorIndex]}`}
                                >
                                    {move}
                                </span>
                            );
                        })}
                    </div>
                );
            case CompModeStep.INSPECTION:
                return (
                    <div
                        className={classNames(
                            'timer__comp-mode',
                            elapsed.current < 7000 ? 'inspection--start' : '',
                            elapsed.current >= 7000 && elapsed.current < 12000 ? 'inspection--seven' : '',
                            elapsed.current >= 12000 ? 'inspection--twelve' : '',
                        )}
                        ref={timerComponentRef}
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.code === 'Space') {
                                event.preventDefault();
                                isTimerReady.current = true;
                                elapsed.current = 0;
                                clearTimeout(timerTimeoutRef.current);
                                startTimer();
                                setCompModeStep(CompModeStep.SOLVE);
                            }
                        }}
                    >
                        <p>Inspection</p>
                        <p>{timerEntry}</p>
                    </div>
                );
            case CompModeStep.SOLVE:
                return (
                    <div
                        className='timer__comp-mode'
                        ref={timerComponentRef}
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.code === 'Space' || event.code === 'Escape') {
                                event.preventDefault();
                                startPreppingTimer(event.code === 'Escape');
                                clearTimeout(timerTimeoutRef.current);
                                setCompModeStep(CompModeStep.RESULTS);
                            }
                        }}
                    >
                        <p>Solve</p>
                        <p>{timerEntry}</p>
                    </div>
                );
            case CompModeStep.RESULTS:
                return (
                    <div
                        className='timer__comp-mode'
                        ref={timerComponentRef}
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.code === 'Space') {
                                event.preventDefault();
                                if (compModeTimes.length === 5) {
                                    setCompModeTimes([]);
                                }
                                setCurrentCompModePenalty(0);
                                clearTimeout(timerTimeoutRef.current);
                                setCompModeStep(CompModeStep.SCRAMBLE);
                            }
                        }}
                    >
                        <table className='timer__results'>
                            <thead>
                                <tr>
                                    <th>Solve</th>
                                    <th>Time</th>
                                    <th>Penalties</th>
                                    <th>DNF?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[0, 1, 2, 3, 4].map((_, index) => {
                                    return (
                                        <tr key={index}>
                                            {compModeTimes[index] != null ? (
                                                <>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {getFormattedTime(
                                                            compModeTimes[index].time +
                                                                compModeTimes[index].penalty * 100,
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className='clickable'
                                                            onClick={() => {
                                                                const cmt = {
                                                                    ...compModeTimes[index],
                                                                    penalty: Math.max(
                                                                        0,
                                                                        compModeTimes[index].penalty - 2,
                                                                    ),
                                                                };
                                                                const listCopy = compModeTimes.map((t) => t);
                                                                listCopy.splice(index, 1, cmt);
                                                                setCompModeTimes(listCopy);
                                                            }}
                                                        >
                                                            -
                                                        </span>
                                                        {compModeTimes[index].penalty}
                                                        <span
                                                            className='clickable'
                                                            onClick={() => {
                                                                const cmt = {
                                                                    ...compModeTimes[index],
                                                                    penalty: Math.max(
                                                                        0,
                                                                        compModeTimes[index].penalty + 2,
                                                                    ),
                                                                };
                                                                const listCopy = compModeTimes.map((t) => t);
                                                                listCopy.splice(index, 1, cmt);
                                                                setCompModeTimes(listCopy);
                                                            }}
                                                        >
                                                            +
                                                        </span>
                                                    </td>
                                                    <td>{compModeTimes[index].dnf ? 'Yes' : 'No'}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{index + 1}</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                </>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {compModeTimes.length === 4 && (
                            <div>
                                Best Possible Ao5:{' '}
                                {getFormattedTime(
                                    calculateAverageRaw([
                                        ...compModeTimes.map((solve) =>
                                            solve.dnf ? -1 : solve.time + solve.penalty * 100,
                                        ),
                                        1,
                                    ]),
                                )}
                            </div>
                        )}
                        {compModeTimes.length === 5 && (
                            <div>
                                Ao5:{' '}
                                {getFormattedTime(
                                    calculateAverageRaw(
                                        compModeTimes.map((solve) =>
                                            solve.dnf ? -1 : solve.time + solve.penalty * 100,
                                        ),
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                );
        }
    }

    return (
        <section
            className={`timer__timer${timerIsRunning.current ? ' timer_timer--running' : ''}`}
            ref={timerComponentRef}
            tabIndex={0}
            onKeyDown={(event) => {
                if (!isManualEntryMode) {
                    if (event.code === 'Space') {
                        event.preventDefault();
                        startPreppingTimer();
                    } else if (timerIsRunning.current) {
                        event.preventDefault();
                        startPreppingTimer(event.code === 'Escape');
                    }
                }
            }}
            onKeyUp={(event) => {
                if (!isManualEntryMode && event.code === 'Space') {
                    event.preventDefault();
                    startTimer();
                }
            }}
            onTouchStart={(event) => {
                if (!isManualEntryMode && (event.target as HTMLElement).tagName !== 'BUTTON') {
                    startPreppingTimer();
                }
            }}
            onTouchEnd={() => {
                if (!isManualEntryMode) {
                    startTimer();
                }
            }}
        >
            {showScrambleColors ? (
                <div
                    className='timer__scramble'
                    ref={scrambleRef}
                    style={{
                        fontSize: `${scrambleFontSize}px`,
                    }}
                >
                    {scramble.split(' ').map((move, index) => {
                        // New color every three letters, wrapping after we get to the end of the color list
                        const colorIndex = Math.trunc((index / 3) % scrambleLetterColors.length);
                        return (
                            <span key={index} className={`timer_scramble-letter ${scrambleLetterColors[colorIndex]}`}>
                                {move}
                            </span>
                        );
                    })}
                </div>
            ) : (
                <div
                    className='timer__scramble'
                    ref={scrambleRef}
                    style={{
                        fontSize: `${scrambleFontSize}px`,
                    }}
                >
                    {scramble}
                </div>
            )}
            {numSplits > 1 && (
                <div style={{ width: '100%' }}>
                    <table className='timer__splits-table'>
                        <tbody>
                            <tr>
                                {Array.from({ length: numSplits }).map((_, index) => {
                                    const currentSplit = splitTimes.length;
                                    const active = timerIsRunning.current;
                                    const timeSource = active
                                        ? splitTimes
                                        : // Show the timestamp of each split, instead of the length of the split
                                          currentEntry?.splits?.map((split, index, list) => {
                                              if (!index) {
                                                  return split;
                                              }
                                              return list.slice(0, index + 1).reduce((prev, curr) => prev + curr, 0);
                                          }) ?? [];
                                    const time = timeSource[index] ?? '--';
                                    return (
                                        <td
                                            key={index}
                                            className={classNames(
                                                'timer__current-splits',
                                                active && index < currentSplit ? 'timer__current-splits--current' : '',
                                                active && index === currentSplit
                                                    ? 'timer__current-splits--previous'
                                                    : '',
                                            )}
                                            style={{
                                                width: `${100 / numSplits}%`,
                                            }}
                                        >
                                            {isNaN(time) ? '--' : getFormattedTime(time)}
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            <div className='timer__input-container' ref={inputRef}>
                {isManualEntryMode ? (
                    <>
                        <input
                            type='text'
                            inputMode='decimal'
                            className='timer__time-input'
                            placeholder='MM:SS.XX'
                            value={timerEntry}
                            onChange={(event) => {
                                setTimerEntry(event.target.value);
                            }}
                            onKeyDown={(event) => {
                                // If the user presses the 'Enter' key on the keyboard
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    const time = timerEntry;

                                    if (!time?.length) {
                                        setTimerEntry('');
                                        return;
                                    }
                                    const isDNF = time.toLowerCase().includes('dnf') || parseInt(time) === 0;
                                    const isPlusTwo = time.indexOf('+') !== -1;

                                    const baseTime = isDNF
                                        ? 0
                                        : isPlusTwo
                                        ? unFormatTime(time.split('+')[0]) + 200
                                        : unFormatTime(time);

                                    if (isNaN(baseTime)) {
                                        setTimerEntry('');
                                        return;
                                    }

                                    const timeEntry = {
                                        isDNF,
                                        isPlusTwo,
                                        scramble,
                                        date: new Date(),
                                        time: baseTime,
                                        analysisData: {},
                                    };

                                    dispatchSolveData({
                                        type: 'ADD_SOLVE',
                                        data: timeEntry,
                                    });

                                    newScramble();
                                    setTimerEntry('');
                                }
                            }}
                        />
                        <div className='timer__input-note'>{`Insert a "+" at the end for a +2. Insert 'dnf' or a time of '0' for a DNF.`}</div>
                    </>
                ) : (
                    <div
                        className={classNames(
                            'timer__counter',
                            isPrepping ? 'timer__counter--prepping' : '',
                            isPrepped ? 'timer__counter--prepped' : '',
                        )}
                    >
                        {timerEntry}
                    </div>
                )}
            </div>
            {!timerIsRunning.current && (
                <>
                    <div className='timer__input-actions' ref={actionsRef}>
                        <button
                            className='timer__button'
                            onClick={() => {
                                newScramble();
                            }}
                        >
                            New
                        </button>
                        <button
                            className='timer__button'
                            onClick={() => {
                                dispatchSolveData({
                                    type: 'SET_DNF',
                                    data: {
                                        index: mostRecentSolveIndex,
                                        value: true,
                                    },
                                });
                            }}
                        >
                            DNF
                        </button>
                        <button
                            className='timer__button'
                            onClick={() => {
                                dispatchSolveData({
                                    type: 'SET_PLUS_TWO',
                                    data: {
                                        index: mostRecentSolveIndex,
                                        value: true,
                                    },
                                });
                            }}
                        >
                            +2
                        </button>
                        <button
                            className='timer__button'
                            onClick={() => {
                                dispatchSolveData({
                                    type: 'SET_DNF',
                                    data: {
                                        index: mostRecentSolveIndex,
                                        value: false,
                                    },
                                });
                                dispatchSolveData({
                                    type: 'SET_PLUS_TWO',
                                    data: {
                                        index: mostRecentSolveIndex,
                                        value: false,
                                    },
                                });
                            }}
                        >
                            OK
                        </button>
                        <button
                            className='timer__button'
                            onClick={() => {
                                setIsManualEntryMode(!isManualEntryMode);
                            }}
                        >
                            Mode
                        </button>
                        {mostRecentSolve?.analysisData != null && (
                            <>
                                <button
                                    className={`timer__button${
                                        mostRecentSolve?.analysisData?.ollCase ? ' timer__button--big' : ''
                                    }`}
                                    onClick={() => {
                                        setIsOllSelectionMode(!isOllSelectionMode);
                                    }}
                                >
                                    {mostRecentSolve?.analysisData?.ollCase ? (
                                        <SingleFaceVisualizationComponent
                                            faceState={getOllById(mostRecentSolve.analysisData.ollCase)?.state}
                                            puzzleType='3x3x3'
                                        />
                                    ) : (
                                        'OLL'
                                    )}
                                </button>
                                <button
                                    className={`timer__button${
                                        mostRecentSolve?.analysisData?.pllCase ? ' timer__button--big' : ''
                                    }`}
                                    onClick={() => {
                                        setIsPllSelectionMode(!isPllSelectionMode);
                                    }}
                                >
                                    {mostRecentSolve?.analysisData?.pllCase ? (
                                        <SingleFaceVisualizationComponent
                                            faceState={getPllById(mostRecentSolve.analysisData.pllCase)?.state}
                                            puzzleType='3x3x3'
                                        />
                                    ) : (
                                        'PLL'
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                    <div>
                        {isOllSelectionMode && mostRecentSolve != null && (
                            <CasePickerComponent
                                algSet='oll'
                                solve={mostRecentSolve}
                                dispatchSolveData={dispatchSolveData}
                                solveIndex={mostRecentSolveIndex}
                                onSelect={() => {
                                    setIsOllSelectionMode(true);
                                }}
                            />
                        )}
                        {isPllSelectionMode && mostRecentSolve != null && (
                            <CasePickerComponent
                                algSet='pll'
                                solve={mostRecentSolve}
                                dispatchSolveData={dispatchSolveData}
                                solveIndex={mostRecentSolveIndex}
                                onSelect={() => {
                                    setIsPllSelectionMode(true);
                                }}
                            />
                        )}
                    </div>

                    {/*scramble.split(' ').map((_, index, scrambleList) => {
                        const subScramble = scrambleList.slice(0, index + 1).join(' ');
                        return <CubeVisualizationComponent key={index} scramble={subScramble} puzzleType={puzzleType} />;
                    })*/}
                    {!NonStandardPuzzles.includes(puzzleType) && (
                        <CubeVisualizationComponent
                            scramble={scramble}
                            puzzleType={puzzleType}
                            width={isMobile ? 200 : 400}
                            height={isMobile ? 150 : 300}
                        />
                    )}
                </>
            )}
        </section>
    );
});

export default TimerComponent;
