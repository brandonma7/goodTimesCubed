import React, { useContext, memo, useRef, useState, useEffect } from 'react';

import { SolveDataAction } from '../Timer';
import CubeVisualizationComponent from '../CubeVisualizationComponent';

import { classNames, getFormattedTime, unFormatTime } from '../../utils/genericUtils';
import { SettingsContext } from '../../dialogs/SettingsDialog';

import './TimerComponent.scss';
import { PuzzleType, PuzzleTypeMoveCount, Solve, NonStandardPuzzles } from '../../utils/cubingUtils';
import { useContainerDimensions } from '../../utils/useContainerDimensions';
import { MetaDataContext } from '../../TimerApp';

type TimerComponentProps = {
    dispatchSolveData: React.Dispatch<SolveDataAction>;
    puzzleType: PuzzleType;
    scramble: string;
    newScramble: () => void;
    numSplits: number;
    timerComponentRef: React.RefObject<HTMLDivElement>;
};

const TimerComponent = memo(function TimerComponentInternal({
    dispatchSolveData,
    puzzleType,
    scramble,
    newScramble,
    numSplits,
    timerComponentRef,
}: TimerComponentProps) {
    const { isManualEntryMode } = useContext(SettingsContext);
    const { isMobile } = useContext(MetaDataContext);
    const [timerEntry, setTimerEntry] = useState(isManualEntryMode ? '' : '0.00');
    const [isPrepping, setIsPrepping] = useState(false);
    const [isPrepped, setIsPrepped] = useState(false);
    const [splitTimes, setSplitTimes] = useState<number[]>([]);
    const [currentEntry, setCurrentEntry] = useState<Solve>();

    const isTimerReady = useRef(false);
    const spaceKeyIsDown = useRef(false);
    const timerIsRunning = useRef(false);

    const elapsed = useRef(0.0);

    const isTimerReadyTimeoutRef = useRef<NodeJS.Timeout>();
    const timerTimeoutRef = useRef<NodeJS.Timeout>();

    const { width, height } = useContainerDimensions(timerComponentRef);

    const scrambleRef = useRef<HTMLDivElement>(null);
    const { height: scrambleHeight } = useContainerDimensions(scrambleRef);
    const inputRef = useRef<HTMLDivElement>(null);
    const { height: inputHeight } = useContainerDimensions(inputRef);
    const actionsRef = useRef<HTMLDivElement>(null);
    const { height: actionsHeight } = useContainerDimensions(actionsRef);

    const remainingHeightForCubePic = height - scrambleHeight - inputHeight - actionsHeight - 200;

    useEffect(() => {
        setTimerEntry(isManualEntryMode ? '' : '0.00');
    }, [isManualEntryMode]);

    function startPreppingTimer(isDNF = false) {
        if (timerIsRunning.current) {
            // Timer is running, so either need to stop or record a split
            if (splitTimes.length < numSplits - 1 && !isDNF) {
                // Record split
                const baseTime = elapsed.current / 10;
                setSplitTimes([...splitTimes, baseTime]);
            } else {
                timerIsRunning.current = false;
                clearTimeout(timerTimeoutRef.current);

                const baseTime = elapsed.current / 10;
                const formattedBaseTime = getFormattedTime(baseTime);
                setTimerEntry(`${formattedBaseTime}`);

                const splits = isDNF
                    ? new Array(numSplits).fill(-1)
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

                dispatchSolveData({
                    type: 'ADD_SOLVE',
                    data: timeEntry,
                });

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

    // Arbitrary font sizes for shortest move count and longest that I thought looked good
    const fontSizeFor2x2 = 1.5;
    const fontSizeFor7x7 = 0.8;
    // Over-engineered way to figure out what everything in bewteen should be lol
    const slope = (fontSizeFor2x2 - fontSizeFor7x7) / (PuzzleTypeMoveCount['2x2x2'] - PuzzleTypeMoveCount['7x7x7']);
    const yIntercept = fontSizeFor2x2 - slope * PuzzleTypeMoveCount['2x2x2'];
    const scrambleFontSize = slope * PuzzleTypeMoveCount[puzzleType] + yIntercept;

    return (
        <section
            className='timer__timer'
            ref={timerComponentRef}
            tabIndex={0}
            onKeyDown={(event) => {
                if (!isManualEntryMode) {
                    if (event.code === 'Space') {
                        event.preventDefault();
                        startPreppingTimer();
                    } else if (event.code === 'Escape' && timerIsRunning.current) {
                        event.preventDefault();
                        startPreppingTimer(true);
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
            <div
                className='timer__scramble'
                ref={scrambleRef}
                style={{
                    fontSize: `${scrambleFontSize}em`,
                }}
            >
                {scramble}
            </div>
            {numSplits > 1 && (
                <div style={{ width: '100%' }}>
                    <table style={{ width: '100%' }}>
                        <tbody>
                            <tr>
                                {Array.from({ length: numSplits }).map((_, index) => {
                                    const currentSplit = splitTimes.length;
                                    const active = timerIsRunning.current;
                                    const timeSource = active ? splitTimes : currentEntry?.splits ?? [];
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
            <div className='timer__input-actions' ref={actionsRef}>
                <button
                    className='timer__button'
                    onClick={() => {
                        newScramble();
                    }}
                >
                    New Scramble
                </button>
            </div>
            {/*scramble.split(' ').map((_, index, scrambleList) => {
                const subScramble = scrambleList.slice(0, index + 1).join(' ');
                return <CubeVisualizationComponent key={index} scramble={subScramble} puzzleType={puzzleType} />;
            })*/}
            {!NonStandardPuzzles.includes(puzzleType) && (
                <CubeVisualizationComponent
                    scramble={scramble}
                    puzzleType={puzzleType}
                    width={width / 2}
                    height={remainingHeightForCubePic < 200 && isMobile ? 200 : remainingHeightForCubePic}
                />
            )}
        </section>
    );
});

export default TimerComponent;
