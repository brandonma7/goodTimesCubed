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
import { AlertsContext } from '../../TimerApp';
import {
    areSessionsSame,
    getFormattedTime,
    getSessionDataFromLocalStorage,
    getSessionListFromLocalStorage,
    saveSessionDataToLocalStorage,
} from '../../utils/genericUtils';
import useStickyState from '../../utils/useStickyState';
import SessionDialog from '../../dialogs/SessionDialog';
import useDialogContext from '../../dialogs/UseDialogsContext';
import SessionManagementComponent from '../SessionManagementComponent';
import SettingsDialog, { SettingsContext } from '../../dialogs/SettingsDialog';
import InsightsDialog from '../../dialogs/InsightsDialog';

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

    const [scramble, setScramble] = useState(generateScramble());
    const [sessionId, setSessionId] = useStickyState('Session 1', 'currentSession');
    const [solveData, dispatchSolveData] = useReducer(
        solveDataReducer,
        getSessionDataFromLocalStorage(sessionId),
        undefined,
    );
    const [bestsData, setBestsData] = useState(calculateBests(solveSettings, solveData));

    const sessionList = getSessionListFromLocalStorage();

    const isSuppressingBestAlerts = useRef(false);
    const suppressBestAlerts = () => {
        isSuppressingBestAlerts.current = true;
    };

    function newScramble() {
        setScramble(generateScramble());
    }

    useEffect(() => {
        const newSolveData = getSessionDataFromLocalStorage(sessionId);
        if (!areSessionsSame(solveData, newSolveData)) {
            dispatchSolveData({
                type: 'CHANGE_SESSION',
                data: newSolveData,
            });
            suppressBestAlerts();
        }
    }, [sessionId]);

    useEffect(() => {
        saveSessionDataToLocalStorage(solveData, sessionId);
    }, [solveData]);

    useEffect(() => {
        const newBests = calculateBests(solveSettings, solveData);

        newBests[DataType.AVERAGE].forEach((best) => {
            const currentBest = getBestOfType(bestsData, DataType.AVERAGE, best?.size ?? 0);
            if (best.index !== currentBest?.index && !isSuppressingBestAlerts.current) {
                pushAlert(`new best AO${best.size}: ${getFormattedTime(best.time)}`);
            }
        });

        newBests[DataType.MEAN].forEach((best) => {
            const currentBest = getBestOfType(bestsData, DataType.MEAN, best?.size ?? 0);
            if (best.index !== currentBest?.index && !isSuppressingBestAlerts.current) {
                pushAlert(`new best MO${best.size}: ${getFormattedTime(best.time)}`);
            }
        });

        if (
            bestsData[DataType.SINGLE]?.index !== newBests[DataType.SINGLE]?.index &&
            !isSuppressingBestAlerts.current
        ) {
            pushAlert(`New best single: ${getFormattedTime(newBests[DataType.SINGLE]?.time)}!`);
        }

        setBestsData(newBests);
        isSuppressingBestAlerts.current = false;
    }, [solveData, solveSettings]);

    return (
        <div className='timer'>
            <DialogContextProvider>
                <HeaderComponent />
            </DialogContextProvider>
            <div className='timer__main'>
                <DialogContextProvider>
                    <section className='timer__left-bar'>
                        <BestsTableComponent solves={solveData} bests={bestsData} />
                        <ResultsTableComponent solves={solveData} bests={bestsData} />
                        <SessionManagementComponent sessionId={sessionId} setSessionId={setSessionId} />
                    </section>
                </DialogContextProvider>
                <TimerComponent dispatchSolveData={dispatchSolveData} scramble={scramble} newScramble={newScramble} />
            </div>
            <DialogContextProvider>
                <>
                    <SolveDialog
                        solves={solveData}
                        solveDispatcher={dispatchSolveData}
                        onAction={() => {
                            suppressBestAlerts();
                        }}
                    />
                    <MultiSolveDialog solves={solveData} />
                    <SessionDialog
                        sessionId={sessionId}
                        onRenameSession={(newName) => {
                            saveSessionDataToLocalStorage(solveData, newName);
                            setSessionId(newName);
                        }}
                        onDeleteSession={() => {
                            setSessionId(sessionList[0]);
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
