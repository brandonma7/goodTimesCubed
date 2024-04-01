import React, { useContext, useEffect, useState } from 'react';
import { SolveDataAction } from '../../components/GoodTimes';
import { SessionData, SessionType, SessionTypeMap } from '../../components/SessionManagementComponent';
import { DialogContext, DialogType } from '../UseDialogsContext';
import { clearLocalStorageForSession } from '../../utils/genericUtils';
import { PuzzleType, PuzzleTypeValues, NonStandardPuzzles } from '../../utils/cubingUtils';

import './SessionDialog.scss';

export type SessionDialogData = {
    dialogType: DialogType.SESSION;
    isOpen: boolean;
};

type SessionDialogProps = {
    sessionData: SessionData;
    hideDeleteButton: boolean;
    onUpdateSessionData: (newData: SessionData) => void;
    onClearSessionData: () => void;
    onDeleteSession: () => void;
    solveDispatcher: React.Dispatch<SolveDataAction>;
};

export default function SessionDialog({
    sessionData,
    hideDeleteButton,
    onUpdateSessionData,
    onClearSessionData,
    onDeleteSession,
    solveDispatcher,
}: SessionDialogProps): JSX.Element {
    const [newSessionIdName, setNewSessionIdName] = useState(sessionData.name);
    const [puzzleType, setPuzzleType] = useState(sessionData.type);
    const [sessionType, setSessionType] = useState(sessionData.sessionType);
    const [sessionNumSplits, setSessionNumSplits] = useState(sessionData.numSplits ?? 1);
    const { dialogData, closeDialog } = useContext(DialogContext);

    useEffect(() => {
        setNewSessionIdName(sessionData.name);
    }, [sessionData]);

    if (dialogData?.dialogType !== DialogType.SESSION || !dialogData?.isOpen) {
        return <></>;
    }

    const seshSelector = (
        <select
            className='timer__select'
            value={sessionType}
            onChange={(event) => {
                if (event.target.value !== sessionData.type) {
                    const seshType = event.target.value as SessionType;
                    setSessionType(seshType);
                    setSessionNumSplits(SessionTypeMap[seshType].splitNames?.length ?? 1);
                }
            }}
        >
            {Object.keys(SessionTypeMap).map((seshType, index) => {
                return (
                    <option key={index} value={seshType}>
                        {SessionTypeMap[seshType as SessionType].name}
                    </option>
                );
            })}
        </select>
    );

    return (
        <div
            className='timer__dialog timer__session-dialog'
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
            />
            <select
                className='timer__select'
                value={puzzleType}
                onChange={(event) => {
                    if (event.target.value !== sessionData.type) {
                        setPuzzleType(event.target.value as PuzzleType);
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
            {!NonStandardPuzzles.includes(puzzleType) &&
                (sessionType === 'splits' ? (
                    <div className='timer__splits-input'>
                        {seshSelector}
                        <input
                            className='timer__input'
                            type='number'
                            min='1'
                            max='5'
                            value={sessionNumSplits}
                            onChange={(event) => {
                                setSessionNumSplits(parseInt(event.target.value));
                            }}
                        />
                    </div>
                ) : (
                    seshSelector
                ))}
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
                    onUpdateSessionData({
                        id: sessionData.id,
                        data: sessionData.data,
                        name: newSessionIdName,
                        sessionType,
                        numSplits: sessionNumSplits,
                        type: puzzleType,
                    });
                    closeDialog();
                }}
            >
                Save
            </button>
            <button className='timer__button' onClick={closeDialog}>
                Cancel
            </button>
            <button
                className='timer__button'
                onClick={() => {
                    onClearSessionData();
                    solveDispatcher({ type: 'CLEAR_DATA' });
                }}
            >
                Clear Session Data
            </button>
        </div>
    );
}
