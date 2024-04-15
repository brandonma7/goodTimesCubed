import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';

import HeaderComponent from '../HeaderComponent';
import ResultsTableComponent from '../ResultsTableComponent';
import BestsTableComponent, { calculateBests } from '../BestsTableComponent';

import './GoodTimes.scss';
import TimerComponent from '../TimerComponent';
import { calculateAverageRaw, DataType, generateScramble, PuzzleType, Solve } from '../../utils/cubingUtils';
import AlertsComponent from '../AlertsComponent';
import { AlertsContext, MetaDataContext } from '../../TimerApp';
import {
    getFormattedTime,
    getSessionListFromLocalStorage,
    saveSessionDataToLocalStorage,
    getSessionDataFromLocalStorage,
} from '../../utils/genericUtils';
import useStickyState from '../../utils/useStickyState';
import SessionManagementComponent from '../SessionManagementComponent';
import SettingsView, { SettingsContext } from '../../dialogs/SettingsView';
import { useContainerDimensions } from '../../utils/useContainerDimensions';
import InsightsView from '../../dialogs/InsightsView';
import { colorScramble } from '../CubeVisualizationComponent';

const SMALL_SCREEN_SIZE_WIDTH = 768;

export enum AppMode {
    TIMER,
    COMP,
    INSIGHTS,
    SETTINGS,
    MATH,
}

export type SolveData = Solve[];
export type SolveDataAction =
    | {
          type: 'ADD_SOLVE';
          data: Solve;
      }
    | {
          type: 'DELETE_SOLVE';
          data: number;
      }
    | {
          type: 'SET_TIME';
          data: {
              index: number;
              time: number;
          };
      }
    | {
          type: 'SET_DNF';
          data: {
              index: number;
              value: boolean | null;
          };
      }
    | {
          type: 'SET_PLUS_TWO';
          data: {
              index: number;
              value: boolean;
          };
      }
    | {
          type: 'SET_OLL_SKIP';
          data: {
              index: number;
              value: boolean;
          };
      }
    | {
          type: 'SET_PLL_SKIP';
          data: {
              index: number;
              value: boolean;
          };
      }
    | {
          type: 'SET_PLL_CASE';
          data: {
              index: number;
              value: string | undefined;
          };
      }
    | {
          type: 'SET_OLL_CASE';
          data: {
              index: number;
              value: string | undefined;
          };
      }
    | {
          type: 'CHANGE_SESSION';
          data: SolveData;
      }
    | {
          type: 'CLEAR_DATA';
      }
    | {
          type: 'REFRESH';
      };

const solveDataReducer = (state: SolveData, action: SolveDataAction): SolveData => {
    switch (action.type) {
        case 'ADD_SOLVE':
            return [...state, action.data];
        case 'DELETE_SOLVE': {
            const newState = state.slice(0);
            newState.splice(action.data, 1);
            return newState;
        }
        case 'SET_TIME':
            return state.map((solve, index) => {
                if (index === action.data.index) {
                    solve.time = action.data.time;
                    solve.isPlusTwo = false;
                }
                return solve;
            });
        case 'SET_DNF':
            return state.map((solve, index) => {
                const targetIndex = action.data.index;
                const dataIndex = targetIndex >= 0 ? targetIndex : targetIndex + state.length;
                if (index === dataIndex) {
                    solve.isDNF = action.data.value ?? !solve.isDNF;
                }
                return solve;
            });
        case 'SET_PLUS_TWO':
            return state.map((solve, index) => {
                const isPlusTwo = action.data.value;
                const targetIndex = action.data.index;
                const dataIndex = targetIndex >= 0 ? targetIndex : targetIndex + state.length;
                if (index === dataIndex && solve.isPlusTwo !== isPlusTwo) {
                    solve.isPlusTwo = isPlusTwo;
                    solve.time += isPlusTwo ? 200 : -200;
                }
                return solve;
            });
        case 'SET_OLL_SKIP':
            return state.map((solve, index) => {
                if (index === action.data.index) {
                    if (!solve.analysisData) {
                        solve.analysisData = {};
                    }
                    solve.analysisData.isOllSkip = action.data.value;
                }
                return solve;
            });
        case 'SET_PLL_SKIP':
            return state.map((solve, index) => {
                if (index === action.data.index) {
                    if (!solve.analysisData) {
                        solve.analysisData = {};
                    }
                    solve.analysisData.isPllSkip = action.data.value;
                }
                return solve;
            });
        case 'SET_PLL_CASE':
            return state.map((solve, index) => {
                if (index === action.data.index) {
                    if (!solve.analysisData) {
                        solve.analysisData = {};
                    }
                    solve.analysisData.pllCase = action.data.value;
                }
                return solve;
            });
        case 'SET_OLL_CASE':
            return state.map((solve, index) => {
                if (index === action.data.index) {
                    if (!solve.analysisData) {
                        solve.analysisData = {};
                    }
                    solve.analysisData.ollCase = action.data.value;
                }
                return solve;
            });
        case 'CLEAR_DATA':
            return [];
        case 'CHANGE_SESSION':
            return action.data;
        case 'REFRESH':
            return state.slice(0);
        default:
            return state;
    }
};

