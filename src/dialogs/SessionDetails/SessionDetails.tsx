import React, { useEffect, useState } from 'react';
import { SolveDataAction } from '../../components/GoodTimes';
import { SessionData, SessionType, SessionTypeMap } from '../../components/SessionManagementComponent';
import { clearLocalStorageForSession, saveSessionDataToLocalStorage } from '../../utils/genericUtils';
import { PuzzleType, PuzzleTypeValues, NonStandardPuzzles } from '../../utils/cubingUtils';

import './SessionDetails.scss';

type SessionDetailsProps = {
    sessionData: SessionData;
    noSolves: boolean;
    hideDeleteButton: boolean;
    onClearSessionData: () => void;
    onDeleteSession: () => void;
    solveDispatcher: React.Dispatch<SolveDataAction>;
    close: () => void;
};

export default function SessionDetails({
    sessionData,
    noSolves,
    hideDeleteButton,
    onClearSessionData,
    onDeleteSession,
    solveDispatcher,
    close,
}: SessionDetailsProps): JSX.Element {
    const [newSessionIdName, setNewSessionIdName] = useState(sessionData.name);
    const [puzzleType, setPuzzleType] = useState(sessionData.type);
    const [sessionType, setSessionType] = useState(sessionData.sessionType);
    const [sessionNumSplits, setSessionNumSplits] = useState(sessionData.numSplits ?? 1);
    const [isTryingToClearSession, setIsTryingToClearSession] = useState(false);
    const [isTryingToDeleteSession, setIsTryingToDeleteSession] = useState(false);

    useEffect(() => {
        setNewSessionIdName(sessionData.name);
    }, [sessionData]);

    if (sessionData == null) {
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
        <>
            <div className='timer__dialog-overlay' onClick={close}></div>
            <div className='timer__dialog timer__session-details'>
                <input
                    className='timer__input'
                    type='text'
                    value={newSessionIdName}
                    onChange={(event) => {
                        setNewSessionIdName(event.target.value);
                    }}
                />
                {noSolves ? (
                    <>
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
                    </>
                ) : (
                    <p>
                        {puzzleType} - {SessionTypeMap[sessionType as SessionType].name}
                        {sessionType === 'splits' && ` ${sessionNumSplits}`}
                    </p>
                )}

                {isTryingToDeleteSession ? (
                    <>
                        <button
                            className='timer__button'
                            onClick={async () => {
                                setIsTryingToDeleteSession(false);
                            }}
                        >
                            Nevermind!
                        </button>
                        <button
                            className='timer__button'
                            onClick={async () => {
                                clearLocalStorageForSession(sessionData.id);
                                onDeleteSession();
                                setIsTryingToDeleteSession(false);
                                close();
                            }}
                        >
                            Confirm Delete
                        </button>
                    </>
                ) : (
                    !hideDeleteButton && (
                        <button
                            className='timer__button'
                            onClick={() => {
                                setIsTryingToDeleteSession(true);
                            }}
                        >
                            Delete Session
                        </button>
                    )
                )}

                <button
                    className='timer__button'
                    onClick={() => {
                        saveSessionDataToLocalStorage({
                            id: sessionData.id,
                            data: sessionData.data,
                            name: newSessionIdName,
                            sessionType,
                            numSplits: sessionNumSplits,
                            type: puzzleType,
                        });

                        solveDispatcher({
                            type: 'REFRESH',
                        });
                        close();
                    }}
                >
                    Save
                </button>
                {isTryingToClearSession ? (
                    <>
                        <button
                            className='timer__button'
                            onClick={async () => {
                                setIsTryingToClearSession(false);
                            }}
                        >
                            Nevermind!
                        </button>
                        <button
                            className='timer__button'
                            onClick={async () => {
                                onClearSessionData();
                                solveDispatcher({ type: 'CLEAR_DATA' });
                                setIsTryingToClearSession(false);
                            }}
                        >
                            Confirm Clear
                        </button>
                    </>
                ) : (
                    <button
                        className='timer__button'
                        onClick={() => {
                            setIsTryingToClearSession(true);
                        }}
                    >
                        Clear Session Data
                    </button>
                )}
            </div>
        </>
    );
}
