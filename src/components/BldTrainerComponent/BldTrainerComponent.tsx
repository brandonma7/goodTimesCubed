import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Cube from '../../classes/Cube';
import { generateScramble } from '../../utils/cubingUtils';
import { classNames } from '../../utils/genericUtils';
import CubeVisualizationComponent, { colorScramble } from '../CubeVisualizationComponent';
import {
    getMappingFromLocalStorage,
    getWordDupes,
    LetterPair,
    letterPairTableMapping,
    updateWordInLocalStorage,
} from './bldLetterPairMapping';
import './BldTrainerComponent.scss';

export default function BldTrainerComponent() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    return (
        <div className='timer__bld-trainer-component'>
            <Routes>
                <Route
                    path='/'
                    element={
                        <>
                            <button
                                className='timer__button'
                                onClick={() => {
                                    navigate('letter-pair-trainer');
                                }}
                            >
                                Letter Pair Trainer
                            </button>
                            <button
                                className='timer__button'
                                onClick={() => {
                                    navigate('memo-trainer');
                                }}
                            >
                                Memo Trainer
                            </button>

                            <input
                                className='timer__input'
                                placeholder='Find'
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                }}
                            />
                            {search.length === 2 ? (
                                <button className='timer__button' onClick={() => setSearch('')}>
                                    {findSearchValue(search.toUpperCase())}
                                </button>
                            ) : (
                                ''
                            )}
                            <LetterPairTable />
                        </>
                    }
                />
                <Route
                    path='/letter-pair-trainer'
                    element={
                        <>
                            <button
                                className='timer__button'
                                onClick={() => {
                                    navigate('.');
                                }}
                            >
                                Back
                            </button>
                            <LetterPairTrainer />
                        </>
                    }
                />
                <Route
                    path='/memo-trainer'
                    element={
                        <>
                            <button
                                className='timer__button'
                                onClick={() => {
                                    navigate('.');
                                }}
                            >
                                Back
                            </button>
                            <MemoTrainer />
                        </>
                    }
                />
            </Routes>
        </div>
    );
}

function MemoTrainer() {
    const cube = new Cube('', '3x3x3');
    const [scramble, setScramble] = useState(generateScramble('3x3x3'));
    const [cornerSwaps, setCornerSwaps] = useState('');
    const [edgeSwaps, setEdgeSwaps] = useState('');
    const [directMoves, setDirectMoves] = useState('');

    cube.scramble(scramble);
    cube.doEdgeSwaps(edgeSwaps);
    cube.doCornerSwaps(cornerSwaps);
    directMoves.split(' ').forEach((move) => cube.doMove(move));

    return (
        <div>
            <h3>Memo Trainer</h3>
            <div>{colorScramble(scramble)}</div>
            <p>
                Scramble a cube, memorize (currently just in M2/OP), type edge and corner pairs.(type &apos;-&apos; in
                edge swaps for parity)
            </p>
            <div>
                <CubeVisualizationComponent state={cube.getState()} puzzleType={'3x3x3'} clickable={false} />
            </div>
            <div>
                <input
                    className='timer__input'
                    placeholder='Edge swaps'
                    value={edgeSwaps}
                    onChange={(event) => {
                        setEdgeSwaps(event.target.value.toUpperCase());
                    }}
                />
            </div>
            <div>
                <input
                    className='timer__input'
                    placeholder='Corner swaps'
                    value={cornerSwaps}
                    onChange={(event) => {
                        setCornerSwaps(event.target.value.toUpperCase());
                    }}
                />
            </div>

            <div>
                <input
                    className='timer__input'
                    placeholder='Direct moves'
                    value={directMoves}
                    onChange={(event) => {
                        setDirectMoves(event.target.value.toUpperCase());
                    }}
                />
            </div>
            <div>
                <button
                    className='timer__button'
                    onClick={() => {
                        setScramble(generateScramble('3x3x3'));
                        setCornerSwaps('');
                        setEdgeSwaps('');
                    }}
                >
                    New Scramble
                </button>
                <button
                    className='timer__button'
                    onClick={() => {
                        setScramble('');
                        setCornerSwaps('');
                        setEdgeSwaps('');
                    }}
                >
                    Empty Scramble
                </button>
            </div>
        </div>
    );
}

function findSearchValue(search: string): string {
    const firstLetter = search[0];
    const secondLetter = search[1];
    return (
        getMappingFromLocalStorage()
            .find((letterPair) => letterPair.letter === firstLetter)
            ?.pairs.find((pair) => pair.letter === secondLetter)?.word ?? ''
    );
}

function getRandomLetterPair(
    letterPairMappingForTrainer: LetterPair[],
    firstLetterIndex?: number,
    secondLetterIndex?: number,
): {
    pair: string;
    word: string;
} {
    const firstIndex =
        firstLetterIndex === -1 || firstLetterIndex == null
            ? Math.trunc(Math.random() * letterPairMappingForTrainer.length)
            : firstLetterIndex;
    const secondIndex =
        secondLetterIndex ?? Math.trunc(Math.random() * letterPairMappingForTrainer[firstIndex].pairs.length);

    const firstLetter = letterPairMappingForTrainer[firstIndex].letter;
    const secondLetterPair = letterPairMappingForTrainer[firstIndex].pairs[secondIndex];
    const letterPair = `${firstLetter}${secondLetterPair.letter}`;

    return {
        pair: letterPair,
        word: secondLetterPair.word,
    };
}

function findIndicesOfLetterPair(letters: string): [number, number] {
    const firstLetter = letters[0];
    const secondLetter = letters[1];
    const firstIndex = letterPairTableMapping.findIndex((lp) => lp.letter === firstLetter);
    const secondIndex = letterPairTableMapping[firstIndex].pairs.findIndex((p) => p.letter === secondLetter);
    return [firstIndex, secondIndex];
}

