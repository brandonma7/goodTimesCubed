import React, { useContext } from 'react';
import { SettingsContext } from '../../dialogs/SettingsDialog';
import { DialogContext } from '../../dialogs/UseDialogsContext';

import { BestsData, SolveData } from '../Timer';

import './ResultsTableComponent.scss';
import { NormalResultsTable } from './tables/NormalResultsTable';
import { SplitsResultsTable } from './tables/SplitsResultsTable';
import { SessionType, SessionTypeMap } from '../SessionManagementComponent';

export type ResultsTableComponentProps = {
    solves: SolveData;
    bests: BestsData;
    sessionType: SessionType;
    numSplits: number;
};

export default function ResultsTableComponent(results: ResultsTableComponentProps): JSX.Element {
    const { solveSettings } = useContext(SettingsContext);
    const { setDialogData } = useContext(DialogContext);

    switch (results.sessionType) {
        case 'splits':
            return (
                <SplitsResultsTable
                    results={results}
                    splitNames={[...Array.from({ length: results.numSplits ?? 1 })].map((_, index) => `${++index}`)}
                    setDialogData={setDialogData}
                />
            );
        case 'cfopTrainer':
        case 'yauTrainer':
            return (
                <SplitsResultsTable
                    results={results}
                    splitNames={SessionTypeMap[results.sessionType].splitNames}
                    setDialogData={setDialogData}
                />
            );
        default:
            return <NormalResultsTable results={results} settings={solveSettings} setDialogData={setDialogData} />;
    }
}
