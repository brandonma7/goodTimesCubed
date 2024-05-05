import React, { useState } from 'react';
import { classNames } from '../../utils/genericUtils';
import './BldTrainerComponent.scss';

export default function BldTrainerComponent() {
    const [isTraining, setIsTraining] = useState(false);

    return (
        <div className='timer__bld-trainer-component'>
            <button className='timer__button' onClick={() => setIsTraining(!isTraining)}>
                {isTraining ? 'Stop' : 'Train'}
            </button>
            {isTraining ? <LetterPairTrainer /> : <LetterPairTable />}
        </div>
    );
}

function getRandomLetterPair(
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

function LetterPairTrainer() {
    const [firstLetterIndex, setFirstLetterIndex] = useState(-1);
    const [letterPair, setLetterPair] = useState({
        pair: 'AB',
        word: letterPairMappingForTrainer[0].pairs[0].word,
    });
    const [showWord, setShowWord] = useState(false);
    const [goInOrder, setGoInOrder] = useState(false);
    const [orderIndex, setOrderIndex] = useState(0);

    function progressTrainer() {
        if (showWord) {
            if (goInOrder) {
                setOrderIndex((orderIndex + 1) % letterPairMappingForTrainer[firstLetterIndex].pairs.length);
                setLetterPair(getRandomLetterPair(firstLetterIndex, orderIndex));
            } else {
                setLetterPair(getRandomLetterPair(firstLetterIndex));
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
                {letterPairTableMapping.map((letterPair, index) => {
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
                <p className='trainer-pair'>{showWord ? letterPair.word : letterPair.pair}</p>
                <div>
                    <button className='timer__button' onClick={progressTrainer}>
                        {showWord ? 'Next' : 'Check'}
                    </button>
                </div>
            </div>
        </>
    );
}
const MAPPING_KEY = 'bldTrainerMapping';
function getMappingFromLocalStorage(): LetterPair[] {
    const valueFromLocalStorage = JSON.parse(localStorage.getItem(MAPPING_KEY) ?? '{}');
    return Object.keys(valueFromLocalStorage).length > 0 ? valueFromLocalStorage : letterPairTableMapping;
}

function updateWordInLocalStorage(mapping: LetterPair[], rowIndex: number, colIndex: number, newWord: string) {
    const oldMappingForPair = mapping[rowIndex].pairs[colIndex];
    const newMappingForPair = {
        ...oldMappingForPair,
        word: newWord,
    };

    const mappingCopy = mapping.map((lp) => lp);
    mappingCopy[rowIndex].pairs[colIndex] = newMappingForPair;

    localStorage.setItem(MAPPING_KEY, JSON.stringify(mappingCopy));
}

function LetterPairTable() {
    const [hoverRow, setHoverRow] = useState(-1);
    const [hoverCol, setHoverCol] = useState(-1);

    const mapping = getMappingFromLocalStorage();

    return (
        <table className='basic-table'>
            <thead>
                <tr>
                    <th className='bld-pair-column'></th>
                    {mapping.map((letterPair, index) => {
                        return (
                            <th
                                key={index}
                                className={classNames(
                                    'bld-pair-column',
                                    hoverCol === index ? 'bld-pair--col-hover' : '',
                                )}
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
                            <td
                                className={classNames(
                                    'bld-pair-row',
                                    hoverRow === rowIndex ? 'bld-pair--col-hover' : '',
                                )}
                            >
                                {letterPair.letter}
                            </td>
                            {letterPair.pairs.map((pair, colIndex) => {
                                const [editMode, setEditMode] = useState(false);
                                const [word, setWord] = useState(pair.word);
                                return (
                                    <td
                                        key={colIndex}
                                        className={classNames(
                                            pair.letter === letterPair.letter ? 'bld-pair--null' : '',
                                            hoverCol === colIndex && hoverRow === rowIndex
                                                ? 'bld-pair--exact-hover'
                                                : '',
                                            hoverCol === colIndex ? 'bld-pair--col-hover' : '',
                                            hoverRow === rowIndex ? 'bld-pair--row-hover' : '',
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
                                                onChange={(event) => setWord(event.target.value)}
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

type LetterPair = {
    letter: string;
    pairs: LetterWord[];
};

type LetterWord = {
    letter: string;
    word: string;
};

const letterPairTableMapping: LetterPair[] = [
    {
        letter: 'A',
        pairs: [
            { letter: 'A', word: '-' },
            { letter: 'B', word: 'Abs' },
            { letter: 'C', word: 'Ace' },
            { letter: 'D', word: 'Ad' },
            { letter: 'E', word: 'Aero' },
            { letter: 'F', word: 'After' },
            { letter: 'G', word: 'Age' },
            { letter: 'H', word: 'Ahh' },
            { letter: 'I', word: 'Artificial Intelligence' },
            { letter: 'J', word: 'Apple Jacks' },
            { letter: 'K', word: 'AK-47' },
            { letter: 'L', word: 'Ale' },
            { letter: 'M', word: 'Amp' },
            { letter: 'N', word: 'Ant' },
            { letter: 'O', word: 'AOC' },
            { letter: 'P', word: 'Ape' },
            { letter: 'Q', word: 'Acquire' },
            { letter: 'R', word: 'Art' },
            { letter: 'S', word: 'Ass' },
            { letter: 'T', word: 'AT-AT' },
            { letter: 'U', word: 'August' },
            { letter: 'V', word: 'A/V' },
            { letter: 'W', word: 'AW root beer' },
            { letter: 'X', word: 'Axe' },
        ],
    },
    {
        letter: 'B',
        pairs: [
            { letter: 'A', word: 'Bay' },
            { letter: 'B', word: '-' },
            { letter: 'C', word: 'Back' },
            { letter: 'D', word: 'Bad' },
            { letter: 'E', word: 'Bee' },
            { letter: 'F', word: 'Boyfriend' },
            { letter: 'G', word: 'Big' },
            { letter: 'H', word: 'BoHo' },
            { letter: 'I', word: 'Bi' },
            { letter: 'J', word: 'Banjo' },
            { letter: 'K', word: 'Burger King' },
            { letter: 'L', word: 'Ball' },
            { letter: 'M', word: 'Bomb' },
            { letter: 'N', word: 'Ben' },
            { letter: 'O', word: 'Bo peep' },
            { letter: 'P', word: 'Boop' },
            { letter: 'Q', word: 'Barbeque' },
            { letter: 'R', word: 'Boar' },
            { letter: 'S', word: 'Bullshit' },
            { letter: 'T', word: 'Bat' },
            { letter: 'U', word: 'Boo' },
            { letter: 'V', word: 'Brave' },
            { letter: 'W', word: 'Bow wow' },
            { letter: 'X', word: 'Box' },
        ],
    },
    {
        letter: 'C',
        pairs: [
            { letter: 'A', word: 'California' },
            { letter: 'B', word: 'Cab' },
            { letter: 'C', word: '-' },
            { letter: 'D', word: 'CD' },
            { letter: 'E', word: "Collector's Edition" },
            { letter: 'F', word: 'Calf' },
            { letter: 'G', word: 'Cog' },
            { letter: 'H', word: 'Chop' },
            { letter: 'I', word: '101' },
            { letter: 'J', word: 'CeeJay' },
            { letter: 'K', word: 'Cock' },
            { letter: 'L', word: 'Clay' },
            { letter: 'M', word: 'Camera' },
            { letter: 'N', word: 'Can' },
            { letter: 'O', word: 'Co (company)' },
            { letter: 'P', word: 'Cop' },
            { letter: 'Q', word: 'Croque' },
            { letter: 'R', word: 'Core' },
            { letter: 'S', word: 'Cost' },
            { letter: 'T', word: 'Coat' },
            { letter: 'U', word: 'Cute' },
            { letter: 'V', word: 'Cave' },
            { letter: 'W', word: 'Cow' },
            { letter: 'X', word: 'Cox' },
        ],
    },
    {
        letter: 'D',
        pairs: [
            { letter: 'A', word: 'Day' },
            { letter: 'B', word: 'Dab' },
            { letter: 'C', word: 'Dice' },
            { letter: 'D', word: '-' },
            { letter: 'E', word: 'Deedee' },
            { letter: 'F', word: 'Deaf' },
            { letter: 'G', word: 'Dog' },
            { letter: 'H', word: 'Dough' },
            { letter: 'I', word: 'Di' },
            { letter: 'J', word: 'DJ' },
            { letter: 'K', word: 'Donkey Kong' },
            { letter: 'L', word: 'Dill' },
            { letter: 'M', word: 'Dumb' },
            { letter: 'N', word: 'Den' },
            { letter: 'O', word: 'Do' },
            { letter: 'P', word: 'Dip' },
            { letter: 'Q', word: 'Dairy Queen' },
            { letter: 'R', word: 'Doctor' },
            { letter: 'S', word: 'Desk' },
            { letter: 'T', word: 'Dot' },
            { letter: 'U', word: 'Dude' },
            { letter: 'V', word: 'Dive' },
            { letter: 'W', word: 'Dweeb' },
            { letter: 'X', word: 'Dexter' },
        ],
    },
    {
        letter: 'E',
        pairs: [
            { letter: 'A', word: 'Eat' },
            { letter: 'B', word: 'EB Games' },
            { letter: 'C', word: 'Electric' },
            { letter: 'D', word: 'Eddy' },
            { letter: 'E', word: '-' },
            { letter: 'F', word: 'Ef' },
            { letter: 'G', word: 'Egg' },
            { letter: 'H', word: 'Ehh' },
            { letter: 'I', word: 'Early Integration' },
            { letter: 'J', word: 'Edge' },
            { letter: 'K', word: 'Eek' },
            { letter: 'L', word: 'Element' },
            { letter: 'M', word: 'Ember' },
            { letter: 'N', word: 'End' },
            { letter: 'O', word: 'Eobard' },
            { letter: 'P', word: 'Episode' },
            { letter: 'Q', word: 'EQ' },
            { letter: 'R', word: 'Error' },
            { letter: 'S', word: 'Easter' },
            { letter: 'T', word: 'Alien' },
            { letter: 'U', word: 'Europe' },
            { letter: 'V', word: 'Ever' },
            { letter: 'W', word: 'Eww' },
            { letter: 'X', word: 'Ex' },
        ],
    },
    {
        letter: 'F',
        pairs: [
            { letter: 'A', word: 'Fat' },
            { letter: 'B', word: 'Fabulous' },
            { letter: 'C', word: 'Face' },
            { letter: 'D', word: 'Food' },
            { letter: 'E', word: 'Fee' },
            { letter: 'F', word: '-' },
            { letter: 'G', word: 'Flag' },
            { letter: 'H', word: 'Forehead' },
            { letter: 'I', word: 'Fi' },
            { letter: 'J', word: 'Fudge' },
            { letter: 'K', word: 'Fake' },
            { letter: 'L', word: 'Fall' },
            { letter: 'M', word: 'Family' },
            { letter: 'N', word: 'Fan' },
            { letter: 'O', word: 'Foe' },
            { letter: 'P', word: 'Flip' },
            { letter: 'Q', word: 'Farquad' },
            { letter: 'R', word: 'Four' },
            { letter: 'S', word: 'Fast' },
            { letter: 'T', word: 'Feet' },
            { letter: 'U', word: 'Fu' },
            { letter: 'V', word: 'Favorite' },
            { letter: 'W', word: 'Few' },
            { letter: 'X', word: 'Fax' },
        ],
    },
    {
        letter: 'G',
        pairs: [
            { letter: 'A', word: 'Gay' },
            { letter: 'B', word: 'GameBoy' },
            { letter: 'C', word: 'GameCube' },
            { letter: 'D', word: 'Good' },
            { letter: 'E', word: 'Gee' },
            { letter: 'F', word: 'Girlfriend' },
            { letter: 'G', word: '-' },
            { letter: 'H', word: 'Guitar Hero' },
            { letter: 'I', word: 'Gi' },
            { letter: 'J', word: 'Gauge' },
            { letter: 'K', word: 'Goku' },
            { letter: 'L', word: 'Glue' },
            { letter: 'M', word: 'Game' },
            { letter: 'N', word: 'Gin' },
            { letter: 'O', word: 'Go' },
            { letter: 'P', word: 'Gap' },
            { letter: 'Q', word: 'GQ Mag' },
            { letter: 'R', word: 'Gore (Al)' },
            { letter: 'S', word: 'Gas' },
            { letter: 'T', word: 'Goat' },
            { letter: 'U', word: 'Goo' },
            { letter: 'V', word: 'Give' },
            { letter: 'W', word: 'God of War' },
            { letter: 'X', word: 'Gecko' },
        ],
    },
    {
        letter: 'H',
        pairs: [
            { letter: 'A', word: 'Haha' },
            { letter: 'B', word: 'Hobby' },
            { letter: 'C', word: 'Homecoming' },
            { letter: 'D', word: 'HD' },
            { letter: 'E', word: 'He' },
            { letter: 'F', word: 'Hefty' },
            { letter: 'G', word: 'Hog' },
            { letter: 'H', word: '-' },
            { letter: 'I', word: 'Hi' },
            { letter: 'J', word: 'Hedge' },
            { letter: 'K', word: 'Heck' },
            { letter: 'L', word: 'Hell' },
            { letter: 'M', word: 'Ham' },
            { letter: 'N', word: 'Honey' },
            { letter: 'O', word: 'Hoe' },
            { letter: 'P', word: 'Hop' },
            { letter: 'Q', word: 'Hoky' },
            { letter: 'R', word: 'Whore' },
            { letter: 'S', word: 'High School' },
            { letter: 'T', word: 'Hot' },
            { letter: 'U', word: 'Elder Hu' },
            { letter: 'V', word: 'Hive' },
            { letter: 'W', word: 'How' },
            { letter: 'X', word: 'Hex' },
        ],
    },
    {
        letter: 'I',
        pairs: [
            { letter: 'A', word: 'Tiamat' },
            { letter: 'B', word: 'IBS' },
            { letter: 'C', word: 'Ice' },
            { letter: 'D', word: 'ID' },
            { letter: 'E', word: 'Internet Explorer' },
            { letter: 'F', word: 'If' },
            { letter: 'G', word: 'Instagram' },
            { letter: 'H', word: 'iH' },
            { letter: 'I', word: '-' },
            { letter: 'J', word: 'Idget' },
            { letter: 'K', word: 'Ike' },
            { letter: 'L', word: 'Ill' },
            { letter: 'M', word: 'Imp' },
            { letter: 'N', word: 'In' },
            { letter: 'O', word: 'I/O (InOut)' },
            { letter: 'P', word: 'IP address' },
            { letter: 'Q', word: 'IQ' },
            { letter: 'R', word: 'Infrared' },
            { letter: 'S', word: 'Is' },
            { letter: 'T', word: 'It' },
            { letter: 'U', word: 'Liu' },
            { letter: 'V', word: 'Ivy' },
            { letter: 'W', word: 'Iwojima' },
            { letter: 'X', word: 'Nine' },
        ],
    },
    {
        letter: 'J',
        pairs: [
            { letter: 'A', word: 'Jay' },
            { letter: 'B', word: 'Job' },
            { letter: 'C', word: 'Jesus Christ' },
            { letter: 'D', word: 'JD' },
            { letter: 'E', word: 'Jeep' },
            { letter: 'F', word: 'Jeff' },
            { letter: 'G', word: 'Jog' },
            { letter: 'H', word: 'Jheart' },
            { letter: 'I', word: 'Jim' },
            { letter: 'J', word: '-' },
            { letter: 'K', word: 'Joke' },
            { letter: 'L', word: 'Jail' },
            { letter: 'M', word: 'Jim' },
            { letter: 'N', word: 'Jenn' },
            { letter: 'O', word: 'Joe' },
            { letter: 'P', word: 'Japan' },
            { letter: 'Q', word: 'Jeaque' },
            { letter: 'R', word: 'Jr.' },
            { letter: 'S', word: 'Jesse' },
            { letter: 'T', word: 'Jet' },
            { letter: 'U', word: 'Juice' },
            { letter: 'V', word: 'Jive' },
            { letter: 'W', word: 'Jaw' },
            { letter: 'X', word: 'Jax' },
        ],
    },
    {
        letter: 'K',
        pairs: [
            { letter: 'A', word: 'Kay' },
            { letter: 'B', word: 'Kobe' },
            { letter: 'C', word: 'caKe' },
            { letter: 'D', word: 'Kid' },
            { letter: 'E', word: 'Keefer' },
            { letter: 'F', word: 'Koffing' },
            { letter: 'G', word: 'Keg' },
            { letter: 'H', word: 'Kingdom Hearts' },
            { letter: 'I', word: 'Ki Blast' },
            { letter: 'J', word: 'Kage' },
            { letter: 'K', word: '-' },
            { letter: 'L', word: 'Kale' },
            { letter: 'M', word: 'Kim' },
            { letter: 'N', word: 'Ken' },
            { letter: 'O', word: 'Knock Out' },
            { letter: 'P', word: 'Kippy' },
            { letter: 'Q', word: 'KroKay' },
            { letter: 'R', word: 'Krow' },
            { letter: 'S', word: 'Kiss' },
            { letter: 'T', word: 'Kit' },
            { letter: 'U', word: 'Kiuper belt' },
            { letter: 'V', word: 'Kevin' },
            { letter: 'W', word: 'Kiwi' },
            { letter: 'X', word: 'Kix' },
        ],
    },
    {
        letter: 'L',
        pairs: [
            { letter: 'A', word: 'Los Angeles' },
            { letter: 'B', word: 'Lab' },
            { letter: 'C', word: 'Lace' },
            { letter: 'D', word: 'Lad' },
            { letter: 'E', word: 'Lee' },
            { letter: 'F', word: 'Life' },
            { letter: 'G', word: 'Log' },
            { letter: 'H', word: 'Laugh' },
            { letter: 'I', word: 'Jet Li' },
            { letter: 'J', word: 'Ledge' },
            { letter: 'K', word: 'Lick' },
            { letter: 'L', word: '-' },
            { letter: 'M', word: 'Lamb' },
            { letter: 'N', word: 'Lentel' },
            { letter: 'O', word: 'Low' },
            { letter: 'P', word: 'Lip' },
            { letter: 'Q', word: 'Lock' },
            { letter: 'R', word: 'Lair' },
            { letter: 'S', word: 'Lass' },
            { letter: 'T', word: 'Light' },
            { letter: 'U', word: 'Lulu' },
            { letter: 'V', word: 'Lava' },
            { letter: 'W', word: 'Law' },
            { letter: 'X', word: 'Lex' },
        ],
    },
    {
        letter: 'M',
        pairs: [
            { letter: 'A', word: 'Mama' },
            { letter: 'B', word: 'Mob' },
            { letter: 'C', word: 'Mice' },
            { letter: 'D', word: 'Mad' },
            { letter: 'E', word: 'Me' },
            { letter: 'F', word: 'Motherfucker' },
            { letter: 'G', word: 'Megan' },
            { letter: 'H', word: 'Meh' },
            { letter: 'I', word: 'Mii' },
            { letter: 'J', word: 'Michael Jackson' },
            { letter: 'K', word: 'Mike' },
            { letter: 'L', word: 'Mail' },
            { letter: 'M', word: '-' },
            { letter: 'N', word: 'Man' },
            { letter: 'O', word: 'Moe' },
            { letter: 'P', word: 'Map' },
            { letter: 'Q', word: 'Mech' },
            { letter: 'R', word: 'Mr.' },
            { letter: 'S', word: 'Master' },
            { letter: 'T', word: 'Matt' },
            { letter: 'U', word: 'Mew' },
            { letter: 'V', word: 'Move' },
            { letter: 'W', word: 'Mow' },
            { letter: 'X', word: 'Max' },
        ],
    },
    {
        letter: 'N',
        pairs: [
            { letter: 'A', word: 'Nana' },
            { letter: 'B', word: 'Numb' },
            { letter: 'C', word: 'Nice' },
            { letter: 'D', word: 'Ned' },
            { letter: 'E', word: 'Neat' },
            { letter: 'F', word: 'Nifty' },
            { letter: 'G', word: 'Noggin' },
            { letter: 'H', word: 'New Hampshire' },
            { letter: 'I', word: 'Ni' },
            { letter: 'J', word: 'Nudge' },
            { letter: 'K', word: 'Nike' },
            { letter: 'L', word: 'Noel' },
            { letter: 'M', word: 'Enemy' },
            { letter: 'N', word: '-' },
            { letter: 'O', word: 'No' },
            { letter: 'P', word: 'Nap' },
            { letter: 'Q', word: 'Neck' },
            { letter: 'R', word: 'Nora' },
            { letter: 'S', word: 'Nest' },
            { letter: 'T', word: 'Net' },
            { letter: 'U', word: 'New' },
            { letter: 'V', word: 'Naive' },
            { letter: 'W', word: 'Now' },
            { letter: 'X', word: 'Next' },
        ],
    },
    {
        letter: 'O',
        pairs: [
            { letter: 'A', word: 'Oat' },
            { letter: 'B', word: 'Orb' },
            { letter: 'C', word: 'Orange County' },
            { letter: 'D', word: 'Odie' },
            { letter: 'E', word: 'Olé' },
            { letter: 'F', word: 'Of' },
            { letter: 'G', word: 'Oak Grove' },
            { letter: 'H', word: 'Oh' },
            { letter: 'I', word: 'Oil' },
            { letter: 'J', word: 'Orange Juice' },
            { letter: 'K', word: 'Okay' },
            { letter: 'L', word: 'Old' },
            { letter: 'M', word: 'Omastar' },
            { letter: 'N', word: 'On' },
            { letter: 'O', word: '-' },
            { letter: 'P', word: 'Opa' },
            { letter: 'Q', word: 'Oak' },
            { letter: 'R', word: 'Or' },
            { letter: 'S', word: 'Operating System' },
            { letter: 'T', word: 'Otter' },
            { letter: 'U', word: 'Out' },
            { letter: 'V', word: 'Over' },
            { letter: 'W', word: 'Ow' },
            { letter: 'X', word: 'Ox' },
        ],
    },
    {
        letter: 'P',
        pairs: [
            { letter: 'A', word: 'Papa' },
            { letter: 'B', word: 'Peanut Butter' },
            { letter: 'C', word: 'Pace' },
            { letter: 'D', word: 'Pad' },
            { letter: 'E', word: 'Pee' },
            { letter: 'F', word: 'Piff' },
            { letter: 'G', word: 'Pig' },
            { letter: 'H', word: 'Phone' },
            { letter: 'I', word: 'Pie' },
            { letter: 'J', word: 'Pajamas' },
            { letter: 'K', word: 'Pack' },
            { letter: 'L', word: 'Pill' },
            { letter: 'M', word: 'Pam' },
            { letter: 'N', word: 'Pen' },
            { letter: 'O', word: 'Poe' },
            { letter: 'P', word: '-' },
            { letter: 'Q', word: 'Poke' },
            { letter: 'R', word: 'Poor' },
            { letter: 'S', word: 'Post' },
            { letter: 'T', word: 'Pet' },
            { letter: 'U', word: 'Poo' },
            { letter: 'V', word: 'Pave' },
            { letter: 'W', word: 'Paw' },
            { letter: 'X', word: 'Pax' },
        ],
    },
    {
        letter: 'Q',
        pairs: [
            { letter: 'A', word: 'QuestionAnswer' },
            { letter: 'B', word: 'Quarterback' },
            { letter: 'C', word: 'Quick' },
            { letter: 'D', word: 'Quad' },
            { letter: 'E', word: 'Qué' },
            { letter: 'F', word: 'Queef' },
            { letter: 'G', word: 'Quagmire' },
            { letter: 'H', word: 'Quohog' },
            { letter: 'I', word: 'Qi (Scrabble)' },
            { letter: 'J', word: 'CrackerJacks' },
            { letter: 'K', word: 'Quake' },
            { letter: 'L', word: 'Quail' },
            { letter: 'M', word: 'Quartermaster' },
            { letter: 'N', word: 'Quant' },
            { letter: 'O', word: 'Quo' },
            { letter: 'P', word: 'Quip' },
            { letter: 'Q', word: '-' },
            { letter: 'R', word: 'Quart' },
            { letter: 'S', word: 'Quest' },
            { letter: 'T', word: 'Quit' },
            { letter: 'U', word: 'Qu' },
            { letter: 'V', word: 'Quiver' },
            { letter: 'W', word: 'Quaint' },
            { letter: 'X', word: 'Quacks' },
        ],
    },
    {
        letter: 'R',
        pairs: [
            { letter: 'A', word: 'Ray' },
            { letter: 'B', word: 'Root Beer' },
            { letter: 'C', word: 'Rice' },
            { letter: 'D', word: 'Ride' },
            { letter: 'E', word: 'Read' },
            { letter: 'F', word: 'Referee' },
            { letter: 'G', word: 'Rag' },
            { letter: 'H', word: 'Rhombus' },
            { letter: 'I', word: 'Rye' },
            { letter: 'J', word: 'Ridge' },
            { letter: 'K', word: 'Rake' },
            { letter: 'L', word: 'Rail' },
            { letter: 'M', word: 'Ram' },
            { letter: 'N', word: 'Run' },
            { letter: 'O', word: 'Row' },
            { letter: 'P', word: 'Rap' },
            { letter: 'Q', word: 'Roche' },
            { letter: 'R', word: '-' },
            { letter: 'S', word: 'Rest' },
            { letter: 'T', word: 'Right' },
            { letter: 'U', word: 'Roo' },
            { letter: 'V', word: 'Rave' },
            { letter: 'W', word: 'Raw' },
            { letter: 'X', word: 'Rex' },
        ],
    },
    {
        letter: 'S',
        pairs: [
            { letter: 'A', word: 'Say' },
            { letter: 'B', word: 'Sobble' },
            { letter: 'C', word: 'Scent' },
            { letter: 'D', word: 'Sad' },
            { letter: 'E', word: 'See' },
            { letter: 'F', word: 'Safe' },
            { letter: 'G', word: 'Sag' },
            { letter: 'H', word: 'Shh' },
            { letter: 'I', word: 'Sipher' },
            { letter: 'J', word: 'Sledge' },
            { letter: 'K', word: 'Sack' },
            { letter: 'L', word: 'Slay' },
            { letter: 'M', word: 'Sam' },
            { letter: 'N', word: 'Sun' },
            { letter: 'O', word: 'So' },
            { letter: 'P', word: 'Sap' },
            { letter: 'Q', word: 'Squire' },
            { letter: 'R', word: 'Senior' },
            { letter: 'S', word: '-' },
            { letter: 'T', word: 'Sit' },
            { letter: 'U', word: 'Sue' },
            { letter: 'V', word: 'Save' },
            { letter: 'W', word: 'Southwest' },
            { letter: 'X', word: 'Sax' },
        ],
    },
    {
        letter: 'T',
        pairs: [
            { letter: 'A', word: 'Tay' },
            { letter: 'B', word: 'Tab' },
            { letter: 'C', word: 'TC Pro' },
            { letter: 'D', word: 'Toad' },
            { letter: 'E', word: 'Tea' },
            { letter: 'F', word: 'Taffy' },
            { letter: 'G', word: 'Tag' },
            { letter: 'H', word: 'The' },
            { letter: 'I', word: 'Tie' },
            { letter: 'J', word: 'Taj Mahal' },
            { letter: 'K', word: 'Tak' },
            { letter: 'L', word: 'Tail' },
            { letter: 'M', word: 'Tim' },
            { letter: 'N', word: 'Ten' },
            { letter: 'O', word: 'To' },
            { letter: 'P', word: 'Tip' },
            { letter: 'Q', word: 'Toke' },
            { letter: 'R', word: 'Tar' },
            { letter: 'S', word: 'Test' },
            { letter: 'T', word: '-' },
            { letter: 'U', word: 'Tutu' },
            { letter: 'V', word: 'Television' },
            { letter: 'W', word: 'Tow' },
            { letter: 'X', word: 'Texas' },
        ],
    },
    {
        letter: 'U',
        pairs: [
            { letter: 'A', word: 'United Airlines' },
            { letter: 'B', word: 'Ubisoft' },
            { letter: 'C', word: 'UC (cal)' },
            { letter: 'D', word: 'IUD' },
            { letter: 'E', word: 'Uematsu' },
            { letter: 'F', word: 'UFO' },
            { letter: 'G', word: 'Uggs' },
            { letter: 'H', word: 'Uhh' },
            { letter: 'I', word: 'User Interface' },
            { letter: 'J', word: 'Udge' },
            { letter: 'K', word: 'United Kingdom' },
            { letter: 'L', word: 'Ultimate' },
            { letter: 'M', word: 'Um' },
            { letter: 'N', word: 'United Nations' },
            { letter: 'O', word: 'Nobuo' },
            { letter: 'P', word: 'Up' },
            { letter: 'Q', word: 'Unique' },
            { letter: 'R', word: 'URL website' },
            { letter: 'S', word: 'United States' },
            { letter: 'T', word: 'Utah' },
            { letter: 'U', word: '-' },
            { letter: 'V', word: 'UV light' },
            { letter: 'W', word: 'Uwu' },
            { letter: 'X', word: 'User Experience' },
        ],
    },
    {
        letter: 'V',
        pairs: [
            { letter: 'A', word: 'Veteran' },
            { letter: 'B', word: 'Vibe' },
            { letter: 'C', word: 'Vice' },
            { letter: 'D', word: 'Video' },
            { letter: 'E', word: 'Vee' },
            { letter: 'F', word: 'Verify' },
            { letter: 'G', word: 'Vegeta' },
            { letter: 'H', word: 'VHS' },
            { letter: 'I', word: 'Vivi' },
            { letter: 'J', word: 'Vijay' },
            { letter: 'K', word: 'Viking' },
            { letter: 'L', word: 'Vial' },
            { letter: 'M', word: 'Vim' },
            { letter: 'N', word: 'Vent' },
            { letter: 'O', word: 'Voh' },
            { letter: 'P', word: 'Vice President' },
            { letter: 'Q', word: 'Vacuum' },
            { letter: 'R', word: 'Virtual Reality' },
            { letter: 'S', word: 'Vest' },
            { letter: 'T', word: 'Vet' },
            { letter: 'U', word: 'Vue' },
            { letter: 'V', word: '-' },
            { letter: 'W', word: 'Volkswagon' },
            { letter: 'X', word: 'Vex' },
        ],
    },
    {
        letter: 'W',
        pairs: [
            { letter: 'A', word: 'Way' },
            { letter: 'B', word: 'Web' },
            { letter: 'C', word: 'Water Closet' },
            { letter: 'D', word: 'Wedding' },
            { letter: 'E', word: 'We' },
            { letter: 'F', word: 'Wife' },
            { letter: 'G', word: 'Wag' },
            { letter: 'H', word: 'White House' },
            { letter: 'I', word: 'Wii' },
            { letter: 'J', word: 'Wedge' },
            { letter: 'K', word: 'Wake' },
            { letter: 'L', word: 'Will' },
            { letter: 'M', word: 'Watermelon' },
            { letter: 'N', word: 'Win' },
            { letter: 'O', word: 'Wow' },
            { letter: 'P', word: 'Whip' },
            { letter: 'Q', word: 'Woke' },
            { letter: 'R', word: 'War' },
            { letter: 'S', word: 'West' },
            { letter: 'T', word: 'Water' },
            { letter: 'U', word: 'Woo' },
            { letter: 'V', word: 'Wave' },
            { letter: 'W', word: '-' },
            { letter: 'X', word: 'Wax' },
        ],
    },
    {
        letter: 'X',
        pairs: [
            { letter: 'A', word: 'Exam' },
            { letter: 'B', word: 'Chub' },
            { letter: 'C', word: 'Executive' },
            { letter: 'D', word: 'Chad' },
            { letter: 'E', word: 'Z' },
            { letter: 'F', word: 'Zephyr' },
            { letter: 'G', word: 'Zigzag' },
            { letter: 'H', word: 'Extra hot' },
            { letter: 'I', word: 'Xi' },
            { letter: 'J', word: 'Zeej' },
            { letter: 'K', word: 'Chalk' },
            { letter: 'L', word: 'Extra Large' },
            { letter: 'M', word: 'Zim' },
            { letter: 'N', word: 'Zen' },
            { letter: 'O', word: 'Hugs/kisses xoxo' },
            { letter: 'P', word: 'Experience Points' },
            { letter: 'Q', word: 'Check' },
            { letter: 'R', word: 'Chore' },
            { letter: 'S', word: 'Exes' },
            { letter: 'T', word: 'Exit' },
            { letter: 'U', word: 'Chew' },
            { letter: 'V', word: 'Chive' },
            { letter: 'W', word: 'Chow' },
            { letter: 'X', word: '-' },
        ],
    },
];

// Removing the dashes to make logic in trainer easier
const letterPairMappingForTrainer: LetterPair[] = letterPairTableMapping.map((letterPair) => {
    return {
        letter: letterPair.letter,
        pairs: letterPair.pairs.filter((pair) => pair.word != '-'),
    };
});