type BestRecord = {
    time: number;
    index: number;
    size?: number;
};

export interface BestsData {
    [DataType.SINGLE]?: BestRecord;
    [DataType.MEAN]: BestRecord[];
    [DataType.AVERAGE]: BestRecord[];
}

export function getBestOfType(bests: BestsData, type: DataType, size: number): BestRecord | undefined {
    if (type === DataType.SINGLE) {
        return bests[type];
    }
    return bests[type].find((best) => best.size === size);
}

export default function GoodTimes() {
    const timerRef = useRef<HTMLDivElement>(null);
    const timerComponentRef = useRef<HTMLDivElement>(null);
    const { width } = useContainerDimensions(timerRef);

    const { pushAlert } = useContext(AlertsContext);
    const { solveSettings } = useContext(SettingsContext);
    const { isMobile, setIsMobile, timerIsRunning } = useContext(MetaDataContext);

    const sessionList = getSessionListFromLocalStorage();
    const [sessionId, setSessionId] = useStickyState(sessionList[0], 'currentSession');
    const sessionData = getSessionDataFromLocalStorage(sessionId);

    const [solveData, dispatchSolveData] = useReducer(solveDataReducer, sessionData.data, undefined);
    const [bestsData, setBestsData] = useState(calculateBests(solveSettings, solveData));

    const [scramble, setScramble] = useState<string>(generateScramble(sessionData.type));

    const [appMode, setAppMode] = useState<AppMode>(AppMode.TIMER);
    const appModeSetter = (newMode = AppMode.TIMER) => {
        setAppMode(newMode);
    };

    const isSuppressingBestAlerts = useRef(false);
    const suppressBestAlerts = () => {
        isSuppressingBestAlerts.current = true;
    };

    function newScramble() {
        setScramble(generateScramble(sessionData.type));
    }

    useEffect(() => {
        if (isMobile) {
            if (width > SMALL_SCREEN_SIZE_WIDTH) {
                setIsMobile(false);
            }
        } else {
            if (width <= SMALL_SCREEN_SIZE_WIDTH) {
                setIsMobile(true);
            }
        }
    }, [width]);

    useEffect(() => {
        newScramble();
    }, [sessionId, sessionData.type]);

    useEffect(() => {
        saveSessionDataToLocalStorage({
            id: sessionId,
            name: sessionData.name,
            type: sessionData.type,
            sessionType: sessionData.sessionType,
            data: solveData,
            numSplits: sessionData.numSplits,
        });
    }, [solveData]);

    useEffect(() => {
        const newBests = calculateBests(solveSettings, solveData);
        const alerts = [];

        newBests[DataType.AVERAGE].forEach((best) => {
            const currentBest = getBestOfType(bestsData, DataType.AVERAGE, best?.size ?? 0);
            if (best.index !== currentBest?.index && !isSuppressingBestAlerts.current) {
                alerts.push(`new best AO${best.size}: ${getFormattedTime(best.time)}`);
            }
        });

        newBests[DataType.MEAN].forEach((best) => {
            const currentBest = getBestOfType(bestsData, DataType.MEAN, best?.size ?? 0);
            if (best.index !== currentBest?.index && !isSuppressingBestAlerts.current) {
                alerts.push(`new best MO${best.size}: ${getFormattedTime(best.time)}`);
            }
        });

        if (
            bestsData[DataType.SINGLE]?.index !== newBests[DataType.SINGLE]?.index &&
            !isSuppressingBestAlerts.current
        ) {
            alerts.push(`New best single: ${getFormattedTime(newBests[DataType.SINGLE]?.time)}!`);
        }

        if (alerts.length && solveData.length > 5) {
            pushAlert(alerts);
        }

        setBestsData(newBests);
        isSuppressingBestAlerts.current = false;
    }, [solveData, solveSettings]);

    return (
        <div
            className='timer'
            ref={timerRef}
            onClick={(e) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const target = e.target as any;
                if (
                    target?.className?.includes &&
                    (target?.className?.includes('input') || target?.className?.includes('select'))
                ) {
                    return;
                }
                timerComponentRef.current && timerComponentRef.current.focus();
            }}
        >
            <HeaderComponent setAppMode={appModeSetter} />
            <div className='timer__main'>
                {appMode === AppMode.COMP ? (
                    <TimerComponent
                        dispatchSolveData={dispatchSolveData}
                        puzzleType={sessionData.type}
                        scramble={scramble}
                        newScramble={newScramble}
                        timerComponentRef={timerComponentRef}
                        compMode
                    />
                ) : appMode === AppMode.MATH ? (
                    <ManualCompModeComponent puzzleType={sessionData.type} />
                ) : (
                    <>
                        <section className={`timer__left-bar${timerIsRunning ? ' timer__left-bar--running' : ''}`}>
                            <SessionManagementComponent
                                sessionData={sessionData}
                                noSolves={solveData.length === 0}
                                setSessionId={setSessionId}
                                timerComponentRef={timerComponentRef}
                                dispatchSolveData={dispatchSolveData}
                                suppressBestAlerts={suppressBestAlerts}
                            />
                            {appMode === AppMode.TIMER && (
                                <>
                                    <BestsTableComponent
                                        solves={solveData}
                                        bests={bestsData}
                                        sessionData={sessionData}
                                        sessionId={sessionId}
                                        solveDispatcher={dispatchSolveData}
                                        onAction={suppressBestAlerts}
                                    />
                                    <ResultsTableComponent
                                        solves={solveData}
                                        bests={bestsData}
                                        sessionData={sessionData}
                                        sessionId={sessionId}
                                        solveDispatcher={dispatchSolveData}
                                        onAction={suppressBestAlerts}
                                    />
                                </>
                            )}
                        </section>
                        {appMode === AppMode.TIMER && (
                            <TimerComponent
                                dispatchSolveData={dispatchSolveData}
                                puzzleType={sessionData.type}
                                scramble={scramble}
                                newScramble={newScramble}
                                numSplits={sessionData.numSplits}
                                timerComponentRef={timerComponentRef}
                                mostRecentSolve={solveData.at(-1) ?? undefined}
                                mostRecentSolveIndex={solveData.length - 1}
                            />
                        )}
                        {appMode === AppMode.INSIGHTS && (
                            <InsightsView solves={solveData} bests={bestsData} isMobile={isMobile} />
                        )}
                        {appMode === AppMode.SETTINGS && <SettingsView />}
                    </>
                )}
            </div>
            <AlertsComponent />
            Width: {width}
        </div>
    );
}

