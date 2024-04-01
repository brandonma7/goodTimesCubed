import React, { useContext } from 'react';
import { SolveData } from '../../components/GoodTimes';
import { calculateAverage, calculateMean, compareSolveTimes } from '../../utils/cubingUtils';
import { getFormattedTime, getFormattedTimeBySolve } from '../../utils/genericUtils';
import { DialogContext, DialogType } from '../UseDialogsContext';

import './MultiSolveDialog.scss';

export type MultiSolveDialogData = {
    dialogType: DialogType.MULTISOLVE;
    isOpen: boolean;
    index: number;
    size: number;
    isMean: boolean;
    solves: SolveData;
};

export default function MultiSolveDialog() {
    const { dialogData, closeDialog } = useContext(DialogContext);

    if (dialogData?.dialogType !== DialogType.MULTISOLVE || !dialogData.isOpen) {
        return <></>;
    }

    const { index, size = 3, isMean, solves } = dialogData;

    const title = `${isMean ? 'Mean of' : 'Average of'} ${size} for solves #${index - size + 2} - #${index + 1}`;
    const time = getFormattedTime(isMean ? calculateMean(solves, index, size) : calculateAverage(solves, index, size));

    const trimNum = Math.ceil(size * 0.05);
    const dataSlice = solves.slice(index + 1 - size, index + 1);
    const sortedDataSlice = dataSlice
        .map((solve, mapIndex) => {
            return {
                ...solve,
                index: mapIndex,
            };
        })
        .sort(compareSolveTimes);

    const trimmedIndexes = [
        ...sortedDataSlice.slice(0, trimNum),
        ...sortedDataSlice.slice(sortedDataSlice.length - trimNum),
    ].map((solve) => solve.index);

    const rows = dataSlice.map((solve, mapIndex) => {
        const isTrimmed = !isMean && trimmedIndexes.indexOf(mapIndex) !== -1;
        return (
            <tr key={mapIndex}>
                <td>{index + 2 - size + mapIndex}</td>
                <td>{`${isTrimmed ? '(' : ''}${getFormattedTimeBySolve(solve)}${isTrimmed ? ')' : ''}`}</td>
                <td>{solve.scramble}</td>
            </tr>
        );
    });

    return (
        <div
            className='timer__dialog timer__multi-solve-dialog'
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.code === 'Escape') {
                    event.preventDefault();
                    closeDialog();
                }
            }}
        >
            <div>{title}</div>
            <div className='timer__multi-solve-dialog-time'>{time}</div>
            <table className='timer__multi-solve-dialog-times'>
                <thead>
                    <tr>
                        <th>Solve</th>
                        <th>Time</th>
                        <th>Scramble</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>

            <div>
                <button
                    className='timer__button'
                    onClick={() => {
                        closeDialog();
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
