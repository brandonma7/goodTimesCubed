import React, { useContext } from 'react';
import { DialogContext, DialogType } from '../../dialogs/UseDialogsContext';
import { getSessionNamesFromLocalStorage, saveSessionDataToLocalStorage, SessionData } from '../../utils/genericUtils';

import './SessionManagementComponent.scss';

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
