import React, { useContext } from 'react';
import { DialogContext, DialogType } from '../../dialogs/UseDialogsContext';
import { getSessionNamesFromLocalStorage, saveSessionDataToLocalStorage } from '../../utils/genericUtils';

import './SessionManagementComponent.scss';
import { SolveData } from '../Timer';
import { isEmpty, isEqual, xorWith } from 'lodash';
import { PuzzleType } from '../../utils/cubingUtils';

type SessionManagementComponentProps = {
    sessionData: SessionData;
    setSessionId: (newValue: string) => void;
};

export default function SessionManagementComponent({ sessionData, setSessionId }: SessionManagementComponentProps) {
    const { setDialogData } = useContext(DialogContext);
    const sessionNames = getSessionNamesFromLocalStorage();
    const sessionList = sessionNames.map((sesh) => sesh.id);

    return (
        <>
            <select
                className='timer__select timer__select-session'
                onChange={(event) => {
                    if (sessionData.id !== event.target.value) {
                        setSessionId(event.target.value);
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
                        setDialogData({
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

export const areSessionsSame = (x: SolveData, y: SolveData) =>
    isEmpty(xorWith(x, y, isEqual)) && !(y.length === 0 && x.length === 0);

export type SessionType = 'normal' | 'splits' | 'cfopTrainer' | 'yauTrainer';
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

export const SessionTypeMap = {
    normal: {
        name: 'Normal',
        splitNames: null,
    },
    splits: {
        name: 'Splits',
        splitNames: null,
    },
    cfopTrainer: {
        name: 'CFOP Trainer',
        splitNames: ['Cross', 'F2L', 'OLL', 'PLL'],
    },
    yauTrainer: {
        name: 'Yau Trainer',
        splitNames: ['F2F', 'F3E', 'Faces', 'Edges', 'F2L', 'OLL', 'PLL'],
    },
};
