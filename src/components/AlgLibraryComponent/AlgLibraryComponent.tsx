import React, { useState } from 'react';
import { PuzzleType } from '../../utils/cubingUtils';
import { AlgSets, CaseGroup } from '../CasePickerComponent';
import { ollCases } from '../../utils/cases/3x3x3/oll';
import { pllCases } from '../../utils/cases/3x3x3/pll';
import { ortegaCases } from '../../utils/cases/2x2x2/ortega';
import { SingleFaceVisualizationComponent } from '../CubeVisualizationComponent';

import './AlgLibraryComponent.scss';
import { ohCases } from '../../utils/cases/3x3x3/oh';
import { classNames } from '../../utils/genericUtils';

type AlgEntryData = {
    type: AlgSets;
    hideCasePic?: boolean;
    hideAuf?: boolean;
};

type AlgLibraryEntry = {
    puzzleType: PuzzleType;
    algSets: AlgEntryData[];
};

const AlgLibrary: AlgLibraryEntry[] = [
    {
        puzzleType: '3x3x3',
        algSets: [
            {
                type: 'oll',
                hideAuf: true,
            },
            {
                type: 'pll',
            },
            {
                type: 'oh',
            },
        ],
    },
    {
        puzzleType: '2x2x2',
        algSets: [
            {
                type: 'ortega',
                hideCasePic: true,
            },
            {
                type: 'coll',
            },
            {
                type: 'eg1',
            },
            {
                type: 'eg2',
            },
        ],
    },
    {
        puzzleType: '4x4x4',
        algSets: [
            {
                type: 'parity',
                hideAuf: true,
            },
        ],
    },
];

const algSetMap: {
    [k in AlgSets]: CaseGroup;
} = {
    oll: ollCases,
    pll: pllCases,
    oh: ohCases,
    ortega: ortegaCases,
    coll: [],
    eg1: [],
    eg2: [],
    parity: [],
};

export default function AlgLibraryComponent() {
    const [selectedAlgSet, setSelectedAlgSet] = useState<AlgEntryData | null>(null);
    const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleType | null>(null);

    const algSiblings =
        selectedPuzzle != null ? AlgLibrary.find((entry) => entry.puzzleType === selectedPuzzle)?.algSets : null;

    return selectedAlgSet === null || selectedPuzzle === null ? (
        <div className='basic-page-container'>
            <h2>Algorithm Library</h2>
            {AlgLibrary.map((entry, index) => {
                return (
                    <div key={index}>
                        <h3>{entry.puzzleType}</h3>
                        <div>
                            {entry.algSets.map((algSet, algSetIndex) => {
                                return (
                                    <button
                                        key={algSetIndex}
                                        className='timer__button'
                                        onClick={() => {
                                            setSelectedAlgSet(algSet);
                                            setSelectedPuzzle(entry.puzzleType);
                                        }}
                                    >
                                        {algSet.type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    ) : (
        <div className='alg-library'>
            <div>
                <button
                    className='timer__button'
                    onClick={() => {
                        setSelectedAlgSet(null);
                        setSelectedPuzzle(null);
                    }}
                >
                    Back
                </button>
                {algSiblings?.map((sibling, algSetIndex) => {
                    return (
                        <button
                            key={algSetIndex}
                            className={classNames(
                                'timer__button',
                                sibling.type === selectedAlgSet.type ? 'timer__button--active' : '',
                            )}
                            onClick={() => {
                                setSelectedAlgSet(sibling);
                            }}
                        >
                            {sibling.type}
                        </button>
                    );
                })}
            </div>
            {algSetMap[selectedAlgSet.type].map((caseGroup, index) => {
                return (
                    <div key={index}>
                        <h3>{caseGroup.name}</h3>
                        <table className='basic-table'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    {!selectedAlgSet.hideCasePic && <th>Case</th>}
                                    <th>Algorithm</th>
                                    {!selectedAlgSet.hideAuf && <th>AUF</th>}
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {caseGroup.cases.map((algCase, caseIndex) => {
                                    return (
                                        <tr key={caseIndex}>
                                            <td className='alg-library__case-name'>{algCase.name}</td>

                                            {!selectedAlgSet.hideCasePic && (
                                                <td className='alg-library__case-pic'>
                                                    {
                                                        <SingleFaceVisualizationComponent
                                                            faceState={algCase.state}
                                                            puzzleType={selectedPuzzle}
                                                        />
                                                    }
                                                </td>
                                            )}
                                            <td className='alg-library__case-alg'>
                                                {algCase?.algs?.map((alg, index) => {
                                                    return <div key={index}>{alg}</div>;
                                                }) ?? 'no algs lol'}
                                            </td>
                                            {!selectedAlgSet.hideAuf && (
                                                <td className='alg-library__case-alg'>
                                                    {algCase?.auf?.map((auf, index) => {
                                                        return <div key={index}>{auf}</div>;
                                                    }) ?? 'no auf lol'}
                                                </td>
                                            )}
                                            <td className='alg-library__case-alg'>
                                                {algCase?.algNotes?.map((note, index) => {
                                                    return <div key={index}>{note}</div>;
                                                }) ?? ''}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}
