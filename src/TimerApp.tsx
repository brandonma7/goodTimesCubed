import React, { createContext, useState } from 'react';
import Timer from './components/Timer';

import './App.css';
import { SettingsContextProvider } from './dialogs/SettingsDialog';

type AlertContextType = {
    alerts: string[];
    pushAlert: (alert: string) => void;
    deleteAlert: (index: number) => void;
};
export const AlertsContext = createContext<AlertContextType>({
    alerts: [],
    pushAlert: () => null,
    deleteAlert: () => null,
});

function App() {
    const [alerts, setAlerts] = useState<string[]>([]);
    const pushAlert = (alert: string) => {
        if (alerts.at(-1) !== alert) {
            setAlerts([...alerts, alert]);
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
            <AlertsContext.Provider value={alertContextValue}>
                <Timer />
            </AlertsContext.Provider>
        </SettingsContextProvider>
    );
}

export default App;

/*
    TODO

    color scheme?
    
    CFOP trainer
        four splits
        select case for oll
        select case for pll
        display results by oll/pll

    OLL Trainer
    PL Trainer

    External timer connection (bluetooth or wired)

    More puzzles (at least WCA events)
        2x2
        4x4
        5x5
        6x6
        7x7

    Big technical shit:
        Store data to a db
*/
