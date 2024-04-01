import React, { useContext } from 'react';
import { SettingsContext } from '../../dialogs/SettingsDialog';

import { BestsData, SolveData } from '../GoodTimes';

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

    switch (results.sessionType) {
        case 'splits':
            return (
                <SplitsResultsTable
                    results={results}
                    splitNames={[...Array.from({ length: results.numSplits ?? 1 })].map((_, index) => `${++index}`)}
                />
            );
        case 'cfopTrainer':
        case 'yauTrainer':
            return <SplitsResultsTable results={results} splitNames={SessionTypeMap[results.sessionType].splitNames} />;
        default:
            return <NormalResultsTable results={results} settings={solveSettings} />;
    }
}
