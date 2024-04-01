import React, { createContext, useContext, useEffect, useState } from 'react';
import { DataType, DataTypeToTextMap } from '../../utils/cubingUtils';
import { DialogContext, DialogType } from '../UseDialogsContext';

import './SettingsDialog.scss';

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

type CachedSettingsData = {
    isManualEntryMode: boolean;
    solveSettings: SolveSetting[];
};

type SettingsContextType = {
    isManualEntryMode: boolean;
    setIsManualEntryMode: (newValue: boolean) => void;
    solveSettings: SolveSetting[];
    setSolveSettings: (newValue: SolveSetting[]) => void;
};
export const SettingsContext = createContext<SettingsContextType>({
    isManualEntryMode: false,
    setIsManualEntryMode: () => null,
    solveSettings: [],
    setSolveSettings: () => null,
});

export type SettingsDialogData = {
    dialogType: DialogType.SETTINGS;
    isOpen: boolean;
};

export function SettingsContextProvider({ children }: { children: JSX.Element }) {
    const { isManualEntryMode: isManualEntryModeFromCache, solveSettings: solveSettingsFromCache } =
        getSettingsFromLocalStorage();
    const [isManualEntryMode, setIsManualEntryMode] = useState(isManualEntryModeFromCache);
    const [solveSettings, setSolveSettings] = useState(solveSettingsFromCache);

    const settingsContextValue = { isManualEntryMode, setIsManualEntryMode, solveSettings, setSolveSettings };
    return <SettingsContext.Provider value={settingsContextValue}>{children}</SettingsContext.Provider>;
}

export default function SettingsDialog() {
    const { dialogData, closeDialog } = useContext(DialogContext);
    const { isManualEntryMode, setIsManualEntryMode, solveSettings, setSolveSettings } = useContext(SettingsContext);

    const [solveSettingsString, setSolveSettingsString] = useState(getSolveSettingString(solveSettings));

    useEffect(() => {
        saveSettingsToLocalStorage({
            isManualEntryMode,
            solveSettings,
        });
    }, [isManualEntryMode, solveSettings]);

    if (dialogData?.dialogType !== DialogType.SETTINGS || !dialogData?.isOpen) {
        return <></>;
    }

    return (
        <div
            className='timer__dialog timer__settings-dialog'
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.code === 'Escape') {
                    event.preventDefault();
                    closeDialog();
                }
            }}
        >
            <div className='timer__settings-dialog-setting'>
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
            <div className='timer__settings-dialog-setting'>
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
            <button className='timer__button' onClick={closeDialog}>
                Close
            </button>
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
