import React, { useState } from 'react';
import { PuzzleType } from '../../utils/cubingUtils';
import { AlgSetNamesMap, AlgSets, CaseGroup } from '../CasePickerComponent';
import { ollCases } from '../../utils/cases/3x3x3/oll';
import { pllCases } from '../../utils/cases/3x3x3/pll';
import { ortegaCases } from '../../utils/cases/2x2x2/ortega';
import {
    FaceState,
    SingleFaceVisualizationComponent,
    TwoSideVisualizationComponent,
} from '../CubeVisualizationComponent';

import './AlgLibraryComponent.scss';
import { ohCases } from '../../utils/cases/3x3x3/oh';
import { classNames, uniquifyList } from '../../utils/genericUtils';
import { PllTwoSideId, pllTwoSideIdList, pllTwoSides } from '../../utils/cases/3x3x3/pllTwoSide';

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
                                                        {
                                                            <SingleFaceVisualizationComponent
                                                                faceState={algCase.state}
                                                                puzzleType={selectedPuzzle}
                                                            />
                                                        }
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

export function TwoSideLibraryComponent(): JSX.Element {
    const [level, setLevel] = useState(0);
    const [group, setGroup] = useState<PllTwoSideId>('all');
    const [question, setQuestion] = useState(generateRandomCaseWithinGroup(group));

    const [correct, setCorrect] = useState<boolean | null>(null);
    const levelNames = ['off', 'easy', 'medium', 'hard'];

    return level === 0 ? (
        <div className='two-side-library'>
            <button className='timer__button' onClick={() => setLevel(1)}>
                Train
            </button>
            <div className='two-side-library-list'>
                {pllTwoSides.map((group, index) => {
                    return (
                        <div key={index} className='two-side-library-group'>
                            <h3 className='two-side-library-group-header'>
                                {group.name}{' '}
                                <TwoSideVisualizationComponent faceState={group.state} puzzleType={'3x3x3'} />
                            </h3>

                            <div className='two-side-library-entries'>
                                {group.patterns
                                    .filter((pattern) => !pattern.hidden)
                                    .map((pattern, index) => {
                                        return (
                                            <div key={index} className='two-side-library-entry'>
                                                <TwoSideVisualizationComponent
                                                    faceState={pattern.state}
                                                    puzzleType={'3x3x3'}
                                                />
                                                {pattern.description} = {pattern.name}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    ) : (
        <div className='two-side-library-trainer'>
            <div className='two-side-library-trainer__controls'>
                <button className='timer__button' onClick={() => setLevel(0)}>
                    Stop
                </button>
                <select
                    className='timer__select'
                    onChange={(event) => {
                        const newId = event.target.value as PllTwoSideId;
                        setGroup(newId);
                        setQuestion(generateRandomCaseWithinGroup(newId, question.index));
                    }}
                    value={group}
                >
                    {pllTwoSideIdList.map((id, index) => {
                        return (
                            <option key={index} value={id}>
                                {id}
                            </option>
                        );
                    })}
                </select>
                <select
                    className='timer__select'
                    onChange={(event) => {
                        const newId = event.target.value;
                        setLevel(parseInt(newId));
                        setQuestion(generateRandomCaseWithinGroup(group, question.index));
                    }}
                    value={level}
                >
                    {[1, 2, 3].map((id, index) => {
                        return (
                            <option key={index} value={id}>
                                {levelNames[id]}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className='two-side-library-trainer__main'>
                <div className='two-side-library-trainer__pattern'>
                    <TwoSideVisualizationComponent faceState={question.pattern} puzzleType='3x3x3' />
                    {level === 1 && <p style={{ marginLeft: 12 }}>{question.description}</p>}
                </div>
                <div className='two-side-library-trainer__choices'>
                    {uniquifyList(question.choices)
                        .sort()
                        .map((choice, index) => {
                            return (
                                <button
                                    key={index}
                                    className='timer__button'
                                    onClick={() => {
                                        setCorrect(choice === question.patternName);
                                        setQuestion(generateRandomCaseWithinGroup(group, question.index));
                                    }}
                                >
                                    {choice}
                                </button>
                            );
                        })}
                </div>
            </div>
            {correct ? 'Right!' : correct != null ? 'No!' : ''}
        </div>
    );
}

function generateRandomCaseWithinGroup(
    group: PllTwoSideId,
    prevIndex?: number,
): {
    index: number;
    pattern: FaceState;
    patternName: string;
    description: string;
    choices: string[];
} {
    const groupList =
        pllTwoSides.find((pts) => pts.id === group)?.patterns ?? pllTwoSides.flatMap((pts) => pts.patterns);

    let index = Math.trunc(Math.random() * groupList.length);
    index = index === prevIndex ? (index + 1) % groupList.length : index;
    const entry = groupList[index];

    return {
        index,
        pattern: entry.state,
        patternName: entry.name,
        description: entry.description,
        choices: groupList.map((p) => p.name),
    };
}
