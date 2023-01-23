import React, { createContext, useState } from 'react';
import { SolveDialogData } from './SolveDialog';
import { MultiSolveDialogData } from './MultiSolveDialog';
import { SessionDialogData } from './SessionDialog';
import { SettingsDialogData } from './SettingsDialog';
import { InsightsDialogData } from './InsightsDialog';

export enum DialogType {
    SOLVE,
    MULTISOLVE,
    SETTINGS,
    SESSION,
    INSIGHTS,
}

type DialogContextType = {
    dialogData: DialogData;
    setDialogData: React.Dispatch<React.SetStateAction<DialogData>>;
    closeDialog: () => void;
};

export type DialogData =
    | SolveDialogData
    | MultiSolveDialogData
    | SessionDialogData
    | SettingsDialogData
    | InsightsDialogData;

export const DialogContext = createContext<DialogContextType>({
    dialogData: {
        dialogType: DialogType.SETTINGS,
        isOpen: false,
    },
    setDialogData: () => null,
    closeDialog: () => null,
});

export default function useDialogContext() {
    const [dialogData, setDialogData] = useState<DialogData>({
        dialogType: DialogType.SETTINGS,
        isOpen: false,
    });
    const closeDialog = () =>
        setDialogData({
            dialogType: DialogType.SETTINGS,
            isOpen: false,
        });
    const dialogContextValue = { dialogData, setDialogData, closeDialog };

    function DialogContextProvider({ children }: { children: JSX.Element }) {
        return <DialogContext.Provider value={dialogContextValue}>{children}</DialogContext.Provider>;
    }

    return DialogContextProvider;
}