function LetterPairTrainer() {
    // Removing the dashes to make logic in trainer easier
    const mapping = getMappingFromLocalStorage();
    const letterPairMappingForTrainer: LetterPair[] = mapping.map((letterPair) => {
        return {
            letter: letterPair.letter,
            pairs: letterPair.pairs.filter((pair) => pair.word != '-'),
        };
    });

    const [firstLetterIndex, setFirstLetterIndex] = useState(-1);
    const [word, setWord] = useState(letterPairMappingForTrainer[0].pairs[0].word);
    const [pair, setPair] = useState('AB');

    const [showWord, setShowWord] = useState(false);
    const [goInOrder, setGoInOrder] = useState(false);
    const [orderIndex, setOrderIndex] = useState(0);
    const [editMode, setEditMode] = useState(false);

    function progressTrainer() {
        if (showWord) {
            if (goInOrder) {
                setOrderIndex((orderIndex + 1) % letterPairMappingForTrainer[firstLetterIndex].pairs.length);
                const newPair = getRandomLetterPair(letterPairMappingForTrainer, firstLetterIndex, orderIndex);
                setWord(newPair.word);
                setPair(newPair.pair);
            } else {
                const newPair = getRandomLetterPair(letterPairMappingForTrainer, firstLetterIndex);
                setWord(newPair.word);
                setPair(newPair.pair);
            }
            setShowWord(false);
        } else {
            setShowWord(true);
        }
    }

    return (
        <>
            <select
                className='timer__select'
                value={firstLetterIndex}
                onChange={(event) => {
                    const newIndex = parseInt(event.target.value);
                    if (firstLetterIndex !== newIndex) {
                        setFirstLetterIndex(newIndex);
                    }
                    if (newIndex === -1) {
                        setGoInOrder(false);
                    }
                }}
            >
                <option value={-1}>All</option>
                {letterPairMappingForTrainer.map((letterPair, index) => {
                    return (
                        <option key={index} value={index}>
                            {letterPair.letter}
                        </option>
                    );
                })}
            </select>
            {firstLetterIndex !== -1 && (
                <button className='timer__button' onClick={() => setGoInOrder(!goInOrder)}>
                    {goInOrder ? 'Sequential Mode' : 'Random Mode'}
                </button>
            )}

            <div
                onKeyDown={(event) => {
                    if (event.key === 'Space') {
                        progressTrainer();
                    }
                }}
            >
                <p className='trainer-pair'>{showWord ? word : pair}</p>
                <div>
                    {showWord &&
                        (editMode ? (
                            <input
                                className='timer__input'
                                type='text'
                                value={word}
                                autoFocus
                                onChange={(event) => setWord(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        const [rowIndex, colIndex] = findIndicesOfLetterPair(pair);
                                        updateWordInLocalStorage(mapping, rowIndex, colIndex, word);
                                        setEditMode(false);
                                    }
                                }}
                                onBlur={() => {
                                    const [rowIndex, colIndex] = findIndicesOfLetterPair(pair);
                                    updateWordInLocalStorage(mapping, rowIndex, colIndex, word);
                                    setEditMode(false);
                                }}
                            />
                        ) : (
                            <button className='timer__button' onClick={() => setEditMode(true)}>
                                Edit
                            </button>
                        ))}

                    <button className='timer__button' onClick={progressTrainer}>
                        {showWord ? 'Next' : 'Check'}
                    </button>
                </div>
            </div>
        </>
    );
}

function LetterPairTable() {
    const [hoverRow, setHoverRow] = useState(-1);
    const [hoverCol, setHoverCol] = useState(-1);

    const mapping = getMappingFromLocalStorage();
    const dupes = getWordDupes(mapping);

    return (
        <table className='basic-table'>
            <thead>
                <tr>
                    <th className='bld-pair-column'></th>
                    {mapping.map((letterPair, index) => {
                        return (
                            <th
                                key={index}
                                className={classNames('bld-pair-column', hoverCol === index && 'bld-pair--col-hover')}
                            >
                                {letterPair.letter}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {mapping.map((letterPair, rowIndex) => {
                    return (
                        <tr key={rowIndex}>
                            <td className={classNames('bld-pair-row', hoverRow === rowIndex && 'bld-pair--col-hover')}>
                                {letterPair.letter}
                            </td>
                            {letterPair.pairs.map((pair, colIndex) => {
                                const [editMode, setEditMode] = useState(false);
                                const [word, setWord] = useState(pair.word);
                                return (
                                    <td
                                        key={colIndex}
                                        className={classNames(
                                            pair.letter === letterPair.letter && 'bld-pair--null',
                                            hoverCol === colIndex && hoverRow === rowIndex && 'bld-pair--exact-hover',
                                            hoverCol === colIndex && 'bld-pair--col-hover',
                                            hoverRow === rowIndex && 'bld-pair--row-hover',
                                            dupes.includes(word) && 'bld-pair--dupe',
                                        )}
                                        onClick={() => {
                                            setEditMode(true);
                                        }}
                                        onMouseEnter={() => {
                                            setHoverCol(colIndex);
                                            setHoverRow(rowIndex);
                                        }}
                                    >
                                        {editMode ? (
                                            <input
                                                className='timer__input'
                                                type='text'
                                                value={word}
                                                autoFocus
                                                onChange={(event) => setWord(event.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault();
                                                        updateWordInLocalStorage(mapping, rowIndex, colIndex, word);
                                                        setEditMode(false);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    updateWordInLocalStorage(mapping, rowIndex, colIndex, word);
                                                    setEditMode(false);
                                                }}
                                            />
                                        ) : (
                                            word
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
