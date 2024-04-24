import React, { createContext, useContext, useEffect, useState } from 'react';
import { DataType, DataTypeToTextMap, PuzzleType, PuzzleTypeValues } from '../../utils/cubingUtils';

import './SettingsView.scss';

const SETTINGS_CACHE_KEY = 'goodTimesSettings';

export type SolveSetting = {
    type: DataType;
    size: number;
};

const defaultSolveSettings = [
    {
        type: DataType.SINGLE,
        size: 1,
    },
    {
        type: DataType.MEAN,
        size: 3,
    },
    {
        type: DataType.AVERAGE,
        size: 5,
    },
    {
        type: DataType.AVERAGE,
        size: 12,
    },
    {
        type: DataType.AVERAGE,
        size: 100,
    },
];

type GoalSettings = {
    puzzleType: PuzzleType;
    singleGoal: number;
    averageGoal: number;
    meanGoal: number;
};

type CachedSettingsData = {
    isManualEntryMode: boolean;
    solveSettings: SolveSetting[];
    goalSettings: GoalSettings[];
};

type SettingsContextType = {
    isManualEntryMode: boolean;
    setIsManualEntryMode: (newValue: boolean) => void;
    solveSettings: SolveSetting[];
    setSolveSettings: (newValue: SolveSetting[]) => void;
    goalSettings: GoalSettings[];
    setGoalSettings: (newValue: GoalSettings[]) => void;
};
export const SettingsContext = createContext<SettingsContextType>({
    isManualEntryMode: false,
    setIsManualEntryMode: () => null,
    solveSettings: [],
    setSolveSettings: () => null,
    goalSettings: [],
    setGoalSettings: () => null,
});

export function SettingsContextProvider({ children }: { children: JSX.Element }) {
    const {
        isManualEntryMode: isManualEntryModeFromCache,
        solveSettings: solveSettingsFromCache,
        goalSettings: goalSettingsFromCache,
    } = getSettingsFromLocalStorage();
    const [isManualEntryMode, setIsManualEntryMode] = useState(isManualEntryModeFromCache);
    const [solveSettings, setSolveSettings] = useState(solveSettingsFromCache);
    const [goalSettings, setGoalSettings] = useState(goalSettingsFromCache ?? []);

    const settingsContextValue = {
        isManualEntryMode,
        setIsManualEntryMode,
        solveSettings,
        setSolveSettings,
        goalSettings,
        setGoalSettings,
    };
    return <SettingsContext.Provider value={settingsContextValue}>{children}</SettingsContext.Provider>;
}

export default function SettingsView() {
    const { isManualEntryMode, setIsManualEntryMode, solveSettings, setSolveSettings, goalSettings, setGoalSettings } =
        useContext(SettingsContext);

    const [solveSettingsString, setSolveSettingsString] = useState(getSolveSettingString(solveSettings));

    useEffect(() => {
        saveSettingsToLocalStorage({
            isManualEntryMode,
            solveSettings,
            goalSettings,
        });
    }, [isManualEntryMode, solveSettings, goalSettings]);

    return (
        <div className='timer__settings-view'>
            <div className='timer__settings-view-setting'>
                <label htmlFor='isManualEntryMode'>
                    <input
                        type='checkbox'
                        name='isManualEntryMode'
                        checked={isManualEntryMode}
                        onChange={() => {
                            setIsManualEntryMode(!isManualEntryMode);
                        }}
                    />
                    Manual Entry Mode
                </label>
            </div>
            <div className='timer__settings-view-setting'>
                <div>Score data to display</div>
                <input
                    type='text'
                    name='solveSettings'
                    className='timer__input'
                    value={solveSettingsString}
                    onChange={(event) => {
                        setSolveSettingsString(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.code === 'Enter') {
                            event.preventDefault();
                            const newSolveSettings = [
                                {
                                    type: DataType.SINGLE,
                                    size: 1,
                                },
                            ];
                            newSolveSettings.push(
                                ...solveSettingsString.split(' ').map((settingString) => {
                                    const type =
                                        settingString.slice(0, 2).toLowerCase() === 'ao'
                                            ? DataType.AVERAGE
                                            : DataType.MEAN;
                                    const size = parseInt(settingString.slice(2));

                                    return {
                                        type,
                                        size,
                                    };
                                }),
                            );
                            setSolveSettings(newSolveSettings);
                        }
                    }}
                />
            </div>
            {PuzzleTypeValues.map((puzzleType, index) => {
                const goalsForPuzzle = goalSettings.find((goal) => goal.puzzleType === puzzleType) ?? {
                    puzzleType: puzzleType as PuzzleType,
                    singleGoal: 0,
                    averageGoal: 0,
                    meanGoal: 0,
                };
                return (
                    <div key={index} className='timer__settings-view-setting'>
                        <h3>{puzzleType} Goals</h3>
                        <label htmlFor={`${puzzleType}SingleGoal`}>
                            Single Goal:
                            <input
                                type='text'
                                className='timer__input'
                                name={`${puzzleType}SingleGoal`}
                                value={goalsForPuzzle?.singleGoal}
                                onChange={(newValue) => {
                                    setGoalSettings([
                                        ...(goalSettings.filter((goal) => goal.puzzleType !== puzzleType) ?? []),
                                        {
                                            ...goalsForPuzzle,
                                            singleGoal: parseInt(newValue.target.value),
                                        },
                                    ]);
                                }}
                            />
                        </label>
                        <label htmlFor={`${puzzleType}AvverageGoal`}>
                            Ao5 Goal:
                            <input
                                type='text'
                                className='timer__input'
                                name={`${puzzleType}AvverageGoal`}
                                value={goalsForPuzzle?.averageGoal}
                                onChange={(newValue) => {
                                    setGoalSettings([
                                        ...(goalSettings.filter((goal) => goal.puzzleType !== puzzleType) ?? []),
                                        {
                                            ...goalsForPuzzle,
                                            averageGoal: parseInt(newValue.target.value),
                                        },
                                    ]);
                                }}
                            />
                        </label>
                        <label htmlFor={`${puzzleType}MeanGoal`}>
                            Mo3 Goal:
                            <input
                                type='text'
                                className='timer__input'
                                name={`${puzzleType}MeanGoal`}
                                value={goalsForPuzzle?.meanGoal}
                                onChange={(newValue) => {
                                    setGoalSettings([
                                        ...(goalSettings.filter((goal) => goal.puzzleType !== puzzleType) ?? []),
                                        {
                                            ...goalsForPuzzle,
                                            meanGoal: parseInt(newValue.target.value),
                                        },
                                    ]);
                                }}
                            />
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

export function getSettingsFromLocalStorage(): CachedSettingsData {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY) ?? 'null') as CachedSettingsData;
    return (
        dataFromLocalStorage ?? {
            isManualEntryMode: false,
            solveSettings: defaultSolveSettings,
        }
    );
}

function saveSettingsToLocalStorage(settings: CachedSettingsData) {
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
}

function getSolveSettingString(solveSettings: SolveSetting[]) {
    return solveSettings
        .filter((setting) => setting.size > 1)
        .map((setting) => {
            return `${DataTypeToTextMap[setting.type]}${setting.size}`;
        })
        .join(' ');
}
