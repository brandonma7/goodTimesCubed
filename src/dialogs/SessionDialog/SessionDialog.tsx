import React, { useContext, useEffect, useState } from 'react';
import { SolveDataAction } from '../../components/Timer';
import { DialogContext, DialogType } from '../UseDialogsContext';
import { clearLocalStorageForSession, SessionData } from '../../utils/genericUtils';
import { PuzzleType, PuzzleTypeValues } from '../../utils/cubingUtils';

import './SessionDialog.scss';

export type SessionDialogData = {
    dialogType: DialogType.SESSION;
    isOpen: boolean;
};

type SessionDialogProps = {
    sessionData: SessionData;
    hideDeleteButton: boolean;
    onRenameSession: (name: string) => void;
    onChangeSessionType: (type: PuzzleType) => void;
    onClearSessionData: () => void;
    onDeleteSession: () => void;
    solveDispatcher: React.Dispatch<SolveDataAction>;
};

export default function SessionDialog({
    sessionData,
    hideDeleteButton,
    onRenameSession,
    onChangeSessionType,
    onClearSessionData,
    onDeleteSession,
    solveDispatcher,
}: SessionDialogProps): JSX.Element {
    const [newSessionIdName, setNewSessionIdName] = useState(sessionData.name);
    const [sessionType, setSessionType] = useState(sessionData.type);
    const { dialogData, closeDialog } = useContext(DialogContext);

    useEffect(() => {
        setNewSessionIdName(sessionData.name);
    }, [sessionData]);

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
                        onRenameSession(newSessionIdName);
                    }
                }}
            />
            <select
                className='timer__select'
                value={sessionType}
                onChange={(event) => {
                    if (event.target.value !== sessionData.type) {
                        setSessionType(event.target.value as PuzzleType);
                        onChangeSessionType(event.target.value as PuzzleType);
                    }
                }}
            >
                {PuzzleTypeValues.map((puzzle, index) => {
                    return (
                        <option key={index} value={puzzle}>
                            {puzzle}
                        </option>
                    );
                })}
            </select>
            {!hideDeleteButton && (
                <button
                    className='timer__button'
                    onClick={() => {
                        clearLocalStorageForSession(sessionData.id);
                        onDeleteSession();
                        closeDialog();
                    }}
                >
                    Delete Session
                </button>
            )}
            <button
                className='timer__button'
                onClick={() => {
                    onClearSessionData();
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
