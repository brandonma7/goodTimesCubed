import React, { useContext } from 'react';
import { DialogContext, DialogType } from '../../dialogs/UseDialogsContext';
import {
    getSessionDataFromLocalStorage,
    getSessionNamesFromLocalStorage,
    saveSessionDataToLocalStorage,
} from '../../utils/genericUtils';

import './SessionManagementComponent.scss';
import { SolveData, SolveDataAction } from '../GoodTimes';
import { isEmpty, isEqual, xorWith } from 'lodash';
import { PuzzleType } from '../../utils/cubingUtils';

type SessionManagementComponentProps = {
    sessionData: SessionData;
    setSessionId: (newValue: string) => void;
    timerComponentRef: React.RefObject<HTMLDivElement>;
    dispatchSolveData: React.Dispatch<SolveDataAction>;
    suppressBestAlerts: () => void;
};

export type SessionType = 'normal' | 'splits' | 'cfopTrainer' | 'yauTrainer' | 'ollTrainer' | 'pllTrainer';
export type SessionData = {
    id: string;
    name: string;
    type: PuzzleType;
    data: SolveData;
    sessionType: SessionType;
    numSplits: number;
};
export type CachedSessionData = {
    [key: string]: SessionData;
};

type SessionTypeMapType = {
    name: string;
    splitNames?: string[];
};

export const SessionTypeMap: { [K in SessionType]: SessionTypeMapType } = {
    normal: {
        name: 'Normal',
    },
    splits: {
        name: 'Splits',
    },
    cfopTrainer: {
        name: 'CFOP Trainer',
        splitNames: ['Cross', 'F2L', 'OLL', 'PLL'],
    },
    yauTrainer: {
        name: 'Yau Trainer',
        splitNames: ['F2F', 'F3E', 'Faces', 'Edges', 'F2L', 'OLL', 'PLL'],
    },
    ollTrainer: {
        name: 'OLL Trainer',
    },
    pllTrainer: {
        name: 'PLL Trainer',
    },
};

export const areSessionsSame = (x: SolveData, y: SolveData) =>
    isEmpty(xorWith(x, y, isEqual)) && !(y.length === 0 && x.length === 0);

export default function SessionManagementComponent({
    sessionData,
    setSessionId,
    timerComponentRef,
    dispatchSolveData,
    suppressBestAlerts,
}: SessionManagementComponentProps) {
    const { openDialog } = useContext(DialogContext);
    const sessionNames = getSessionNamesFromLocalStorage();
    const sessionList = sessionNames.map((sesh) => sesh.id);

    return (
        <>
            <select
                className='timer__select timer__select-session'
                onChange={(event) => {
                    const newSessionId = event.target.value;
                    if (sessionData.id !== newSessionId) {
                        setSessionId(newSessionId);

                        const newSolveData = getSessionDataFromLocalStorage(newSessionId);
                        dispatchSolveData({
                            type: 'CHANGE_SESSION',
                            data: newSolveData.data,
                        });
                        suppressBestAlerts();
                        timerComponentRef.current && timerComponentRef.current.focus();
                    }
                }}
                value={sessionData.id}
            >
                {sessionNames.map((sesh, index) => {
                    return (
                        <option key={index} value={sesh.id}>
                            {sesh.name} ({sesh.type})
                        </option>
                    );
                })}
            </select>
            <div className='timer__session-actions'>
                <button
                    className='timer__button'
                    onClick={() => {
                        openDialog({
                            dialogType: DialogType.SESSION,
                            isOpen: true,
                        });
                    }}
                >
                    Edit Session
                </button>
                <button
                    className='timer__button'
                    onClick={() => {
                        let newSessionNum = sessionList.length + 1;
                        let newSessionId = `session${newSessionNum}`;

                        while (sessionList.includes(newSessionId)) {
                            newSessionNum++;
                            newSessionId = `session${newSessionNum}`;
                        }

                        saveSessionDataToLocalStorage({
                            id: newSessionId,
                            name: `Session ${newSessionNum}`,
                            type: '3x3x3',
                            sessionType: 'normal',
                            data: [],
                            numSplits: 1,
                        });
                        setSessionId(newSessionId);
                    }}
                >
                    New Session
                </button>
            </div>
        </>
    );
}
