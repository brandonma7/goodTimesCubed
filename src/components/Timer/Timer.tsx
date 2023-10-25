import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';

import HeaderComponent from '../HeaderComponent';
import ResultsTableComponent from '../ResultsTableComponent';
import BestsTableComponent, { calculateBests } from '../BestsTableComponent';

import './Timer.scss';
import TimerComponent from '../TimerComponent';
import { DataType, generateScramble, Solve } from '../../utils/cubingUtils';
import SolveDialog from '../../dialogs/SolveDialog';
import MultiSolveDialog from '../../dialogs/MultiSolveDialog';
import AlertsComponent from '../AlertsComponent';
import { AlertsContext, MetaDataContext } from '../../TimerApp';
import {
    getFormattedTime,
    getSessionDataFromLocalStorage,
    getSessionListFromLocalStorage,
    saveSessionDataToLocalStorage,
} from '../../utils/genericUtils';
import useStickyState from '../../utils/useStickyState';
import SessionDialog from '../../dialogs/SessionDialog';
import useDialogContext from '../../dialogs/UseDialogsContext';
import SessionManagementComponent, { areSessionsSame } from '../SessionManagementComponent';
import SettingsDialog, { SettingsContext } from '../../dialogs/SettingsDialog';
import InsightsDialog from '../../dialogs/InsightsDialog';
import { useContainerDimensions } from '../../utils/useContainerDimensions';

const SMALL_SCREEN_SIZE_WIDTH = 768;

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
              value: boolean;
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
          type: 'CHANGE_SESSION';
          data: SolveData;
      }
    | {
          type: 'CLEAR_DATA';
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
                if (index === action.data.index) {
                    solve.isDNF = action.data.value;
                }
                return solve;
            });
        case 'SET_PLUS_TWO':
            return state.map((solve, index) => {
                const isPlusTwo = action.data.value;
                if (index === action.data.index && solve.isPlusTwo !== isPlusTwo) {
                    solve.isPlusTwo = isPlusTwo;
                    solve.time += isPlusTwo ? 200 : -200;
                }
                return solve;
            });
        case 'CLEAR_DATA':
            return [];
        case 'CHANGE_SESSION':
            return action.data;
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

export default function Timer() {
    const DialogContextProvider = useDialogContext();
    const { pushAlert } = useContext(AlertsContext);
    const { solveSettings } = useContext(SettingsContext);
    const { isMobile, setIsMobile } = useContext(MetaDataContext);

    const sessionList = getSessionListFromLocalStorage();
    const [sessionId, setSessionId] = useStickyState(sessionList[0], 'currentSession');
    const sessionData = getSessionDataFromLocalStorage(sessionId);

    const [solveData, dispatchSolveData] = useReducer(solveDataReducer, sessionData.data, undefined);
    const [bestsData, setBestsData] = useState(calculateBests(solveSettings, solveData));

    const [scramble, setScramble] = useState<string>(generateScramble(sessionData.type));

    const timerRef = useRef<HTMLDivElement>(null);
    const { width } = useContainerDimensions(timerRef);

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
        const newSolveData = getSessionDataFromLocalStorage(sessionId);
        if (!areSessionsSame(solveData, newSolveData.data)) {
            dispatchSolveData({
                type: 'CHANGE_SESSION',
                data: newSolveData.data,
            });
            suppressBestAlerts();
        }
    }, [sessionId]);

    useEffect(() => {
        newScramble();
    }, [sessionData.type]);

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

        if (alerts.length) {
            pushAlert(alerts);
        }

        setBestsData(newBests);
        isSuppressingBestAlerts.current = false;
    }, [solveData, solveSettings]);

    return (
        <div className='timer' ref={timerRef}>
            <DialogContextProvider>
                <HeaderComponent />
            </DialogContextProvider>
            <div className='timer__main'>
                <DialogContextProvider>
                    <section className='timer__left-bar'>
                        <BestsTableComponent solves={solveData} bests={bestsData} />
                        <SessionManagementComponent sessionData={sessionData} setSessionId={setSessionId} />
                        <ResultsTableComponent
                            solves={solveData}
                            bests={bestsData}
                            sessionType={sessionData.sessionType}
                            numSplits={sessionData.numSplits}
                        />
                    </section>
                </DialogContextProvider>
                <TimerComponent
                    dispatchSolveData={dispatchSolveData}
                    puzzleType={sessionData.type}
                    scramble={scramble}
                    newScramble={newScramble}
                    numSplits={sessionData.numSplits}
                />
                {/* TODO: custom scrambles
                <input
                    type='text'
                    value={scramble}
                    onChange={(newValue) => {
                        setScramble(newValue.target.value);
                    }}
                />*/}
            </div>
            <DialogContextProvider>
                <>
                    <SolveDialog
                        solves={solveData}
                        puzzleType={sessionData.type}
                        sessionType={sessionData.sessionType}
                        solveDispatcher={dispatchSolveData}
                        onAction={() => {
                            suppressBestAlerts();
                        }}
                    />
                    <MultiSolveDialog solves={solveData} />
                    <SessionDialog
                        sessionData={sessionData}
                        hideDeleteButton={sessionList.length < 2}
                        onUpdateSessionData={(newData) => {
                            saveSessionDataToLocalStorage(newData);
                        }}
                        onClearSessionData={() => {
                            suppressBestAlerts();
                        }}
                        onDeleteSession={() => {
                            const index = sessionList[0] === sessionData.id ? 1 : 0;
                            setSessionId(sessionList[index]);
                        }}
                        solveDispatcher={dispatchSolveData}
                    />
                    <SettingsDialog />
                    <InsightsDialog solves={solveData} bests={bestsData} />
                </>
            </DialogContextProvider>
            <AlertsComponent />
        </div>
    );
}
/*
                        onRenameSession={(newName) => {
                            const { id, type, sessionType } = sessionData;
                            sessionData.name = newName;
                            saveSessionDataToLocalStorage({
                                id,
                                type,
                                name: newName,
                                data: solveData,
                                sessionType,
                            });
                        }}
                        onChangeSessionPuzzleType={(newType) => {
                            const { id, name, sessionType } = sessionData;
                            const newSessionData = {
                                id,
                                name,
                                type: newType,
                                sessionType,
                                data: solveData,
                            };
                            sessionData.type = newSessionData.type;
                            saveSessionDataToLocalStorage(newSessionData);
                        }}
                        onChangeSessionType={(newType) => {
                            const { id, name, type } = sessionData;
                            const newSessionData = {
                                id,
                                name,
                                type,
                                sessionType: newType,
                                data: solveData,
                            };
                            sessionData.sessionType = newSessionData.sessionType;
                            saveSessionDataToLocalStorage(newSessionData);
                        }}*/
