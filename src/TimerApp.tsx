import React, { createContext, useState } from 'react';
import Timer from './components/Timer';

import './App.css';
import { SettingsContextProvider } from './dialogs/SettingsDialog';

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

type MetaDataContextType = {
    isMobile: boolean;
    setIsMobile: (newValue: boolean) => void;
};
export const MetaDataContext = createContext<MetaDataContextType>({
    isMobile: false,
    setIsMobile: () => null,
});
export function MetaDataContextProvider({ children }: { children: JSX.Element }) {
    const [isMobile, setIsMobile] = useState(false);

    const metaDataContextValue = { isMobile, setIsMobile };
    return <MetaDataContext.Provider value={metaDataContextValue}>{children}</MetaDataContext.Provider>;
}

function App() {
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
            setAlerts([]);
        }, 5000);
    };
    const deleteAlert = (index: number) => {
        const newAlerts = alerts.slice(0);
        newAlerts.splice(index, 1);
        setAlerts(newAlerts);
    };
    const alertContextValue = { alerts, pushAlert, deleteAlert };
    return (
        <SettingsContextProvider>
            <MetaDataContextProvider>
                <AlertsContext.Provider value={alertContextValue}>
                    <Timer />
                </AlertsContext.Provider>
            </MetaDataContextProvider>
        </SettingsContextProvider>
    );
}

export default App;

/*
    TODO

    P0

    P1
        Close dialog with ESC
        Restrict session settings based on puzzle type and if there are solves
        Warning confirmation when clearing/deleting sessions

    P2
        Goal mode for CFOP splits
        CFOP trainer
            select case for oll
            select case for pll
            display results by oll/pll

        OLL Trainer
        PLL Trainer
        PLL two side recognition trainer

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