function ManualCompModeComponent({ puzzleType = '3x3x3' }: { puzzleType?: PuzzleType }) {
    const { isMobile } = useContext(MetaDataContext);
    const [scrambles, setScrambles] = useState(new Array(5).fill('').map(() => generateScramble(puzzleType)));
    const [times, setTimes] = useState<number[]>(new Array(5).fill(0));
    const [targetAverage, setTargetAverage] = useState(1843);

    const validTimes = times.filter((time) => time > 0);
    const timeToBeat = findTimeToBeatTargetAverage(times, targetAverage);

    return (
        <div
            style={{
                width: isMobile ? '90%' : '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: '0 auto',
            }}
        >
            <div>
                Target Average:
                <input
                    className='timer__input'
                    type='text'
                    inputMode='decimal'
                    value={targetAverage}
                    onChange={(event) => setTargetAverage(parseInt(event.target.value))}
                />
            </div>
            <table className='basic-table'>
                <thead>
                    <tr>
                        <th>Solve</th>
                        <th>Time</th>
                        {!isMobile && <th>Scramble</th>}
                    </tr>
                </thead>
                <tbody>
                    {scrambles.map((scramble, index) => {
                        return (
                            <>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input
                                            className='timer__input'
                                            type='text'
                                            inputMode='decimal'
                                            value={times[index]}
                                            onChange={(event) => {
                                                const timesCopy = times.map((t) => t);
                                                const intValue = parseInt(event.target.value);
                                                const newValue = isNaN(intValue) ? 0 : intValue;
                                                timesCopy[index] = newValue;
                                                setTimes(timesCopy);
                                            }}
                                        />
                                    </td>
                                    {!isMobile && <td>{colorScramble(scramble)}</td>}
                                </tr>
                                {isMobile && (
                                    <tr>
                                        <td></td>
                                        <td style={{ display: 'flex', flexWrap: 'wrap' }}>{colorScramble(scramble)}</td>
                                    </tr>
                                )}
                            </>
                        );
                    })}
                </tbody>
            </table>
            {validTimes.length === 3 && (
                <div>Counting time must be: {timeToBeat === null ? 'no' : getFormattedTime(timeToBeat)}</div>
            )}
            {validTimes.length === 4 && (
                <>
                    <div>Best Possible Ao5: {getFormattedTime(calculateAverageRaw([...validTimes, 1]))}</div>
                    <div>Worst Possible Ao5: {getFormattedTime(calculateAverageRaw([...validTimes, 100000000]))}</div>
                    <div>Time to beat target: {timeToBeat === null ? 'no' : getFormattedTime(timeToBeat)}</div>
                </>
            )}
            {validTimes.length === 5 && <div>Ao5: {getFormattedTime(calculateAverageRaw(times))}</div>}
            <button
                className='timer__button'
                onClick={() => {
                    setScrambles(new Array(5).fill('').map(() => generateScramble(puzzleType)));
                    setTimes(new Array(5).fill(0));
                }}
            >
                Reset
            </button>
            <button className='timer__button' onClick={() => setTimes(new Array(5).fill(0))}>
                Reset Times Only
            </button>
        </div>
    );
}

function findTimeToBeatTargetAverage(times: number[], targetAverage: number): number | null {
    const validTimes = times.filter((time) => time > 0);
    if (validTimes.length !== 4 && validTimes.length !== 3) {
        return null;
    }
    validTimes.sort((a, b) => a - b);

    if (validTimes.length === 3) {
        return 3 * targetAverage - validTimes[0] - validTimes[1];
    } else {
        const bestPossible = calculateAverageRaw([...validTimes, 1]);
        if (bestPossible > targetAverage) {
            return null;
        }

        return 3 * targetAverage - validTimes[1] - validTimes[2];
    }
}
