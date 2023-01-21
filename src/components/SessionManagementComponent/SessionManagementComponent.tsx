import React, { useContext } from 'react';
import { DialogContext, DialogType } from '../../dialogs/UseDialogsContext';
import { getSessionListFromLocalStorage, saveSessionDataToLocalStorage } from '../../utils/genericUtils';

import './SessionManagementComponent.scss';

type SessionManagementComponentProps = {
    sessionId: string;
    setSessionId: (newValue: string) => void;
};

export default function SessionManagementComponent({ sessionId, setSessionId }: SessionManagementComponentProps) {
    const { setDialogData } = useContext(DialogContext);
    const sessionList = getSessionListFromLocalStorage();

    return (
        <>
            <select
                className='timer__select timer__select-session'
                onChange={(event) => {
                    if (sessionId !== event.target.value) {
                        setSessionId(event.target.value);
                    }
                }}
                value={sessionId}
            >
                {sessionList.map((sessionId, index) => {
                    return (
                        <option key={index} value={sessionId}>
                            {sessionId}
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
                        let newSessionId = `Session ${newSessionNum}`;

                        while (sessionList.includes(newSessionId)) {
                            newSessionNum++;
                            newSessionId = `Session ${newSessionNum}`;
                        }

                        saveSessionDataToLocalStorage([], newSessionId);
                        setSessionId(newSessionId);
                    }}
                >
                    New Session
                </button>
            </div>
        </>
    );
}
