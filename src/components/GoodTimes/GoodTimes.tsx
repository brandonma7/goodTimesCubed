import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';

import HeaderComponent from '../HeaderComponent';
import ResultsTableComponent from '../ResultsTableComponent';
import BestsTableComponent, { calculateBests } from '../BestsTableComponent';

import './GoodTimes.scss';
import TimerComponent from '../TimerComponent';
import { DataType, generateScramble, Solve } from '../../utils/cubingUtils';
import AlertsComponent from '../AlertsComponent';
import { AlertsContext, MetaDataContext } from '../../TimerApp';
import {
    getFormattedTime,
    getSessionListFromLocalStorage,
    saveSessionDataToLocalStorage,
    getSessionDataFromLocalStorage,
    classNames,
} from '../../utils/genericUtils';
import useStickyState from '../../utils/useStickyState';
import SessionManagementComponent from '../SessionManagementComponent';
import SettingsView, { SettingsContext } from '../../dialogs/SettingsView';
import { useContainerDimensions } from '../../utils/useContainerDimensions';
import InsightsView from '../../dialogs/InsightsView';
import { ManualCompModeComponent } from '../ManualCompModeComponent/ManualCompModeComponent';
import AlgLibraryComponent, { TwoSideLibraryComponent } from '../AlgLibraryComponent';

const SMALL_SCREEN_SIZE_WIDTH = 768;

export enum AppMode {
    TIMER,
    COMP,
    INSIGHTS,
    SETTINGS,
    MATH,
    ALG,
    P2S,
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
                    solve.analysisData.pll = action.data.value;
                }
                return solve;
            });
        case 'SET_OLL_CASE':
            return state.map((solve, index) => {
                if (index === action.data.index) {
                    if (!solve.analysisData) {
                        solve.analysisData = {};
                    }
                    solve.analysisData.oll = action.data.value;
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
            <div className={classNames('timer__main', appMode === AppMode.TIMER ? 'timer__main--reverse' : '')}>
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
                ) : appMode === AppMode.ALG ? (
                    <AlgLibraryComponent isMobile={isMobile} />
                ) : appMode === AppMode.P2S ? (
                    <TwoSideLibraryComponent />
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
            {/*Width: {width}*/}
        </div>
    );
}
