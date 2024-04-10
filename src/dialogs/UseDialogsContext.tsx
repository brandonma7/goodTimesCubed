import React, { createContext, useCallback, useMemo, useState } from 'react';
import { SessionDialogData } from './SessionDialog';
import SettingsDialog, { SettingsDialogData } from './SettingsDialog';
import { InsightsDialogData } from './InsightsDialog';

export enum DialogType {
    SOLVE,
    SETTINGS,
    SESSION,
    INSIGHTS,
}

export type SetDialogDataType = React.Dispatch<React.SetStateAction<DialogData>>;

type DialogContextType = {
    dialogData: DialogData;
    openDialog: (dialogData: DialogData) => void;
    closeDialog: () => void;
};

export type DialogData = SessionDialogData | SettingsDialogData | InsightsDialogData;

export const DialogContext = createContext<DialogContextType>({
    dialogData: {
        dialogType: DialogType.SETTINGS,
        isOpen: false,
    },
    openDialog: () => null,
    closeDialog: () => null,
});

export default function useDialogContext() {
    const [dialogData, setDialogData] = useState<DialogData>({
        dialogType: DialogType.SETTINGS,
        isOpen: false,
    });

    const openDialog = useCallback((dialogData: DialogData) => {
        setDialogData({
            ...dialogData,
            isOpen: true,
        });
    }, []);

    const closeDialog = useCallback(() => {
        setDialogData({
            dialogType: DialogType.SETTINGS,
            isOpen: false,
        });
        const timerElement = document.querySelector('.timer__time-input') ?? document.querySelector('.timer__timer');
        if (timerElement) {
            (timerElement as HTMLElement).focus();
        }
    }, []);
    const dialogContextValue = useMemo(
        () => ({ dialogData, openDialog, closeDialog }),
        [dialogData, openDialog, closeDialog],
    );

    function DialogContextProvider({ children }: { children: JSX.Element }) {
        return (
            <DialogContext.Provider value={dialogContextValue}>
                {children}
                <SettingsDialog />
            </DialogContext.Provider>
        );
    }

    return DialogContextProvider;
}
