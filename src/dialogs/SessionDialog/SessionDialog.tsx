import React, { useContext, useEffect, useState } from 'react';
import { SolveDataAction } from '../../components/Timer';
import { DialogContext, DialogType } from '../UseDialogsContext';
import { clearLocalStorageForSession } from '../../utils/genericUtils';

import './SessionDialog.scss';

export type SessionDialogData = {
    dialogType: DialogType.SESSION;
    isOpen: boolean;
};

type SessionDialogProps = {
    sessionId: string;
    onRenameSession: (name: string) => void;
    onDeleteSession: () => void;
    solveDispatcher: React.Dispatch<SolveDataAction>;
};

export default function SessionDialog({
    sessionId,
    onRenameSession,
    onDeleteSession,
    solveDispatcher,
}: SessionDialogProps): JSX.Element {
    const [newSessionIdName, setNewSessionIdName] = useState(sessionId);
    const { dialogData, closeDialog } = useContext(DialogContext);

    useEffect(() => {
        setNewSessionIdName(sessionId);
    }, [sessionId]);

    if (dialogData?.dialogType !== DialogType.SESSION || !dialogData?.isOpen) {
        return <></>;
    }

    return (
        <div
            className='timer__session-dialog'
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.code === 'Escape') {
                    event.preventDefault();
                    closeDialog();
                }
            }}
        >
            <input
                className='timer__input'
                type='text'
                value={newSessionIdName}
                onChange={(event) => {
                    setNewSessionIdName(event.target.value);
                }}
                onKeyDown={(event) => {
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        const oldSessionId = sessionId;
                        onRenameSession(newSessionIdName);
                        clearLocalStorageForSession(oldSessionId);
                    }
                }}
            />
            <button
                className='timer__button'
                onClick={() => {
                    clearLocalStorageForSession(sessionId);
                    onDeleteSession();
                    closeDialog();
                }}
            >
                Delete Session
            </button>
            <button
                className='timer__button'
                onClick={() => {
                    solveDispatcher({ type: 'CLEAR_DATA' });
                }}
            >
                Clear Session Data
            </button>
            <button className='timer__button' onClick={closeDialog}>
                Close
            </button>
        </div>
    );
}
