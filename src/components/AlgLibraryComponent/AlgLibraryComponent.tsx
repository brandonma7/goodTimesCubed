import React, { useState } from 'react';
import { PuzzleType } from '../../utils/cubingUtils';
import { AlgSetNamesMap, AlgSets, CaseGroup } from '../CasePickerComponent';
import { ollCases } from '../../utils/cases/3x3x3/oll';
import { pllCases } from '../../utils/cases/3x3x3/pll';
import { ortegaCases } from '../../utils/cases/2x2x2/ortega';
import CubeVisualizationComponent, { SingleFaceVisualizationComponent } from '../CubeVisualizationComponent';

import './AlgLibraryComponent.scss';
import { ohCases } from '../../utils/cases/3x3x3/oh';
import { classNames } from '../../utils/genericUtils';
import { bldM2Cases } from '../../utils/cases/3x3x3/bldm2';
import { fourBldCases } from '../../utils/cases/4x4x4/4bld';

type AlgEntryData = {
    type: AlgSets;
    hideCasePic?: boolean;
    showFullPic?: boolean;
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
            {
                type: 'bldm2',
                hideAuf: true,
                showFullPic: true,
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
            {
                type: 'fourBld',
                showFullPic: true,
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
    bldm2: bldM2Cases,
    fourBld: fourBldCases,
    coll: [],
    eg1: [],
    eg2: [],
    parity: [],
};

export default function AlgLibraryComponent({ isMobile }: { isMobile: boolean }): JSX.Element {
    const [selectedAlgSet, setSelectedAlgSet] = useState<AlgEntryData | null>(null);
    const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleType | null>(null);

    const algSiblings =
        selectedPuzzle != null ? AlgLibrary.find((entry) => entry.puzzleType === selectedPuzzle)?.algSets : null;

    return selectedAlgSet === null || selectedPuzzle === null ? (
        <div className='alg-library basic-page-container'>
            <h1>Algorithm Library</h1>
            {AlgLibrary.map((entry, index) => {
                return (
                    <div key={index}>
                        <h2>{entry.puzzleType}</h2>
                        <div>
                            {entry.algSets.map((algSet, algSetIndex) => {
                                return (
                                    <button
                                        key={algSetIndex}
                                        className='timer__button alg-library-type-button'
                                        onClick={() => {
                                            setSelectedAlgSet(algSet);
                                            setSelectedPuzzle(entry.puzzleType);
                                        }}
                                    >
                                        {AlgSetNamesMap[algSet.type]}
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
                    className='timer__button alg-library-type-button'
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
                                'timer__button alg-library-type-button',
                                sibling.type === selectedAlgSet.type ? 'timer__button--active' : '',
                            )}
                            onClick={() => {
                                setSelectedAlgSet(sibling);
                            }}
                        >
                            {AlgSetNamesMap[sibling.type]}
                        </button>
                    );
                })}
            </div>
            {algSetMap[selectedAlgSet.type].map((caseGroup, index) => {
                return (
                    <div key={index}>
                        <h2>{caseGroup.name}</h2>
                        <table className='basic-table'>
                            <thead>
                                {!isMobile ? (
                                    <tr>
                                        <th>Name</th>
                                        {!selectedAlgSet.hideCasePic && <th>Case</th>}
                                        <th>Algorithm</th>
                                        {!selectedAlgSet.hideAuf && <th>AUF</th>}
                                        <th>Notes</th>
                                    </tr>
                                ) : (
                                    <>
                                        <tr>
                                            <th>Name</th>
                                            {!selectedAlgSet.hideCasePic && <th>Case</th>}
                                        </tr>
                                        <tr>
                                            <th colSpan={2}>Algorithm</th>
                                        </tr>
                                        <tr>{!selectedAlgSet.hideAuf && <th colSpan={2}>AUF</th>}</tr>
                                        <tr>
                                            <th colSpan={2}>Notes</th>
                                        </tr>
                                    </>
                                )}
                            </thead>
                            <tbody>
                                {caseGroup.cases.map((algCase, caseIndex) => {
                                    return !isMobile ? (
                                        <tr key={caseIndex}>
                                            <td className='alg-library__case-name'>{algCase.name}</td>

                                            {!selectedAlgSet.hideCasePic && (
                                                <td className='alg-library__case-pic'>
                                                    {selectedAlgSet.showFullPic ? (
                                                        <>
                                                            <CubeVisualizationComponent
                                                                puzzleType={selectedPuzzle}
                                                                state={algCase.state}
                                                                width={200}
                                                                height={150}
                                                                clickable={false}
                                                            />
                                                        </>
                                                    ) : (
                                                        <SingleFaceVisualizationComponent
                                                            faceState={algCase.state}
                                                            puzzleType={selectedPuzzle}
                                                        />
                                                    )}
                                                </td>
                                            )}
                                            <td className='alg-library__case-alg'>
                                                {algCase?.algs?.map((alg, index) => {
                                                    return (
                                                        <div key={index}>
                                                            {index + 1}. {alg}
                                                        </div>
                                                    );
                                                }) ?? 'no algs lol'}
                                            </td>
                                            {!selectedAlgSet.hideAuf && (
                                                <td className='alg-library__case-auf'>
                                                    {algCase?.auf?.map((auf, index) => {
                                                        return (
                                                            <div key={index}>
                                                                {index + 1}. {auf}
                                                            </div>
                                                        );
                                                    }) ?? 'no auf lol'}
                                                </td>
                                            )}
                                            <td className='alg-library__case-notes'>
                                                {algCase?.algNotes?.map((note, index) => {
                                                    return (
                                                        <div key={index}>
                                                            {index + 1}. {note}
                                                        </div>
                                                    );
                                                }) ?? ''}
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            <tr key={caseIndex}>
                                                <td className='alg-library__case-name'>{algCase.name}</td>

                                                {!selectedAlgSet.hideCasePic && (
                                                    <td className='alg-library__case-pic'>
                                                        {selectedAlgSet.showFullPic ? (
                                                            <>
                                                                <CubeVisualizationComponent
                                                                    puzzleType={selectedPuzzle}
                                                                    state={algCase.state}
                                                                    width={160}
                                                                    height={120}
                                                                    clickable={false}
                                                                />
                                                            </>
                                                        ) : (
                                                            <SingleFaceVisualizationComponent
                                                                faceState={algCase.state}
                                                                puzzleType={selectedPuzzle}
                                                            />
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                            <tr>
                                                <td className='alg-library__case-alg' colSpan={2}>
                                                    {algCase?.algs?.map((alg, index) => {
                                                        return (
                                                            <div key={index}>
                                                                {index + 1}. {alg}
                                                            </div>
                                                        );
                                                    }) ?? 'no algs lol'}
                                                </td>
                                            </tr>
                                            {!selectedAlgSet.hideAuf && (
                                                <tr>
                                                    <td className='alg-library__case-auf' colSpan={2}>
                                                        {algCase?.auf?.map((auf, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    {index + 1}. {auf}
                                                                </div>
                                                            );
                                                        }) ?? 'no auf lol'}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td className='alg-library__case-notes' colSpan={2}>
                                                    {algCase?.algNotes?.map((note, index) => {
                                                        return (
                                                            <div key={index}>
                                                                {index + 1}. {note}
                                                            </div>
                                                        );
                                                    }) ?? ''}
                                                </td>
                                            </tr>
                                        </>
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
