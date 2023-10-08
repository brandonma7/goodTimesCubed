import React, { useContext } from 'react';
import { SettingsContext } from '../../dialogs/SettingsDialog';
import { DialogContext } from '../../dialogs/UseDialogsContext';

import { BestsData, SolveData } from '../Timer';

import './ResultsTableComponent.scss';
import { NormalResultsTable, NormalResultsTableProps } from './tables/NormalResultsTable';
import { SessionType } from '../../utils/genericUtils';

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
                    numSplits={results.numSplits}
                    settings={solveSettings}
                    setDialogData={setDialogData}
                />
            );
        case 'cfopTrainer':
            return <CFOPTrainerResultsTable results={results} settings={solveSettings} setDialogData={setDialogData} />;
        case 'yauTrainer':
            return <YauTrainerResultsTable results={results} settings={solveSettings} setDialogData={setDialogData} />;
        default:
            return <NormalResultsTable results={results} settings={solveSettings} setDialogData={setDialogData} />;
    }
}

type SplitsTableProps = NormalResultsTableProps & {
    numSplits: number;
};

function SplitsResultsTable({ results, numSplits }: SplitsTableProps): JSX.Element {
    const { solves } = results;
    const columnsArray = [...Array.from({ length: numSplits })].map((_, index) => `${++index}`);
    return solves?.length ? (
        <>{results.sessionType}</>
    ) : (
        <table className='timer__results'>
            {getSplitsTableHeader(columnsArray)}
            <tbody>
                <tr>
                    <td>-</td>
                    {columnsArray.map((column) => (
                        <td key={column}>-</td>
                    ))}
                    <td>-</td>
                </tr>
            </tbody>
        </table>
    );
}

function getSplitsTableHeader(titles: string[]): JSX.Element {
    return (
        <thead>
            <tr>
                <th></th>
                {titles.map((name) => {
                    return <th key={name}>{name}</th>;
                })}
                <th>Total</th>
            </tr>
        </thead>
    );
}

const CFOP_TRAINER_SETTINGS = ['Cross', 'F2L', 'OLL', 'PLL'];
function CFOPTrainerResultsTable({ results }: NormalResultsTableProps): JSX.Element {
    const { solves } = results;

    return solves?.length ? (
        <>{results.sessionType}</>
    ) : (
        <table className='timer__results'>
            {getSplitsTableHeader(CFOP_TRAINER_SETTINGS)}
            <tbody>
                <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            </tbody>
        </table>
    );
}

const YAU_TRAINER_SETTINGS = ['F2F', 'F3E', 'Faces', 'Edges', 'F2L', 'OLL', 'PLL'];
function YauTrainerResultsTable({ results }: NormalResultsTableProps): JSX.Element {
    const { solves } = results;
    return solves?.length ? (
        <>{results.sessionType}</>
    ) : (
        <table className='timer__results'>
            {getSplitsTableHeader(YAU_TRAINER_SETTINGS)}
            <tbody>
                <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            </tbody>
        </table>
    );
}
