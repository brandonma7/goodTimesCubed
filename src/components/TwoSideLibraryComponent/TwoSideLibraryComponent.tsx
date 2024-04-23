import React, { useState } from 'react';
import { FaceState, scrambleLetterColors, TwoSideVisualizationComponent } from '../CubeVisualizationComponent';

import { uniquifyList } from '../../utils/genericUtils';
import { getStateColors, PllTwoSideId, pllTwoSideIdList, pllTwoSides } from '../../utils/cases/3x3x3/pllTwoSide';
import './TwoSideLibraryComponent.scss';

export default function TwoSideLibraryComponent(): JSX.Element {
    const [level, setLevel] = useState(0);
    const [group, setGroup] = useState<PllTwoSideId>('all');
    const [topColor, setTopColor] = useState('yellow');
    const [question, setQuestion] = useState(generateRandomCaseWithinGroup(group, level));
    const [showAll, setShowAll] = useState(false);
    const [reduceChoices, setReduceChoices] = useState(true);
    const [libraryTopColorOffset, setLibraryTopColorOffset] = useState(0);

    const [previousAnswer, setPreviousAnswer] = useState<string | null>(null);
    const [previousAnswerPattern, setPreviousAnswerPattern] = useState<FaceState | null>(null);
    const [previousGuess, setPreviousGuess] = useState<string | null>(null);
    const [previousAnswerDesc, setPreviousAnswerDesc] = useState<string>('');
    const [previousAnswerOffset, setPreviousAnswerOffset] = useState(0);
    const levelNames = ['off', 'Easy', 'Medium', 'Hard'];

    const onSelect = (selection: string) => {
        setPreviousAnswer(question.patternName);
        setPreviousAnswerPattern(question.pattern);
        setPreviousAnswerDesc(question.description);
        setPreviousAnswerOffset(question.colorOffset);
        setPreviousGuess(selection);
        setQuestion(generateRandomCaseWithinGroup(group, level, question.index));
    };

    return level === 0 ? (
        <div className='two-side-library'>
            <div className='two-side-library__actions'>
                <button
                    className='timer__button'
                    onClick={() => {
                        setQuestion(generateRandomCaseWithinGroup(group, 3));
                        setLevel(3);
                    }}
                >
                    Train
                </button>
                <button className='timer__button' onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Hide variants' : 'Show all'}
                </button>
                <select
                    className='timer__select'
                    onChange={(event) => {
                        const newColor = event.target.value;
                        setTopColor(newColor);
                        setQuestion(generateRandomCaseWithinGroup(group, level, question.index));
                    }}
                    value={topColor}
                >
                    {scrambleLetterColors.map((color, index) => {
                        return (
                            <option key={index} value={color}>
                                {color}
                            </option>
                        );
                    })}
                </select>
                <input
                    className='timer__input'
                    type='number'
                    min='0'
                    max='3'
                    value={libraryTopColorOffset}
                    onChange={(event) => {
                        setLibraryTopColorOffset(parseInt(event.target.value));
                    }}
                />
            </div>

            <div className='two-side-library-list'>
                {pllTwoSides.map((group, index) => {
                    return (
                        <div key={index} className='two-side-library-group'>
                            <h3 className='two-side-library-group-header'>
                                {group.name}{' '}
                                <TwoSideVisualizationComponent
                                    faceState={getStateColors(group.state, topColor, libraryTopColorOffset)}
                                    puzzleType={'3x3x3'}
                                />
                            </h3>

                            <div className='two-side-library-entries'>
                                {group.patterns
                                    .filter((pattern) => showAll || !pattern.hidden)
                                    .map((pattern, index) => {
                                        return (
                                            <div key={index} className='two-side-library-entry'>
                                                <TwoSideVisualizationComponent
                                                    faceState={getStateColors(
                                                        pattern.state,
                                                        topColor,
                                                        libraryTopColorOffset,
                                                    )}
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
        <div
            className='two-side-library-trainer'
            onKeyDown={(event) => {
                onSelect(event.key.toUpperCase());
            }}
        >
            <p>Easy - Show image, description, less choices</p>
            <p>Medium - Show image, less choices</p>
            <p>Hard - Show image, show all choices</p>
            <div className='two-side-library-trainer__controls'>
                <button
                    className='timer__button'
                    onClick={() => {
                        setLevel(0);
                    }}
                >
                    Back
                </button>
                <button className='timer__button' onClick={() => setReduceChoices(!reduceChoices)}>
                    {reduceChoices ? 'Expand choices' : 'Reduce choices'}
                </button>
                <select
                    className='timer__select'
                    onChange={(event) => {
                        const newId = event.target.value as PllTwoSideId;
                        setGroup(newId);
                        setQuestion(generateRandomCaseWithinGroup(newId, level, question.index));
                    }}
                    value={group}
                >
                    {pllTwoSideIdList.map((id, index) => {
                        return (
                            <option key={index} value={id}>
                                {pllTwoSides.find((pts) => pts.id === id)?.name ?? 'All'}
                            </option>
                        );
                    })}
                </select>
                <select
                    className='timer__select'
                    onChange={(event) => {
                        const newId = event.target.value;
                        setLevel(parseInt(newId));
                        setQuestion(generateRandomCaseWithinGroup(group, level, question.index));
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
                <select
                    className='timer__select'
                    onChange={(event) => {
                        const newColor = event.target.value;
                        setTopColor(newColor);
                        setQuestion(generateRandomCaseWithinGroup(group, level, question.index));
                    }}
                    value={topColor}
                >
                    {scrambleLetterColors.map((color, index) => {
                        return (
                            <option key={index} value={color}>
                                {color}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className='two-side-library-trainer__main'>
                <div className='two-side-library-trainer__pattern'>
                    <TwoSideVisualizationComponent
                        faceState={getStateColors(question.pattern, topColor, question.colorOffset)}
                        puzzleType='3x3x3'
                    />
                    {level === 1 && <p style={{ marginLeft: 12 }}>{question.description}</p>}
                </div>
                <ChoicesComponent
                    includes={uniquifyList(question.choices)}
                    reduceChoices={reduceChoices}
                    onSelect={onSelect}
                />
                {previousAnswer != null && previousGuess != null && (
                    <div>
                        {checkIfCorrect(previousAnswer, previousGuess, reduceChoices) ? (
                            'Nice!'
                        ) : (
                            <>
                                <p>You selected: {previousGuess}</p>
                                <p>Correct case: {previousAnswer}</p>
                                {previousAnswerPattern != null && (
                                    <TwoSideVisualizationComponent
                                        faceState={getStateColors(
                                            previousAnswerPattern,
                                            topColor,
                                            previousAnswerOffset,
                                        )}
                                        puzzleType='3x3x3'
                                    />
                                )}
                                <p>{previousAnswerDesc}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function checkIfCorrect(ans: string, guess: string, reduceChoices: boolean): boolean {
    return reduceChoices ? ans[0] === guess[0] : ans === guess;
}

function generateRandomCaseWithinGroup(
    group: PllTwoSideId,
    level: number,
    prevIndex?: number,
): {
    index: number;
    pattern: number[][];
    patternName: string;
    description: string;
    colorOffset: number;
    choices: string[];
} {
    let groupIndex = pllTwoSides.findIndex((pts) => pts.id === group) ?? Math.trunc(Math.random() * pllTwoSides.length);
    groupIndex = groupIndex === -1 ? Math.trunc(Math.random() * pllTwoSides.length) : groupIndex;
    const groupPatterns = pllTwoSides[groupIndex].patterns;

    let patternIndex = Math.trunc(Math.random() * groupPatterns.length);
    patternIndex = patternIndex === prevIndex ? (patternIndex + 1) % groupPatterns.length : patternIndex;
    const entry = groupPatterns[patternIndex];

    return {
        index: patternIndex,
        pattern: entry.state,
        patternName: entry.name,
        description: entry.description,
        colorOffset: Math.trunc(Math.random() * 4),
        choices: (level === 3 ? pllTwoSides.flatMap((pts) => pts.patterns) : groupPatterns).map((p) => p.name),
    };
}

function ChoicesComponent({
    includes,
    reduceChoices,
    onSelect,
}: {
    includes: string[];
    reduceChoices: boolean;
    onSelect: (selection: string) => void;
}) {
    const buttonRows: string[][] = reduceChoices
        ? [['A', 'E'], ['J', 'F'], ['R', 'T'], ['N', 'Y', 'V'], ['U', 'H', 'Z'], ['G']]
        : [
              ['Aa', 'Ab', 'E'],
              ['Ja', 'Jb', 'F'],
              ['Ra', 'Rb', 'T'],
              ['Na', 'Nb', 'Y', 'V'],
              ['Ua', 'Ub', 'H', 'Z'],
              ['Ga', 'Gb', 'Gc', 'Gd'],
          ];

    const inc = reduceChoices ? uniquifyList(includes.map((i) => i[0])) : includes;

    return (
        <div className='choices-component'>
            {buttonRows.map((buttons, index) => {
                const includedButtons = buttons.filter((button) => inc.includes(button));
                return includedButtons.length === 0 ? (
                    <React.Fragment key={index}></React.Fragment>
                ) : (
                    <div key={index} className='choices-component__group'>
                        {includedButtons.map((button, index) => {
                            return (
                                <button className='timer__button' key={index} onClick={() => onSelect(button)}>
                                    {button}
                                </button>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
