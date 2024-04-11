import React, { createContext, useState } from 'react';

import './App.css';
import GoodTimes from './components/GoodTimes';
import { SettingsContextProvider } from './dialogs/SettingsDialog';
import useDialogContext from './dialogs/UseDialogsContext';
// import { generateScramble } from './utils/cubingUtils';

type AlertContextType = {
    alerts: string[];
    pushAlert: (alert: string | string[]) => void;
    deleteAlert: (index: number) => void;
};
export const AlertsContext = createContext<AlertContextType>({
    alerts: [],
    pushAlert: () => null,
    deleteAlert: () => null,
});

function AlertsContextProvider({ children }: { children: JSX.Element }) {
    const [alerts, setAlerts] = useState<string[]>([]);

    let alertTimeout: NodeJS.Timeout;
    const pushAlert = (alert: string | string[]) => {
        if (Array.isArray(alert)) {
            setAlerts(alert);
        } else {
            setAlerts([alert]);
        }
        clearTimeout(alertTimeout);
        alertTimeout = setTimeout(() => {
            // TODO this is causing a big re-render, clearing out timer time data *thinking face*
            setAlerts([]);
        }, 5000);
    };
    const deleteAlert = (index: number) => {
        const newAlerts = alerts.slice(0);
        newAlerts.splice(index, 1);
        setAlerts(newAlerts);
    };

    const alertContextValue = { alerts, pushAlert, deleteAlert };
    return <AlertsContext.Provider value={alertContextValue}>{children}</AlertsContext.Provider>;
}

type MetaDataContextType = {
    isMobile: boolean;
    setIsMobile: (newValue: boolean) => void;
    timerIsRunning: boolean;
    setTimerIsRunning: (newValue: boolean) => void;
};
export const MetaDataContext = createContext<MetaDataContextType>({
    isMobile: false,
    setIsMobile: () => null,
    timerIsRunning: false,
    setTimerIsRunning: () => null,
});
export function MetaDataContextProvider({ children }: { children: JSX.Element }) {
    const [isMobile, setIsMobile] = useState(false);
    const [timerIsRunning, setTimerIsRunning] = useState(false);

    const metaDataContextValue = { isMobile, setIsMobile, timerIsRunning, setTimerIsRunning };
    return <MetaDataContext.Provider value={metaDataContextValue}>{children}</MetaDataContext.Provider>;
}

export default function AppRoot() {
    //const [scramble, setScramble] = useState<string>(generateScramble('3x3x3'));
    console.log('App');

    const DialogContextProvider = useDialogContext();
    return (
        <SettingsContextProvider>
            <MetaDataContextProvider>
                <AlertsContextProvider>
                    <DialogContextProvider>
                        <GoodTimes />
                    </DialogContextProvider>
                </AlertsContextProvider>
            </MetaDataContextProvider>
        </SettingsContextProvider>
    );
}

/*
    TODO

    P0

    P1
        Comp mode (ao5 groups)
        Restrict session settings based on puzzle type and if there are solves
        Warning confirmation when clearing/deleting sessions

    P2
        Goal mode for CFOP splits

        OLL Trainer
        PLL Trainer
        PLL two side recognition trainer (with difficulty levels!)

    P3
        Make skip logic more generic instead of hard-coding oll/pll
        External timer connection (bluetooth or wired)

        More puzzles visualizations
            [ ] Pyraminx
            [ ] Skewb
            [ ] Square-1
            [ ] Megaminx
            [ ] Clock

    P4
        custom scrambles
        color scheme?

    Big technical shit:
        Store data to a db
*/
