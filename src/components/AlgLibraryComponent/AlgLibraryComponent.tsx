import React, { useState } from 'react';
import { PuzzleType } from '../../utils/cubingUtils';
import { AlgSets } from '../CasePickerComponent';
import { ollCases } from '../CasePickerComponent/OllCases';
import { pllCases } from '../CasePickerComponent/PllCases';
import { SingleFaceVisualizationComponent } from '../CubeVisualizationComponent';

import './AlgLibraryComponent.scss';

type AlgLibraryEntry = {
    puzzleType: PuzzleType;
    algSets: AlgSets[];
};

const AlgLibrary: AlgLibraryEntry[] = [
    {
        puzzleType: '3x3x3',
        algSets: ['oll', 'pll'],
    },
];

const algSetMap = {
    oll: ollCases,
    pll: pllCases,
};

export default function AlgLibraryComponent() {
    const [selectedAlgSet, setSelectedAlgSet] = useState<AlgSets | null>(null);
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
                                        {algSet}
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
                            className='timer__button'
                            onClick={() => {
                                setSelectedAlgSet(sibling);
                            }}
                        >
                            {sibling}
                        </button>
                    );
                })}
            </div>
            {algSetMap[selectedAlgSet].map((caseGroup, index) => {
                return (
                    <div key={index}>
                        <h3>{caseGroup.name}</h3>
                        <table className='basic-table'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Case</th>
                                    <th>Algorithm</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {caseGroup.cases.map((algCase, caseIndex) => {
                                    return (
                                        <tr key={caseIndex}>
                                            <td className='alg-library__case-name'>{algCase.name}</td>
                                            <td className='alg-library__case-pic'>
                                                {
                                                    <SingleFaceVisualizationComponent
                                                        faceState={algCase.state}
                                                        puzzleType={selectedPuzzle}
                                                    />
                                                }
                                            </td>
                                            <td className='alg-library__case-alg'>
                                                {algCase?.algs?.map((alg, index) => {
                                                    return <div key={index}>{alg}</div>;
                                                }) ?? 'no algs lol'}
                                            </td>
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
