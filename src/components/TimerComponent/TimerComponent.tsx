import React, { useContext, memo, useRef, useState, useEffect } from 'react';

import { SolveDataAction } from '../Timer';
import CubeVisualizationComponent from '../CubeVisualizationComponent';

import { classNames, getFormattedTime, unFormatTime } from '../../utils/genericUtils';
import { SettingsContext } from '../../dialogs/SettingsDialog';

import './TimerComponent.scss';
import { PuzzleType } from '../../utils/cubingUtils';
import { useContainerDimensions } from '../../utils/useContainerDimensions';
import { MetaDataContext } from '../../TimerApp';

type TimerComponentProps = {
    dispatchSolveData: React.Dispatch<SolveDataAction>;
    puzzleType: PuzzleType;
    scramble: string;
    newScramble: () => void;
};

const TimerComponent = memo(function TimerComponentInternal({
    dispatchSolveData,
    puzzleType,
    scramble,
    newScramble,
}: TimerComponentProps) {
    const { isManualEntryMode } = useContext(SettingsContext);
    const { isMobile } = useContext(MetaDataContext);
    const [timerEntry, setTimerEntry] = useState(isManualEntryMode ? '' : '0.00');
    const [isPrepping, setIsPrepping] = useState(false);
    const [isPrepped, setIsPrepped] = useState(false);

    const isTimerReady = useRef(false);
    const spaceKeyIsDown = useRef(false);
    const timerIsRunning = useRef(false);

    const elapsed = useRef(0.0);

    const isTimerReadyTimeoutRef = useRef<NodeJS.Timeout>();
    const timerTimeoutRef = useRef<NodeJS.Timeout>();

    const timerRef = useRef<any>();
    const { width, height } = useContainerDimensions(timerRef);

    const scrambleRef = useRef<any>();
    const { height: scrambleHeight } = useContainerDimensions(scrambleRef);
    const inputRef = useRef<any>();
    const { height: inputHeight } = useContainerDimensions(inputRef);
    const actionsRef = useRef<any>();
    const { height: actionsHeight } = useContainerDimensions(actionsRef);

    const remainingHeightForCubePic = height - scrambleHeight - inputHeight - actionsHeight - 64;

    useEffect(() => {
        setTimerEntry(isManualEntryMode ? '' : '0.00');
    }, [isManualEntryMode]);

    function startPreppingTimer(isDNF = false) {
        if (timerIsRunning.current) {
            timerIsRunning.current = false;
            clearTimeout(timerTimeoutRef.current);
            setTimerEntry(`${elapsed.current / 1000}`);

            const baseTime = elapsed.current / 10;

            const timeEntry = {
                isDNF,
                isPlusTwo: false,
                scramble,
                date: new Date(),
                time: baseTime,
            };

            dispatchSolveData({
                type: 'ADD_SOLVE',
                data: timeEntry,
            });

            newScramble();
        } else {
            if (!spaceKeyIsDown.current) {
                spaceKeyIsDown.current = true;
                elapsed.current = 0.0;
                setTimerEntry('0.00');
                setIsPrepping(true);

                isTimerReadyTimeoutRef.current = setTimeout(() => {
                    setIsPrepping(false);
                    setIsPrepped(true);
                    isTimerReady.current = true;
                }, 1000);
            }
        }
    }

    function startTimer() {
        spaceKeyIsDown.current = false;
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
            clearTimeout(isTimerReadyTimeoutRef.current);
            setIsPrepping(false);
            setIsPrepped(false);
        }
    }

    return (
        <section
            className='timer__timer'
            ref={timerRef}
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
            <div className='timer__scramble' ref={scrambleRef}>
                {scramble}
            </div>
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
            <CubeVisualizationComponent
                scramble={scramble}
                puzzleType={puzzleType}
                width={width / 2}
                height={remainingHeightForCubePic < 200 && isMobile ? 200 : remainingHeightForCubePic}
            />
        </section>
    );
});

export default TimerComponent;
