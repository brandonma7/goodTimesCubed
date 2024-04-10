import React, { useContext, useMemo, useState } from 'react';
import { SettingsContext } from '../../dialogs/SettingsDialog';

import { BestsData, SolveData, SolveDataAction } from '../GoodTimes';

import './ResultsTableComponent.scss';
import { NormalResultsTable } from './tables/NormalResultsTable';
import { SplitsResultsTable } from './tables/SplitsResultsTable';
import { SessionType, SessionTypeMap } from '../SessionManagementComponent';
import SolveDetails from '../../dialogs/SolveDetails';
import { PuzzleType } from '../../utils/cubingUtils';
import MultiSolveDetails from '../../dialogs/MultiSolveDetails';

export type ResultsTableComponentProps = {
    solves: SolveData;
    bests: BestsData;
    sessionType: SessionType;
    numSplits: number;
    puzzleType: PuzzleType;
    solveDispatcher: React.Dispatch<SolveDataAction>;
    onAction: () => void;
};

export default function ResultsTableComponent(results: ResultsTableComponentProps): JSX.Element {
    const { solveSettings } = useContext(SettingsContext);
    const { solves, sessionType, puzzleType, solveDispatcher, onAction } = results;
    const [solveDetailsIndex, setSolveDetails] = useState(-1);

    const [solveDetailsSize, setSolveSize] = useState(1);
    const [isMean, setIsMean] = useState(false);

    const setSolveDetailsIndex = (value: number, size = 1, isMean = false) => {
        setSolveDetails(value === solveDetailsIndex && size === solveDetailsSize ? -1 : value);
        setSolveSize(size ?? 1);
        setIsMean(isMean);
    };

    const Table = useMemo(() => {
        switch (sessionType) {
            case 'splits':
                return (
                    <SplitsResultsTable
                        results={results}
                        splitNames={[...Array.from({ length: results.numSplits ?? 1 })].map((_, index) => `${++index}`)}
                        setSolveDetailsIndex={setSolveDetailsIndex}
                    />
                );
            case 'cfopTrainer':
            case 'yauTrainer':
                return (
                    <SplitsResultsTable
                        results={results}
                        splitNames={SessionTypeMap[sessionType].splitNames}
                        setSolveDetailsIndex={setSolveDetailsIndex}
                    />
                );
            default:
                return (
                    <NormalResultsTable
                        results={results}
                        settings={solveSettings}
                        setSolveDetailsIndex={setSolveDetailsIndex}
                    />
                );
        }
    }, [solves]);

    return (
        <>
            {solveDetailsIndex !== -1 && solveDetailsIndex < solves.length && (
                <>
                    {solveDetailsSize === 1 ? (
                        <SolveDetails
                            solve={solves[solveDetailsIndex]}
                            solveIndex={solveDetailsIndex}
                            puzzleType={puzzleType}
                            sessionType={sessionType}
                            solveDispatcher={solveDispatcher}
                            onAction={onAction}
                        />
                    ) : (
                        <MultiSolveDetails
                            solves={solves}
                            index={solveDetailsIndex}
                            size={solveDetailsSize}
                            isMean={isMean}
                        />
                    )}
                    <button
                        className='timer__button timer__close-solve-details'
                        onClick={() => {
                            setSolveDetailsIndex(-1);
                        }}
                    >
                        Close
                    </button>
                </>
            )}
            {Table}
        </>
    );
}
