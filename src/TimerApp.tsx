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
    const pushAlert = (alert: string | string[]) => {
        if (Array.isArray(alert)) {
            setAlerts(alert);
        } else {
            setAlerts([alert]);
        }
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

    bugs:

    color scheme?
    
    CFOP trainer
        four splits
        select case for oll
        select case for pll
        display results by oll/pll

    OLL Trainer
    PLL Trainer
    PLL two side recognition trainer

    External timer connection (bluetooth or wired)

    More puzzles visualizations
        [ ] Pyraminx
        [ ] Skewb
        [ ] Square-1
        [ ] Megaminx
        [ ] Clock

    Big technical shit:
        Store data to a db
*/
