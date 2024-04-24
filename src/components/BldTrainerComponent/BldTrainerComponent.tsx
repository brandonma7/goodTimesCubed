import React, { useState } from 'react';
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

function LetterPairTable() {
    return (
        <table className='basic-table'>
            <thead>
                <tr>
                    <th className='bld-pair-column'></th>
                    {letterPairTableMapping.map((letterPair, index) => {
                        return (
                            <th key={index} className='bld-pair-column'>
                                {letterPair.letter}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {letterPairTableMapping.map((letterPair, index) => {
                    return (
                        <tr key={index}>
                            <td className='bld-pair-row'>{letterPair.letter}</td>
                            {letterPair.pairs.map((pair, index) => {
                                return (
                                    <td
                                        key={index}
                                        className={pair.letter === letterPair.letter ? 'bld-pair--null' : ''}
                                    >
                                        {pair.word}
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
            { letter: 'F', word: 'As Fuck' },
            { letter: 'G', word: 'Age' },
            { letter: 'H', word: 'Ahh' },
            { letter: 'I', word: 'Artificial Intelligence' },
            { letter: 'J', word: 'Apple Jacks' },
            { letter: 'K', word: 'Ache' },
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
            { letter: 'X', word: 'Ax' },
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
            { letter: 'H', word: 'Big House' },
            { letter: 'I', word: 'Bi' },
            { letter: 'J', word: 'Blowjob' },
            { letter: 'K', word: 'Burger King' },
            { letter: 'L', word: 'Ball' },
            { letter: 'M', word: 'Bomb' },
            { letter: 'N', word: 'Band' },
            { letter: 'O', word: 'Bo peep' },
            { letter: 'P', word: 'Boop' },
            { letter: 'Q', word: 'Baroque' },
            { letter: 'R', word: 'Bro' },
            { letter: 'S', word: 'Bullshit' },
            { letter: 'T', word: 'Bat' },
            { letter: 'U', word: 'Butt' },
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
            { letter: 'F', word: 'Coffin' },
            { letter: 'G', word: 'Cog' },
            { letter: 'H', word: 'Chop' },
            { letter: 'I', word: '101' },
            { letter: 'J', word: 'CeeJay' },
            { letter: 'K', word: 'Cock' },
            { letter: 'L', word: 'Clay' },
            { letter: 'M', word: 'Camera' },
            { letter: 'N', word: 'Can' },
            { letter: 'O', word: 'Cone' },
            { letter: 'P', word: 'Cop' },
            { letter: 'Q', word: 'Croque' },
            { letter: 'R', word: 'Core' },
            { letter: 'S', word: 'Cost' },
            { letter: 'T', word: 'Coat' },
            { letter: 'U', word: 'Cut' },
            { letter: 'V', word: 'Cove' },
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
            { letter: 'I', word: 'Die' },
            { letter: 'J', word: 'DJ' },
            { letter: 'K', word: 'Donkey Kong' },
            { letter: 'L', word: 'Dill' },
            { letter: 'M', word: 'Dumb' },
            { letter: 'N', word: 'Den' },
            { letter: 'O', word: 'Doodoo' },
            { letter: 'P', word: 'Dip' },
            { letter: 'Q', word: 'Dairy Queen' },
            { letter: 'R', word: 'Door' },
            { letter: 'S', word: 'Desk' },
            { letter: 'T', word: 'Data' },
            { letter: 'U', word: 'Dude' },
            { letter: 'V', word: 'Dave' },
            { letter: 'W', word: 'Dweeb' },
            { letter: 'X', word: 'Dexter' },
        ],
    },
    {
        letter: 'E',
        pairs: [
            { letter: 'A', word: 'Madden' },
            { letter: 'B', word: 'EB Games' },
            { letter: 'C', word: 'Echo' },
            { letter: 'D', word: 'Eddy' },
            { letter: 'E', word: '-' },
            { letter: 'F', word: 'Enough' },
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
            { letter: 'T', word: 'Phone home' },
            { letter: 'U', word: 'Europe' },
            { letter: 'V', word: 'EV car' },
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
            { letter: 'H', word: 'Fetch' },
            { letter: 'I', word: 'Fi' },
            { letter: 'J', word: 'Fudge' },
            { letter: 'K', word: 'Fuck' },
            { letter: 'L', word: 'Fall' },
            { letter: 'M', word: 'Family' },
            { letter: 'N', word: 'Fan' },
            { letter: 'O', word: 'Foe' },
            { letter: 'P', word: 'Flip' },
            { letter: 'Q', word: 'Farquad' },
            { letter: 'R', word: 'Four' },
            { letter: 'S', word: 'Fast' },
            { letter: 'T', word: 'Foot' },
            { letter: 'U', word: 'Fun' },
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
            { letter: 'F', word: 'Gift' },
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
            { letter: 'R', word: 'Grass' },
            { letter: 'S', word: 'Gas' },
            { letter: 'T', word: 'Goat' },
            { letter: 'U', word: 'Goo' },
            { letter: 'V', word: 'Gravel' },
            { letter: 'W', word: 'Grow' },
            { letter: 'X', word: 'Gecko' },
        ],
    },
    {
        letter: 'H',
        pairs: [
            { letter: 'A', word: 'Haha' },
            { letter: 'B', word: 'Hobby' },
            { letter: 'C', word: 'Hockey' },
            { letter: 'D', word: 'Hard' },
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
            { letter: 'S', word: 'Hose' },
            { letter: 'T', word: 'Hot' },
            { letter: 'U', word: 'Human' },
            { letter: 'V', word: 'Heaven' },
            { letter: 'W', word: 'ohW' },
            { letter: 'X', word: 'Hacks' },
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
            { letter: 'F', word: 'Iffy' },
            { letter: 'G', word: 'Instagram' },
            { letter: 'H', word: 'iH' },
            { letter: 'I', word: '-' },
            { letter: 'J', word: 'Idget' },
            { letter: 'K', word: 'Ick' },
            { letter: 'L', word: 'Ill' },
            { letter: 'M', word: 'Important' },
            { letter: 'N', word: 'In' },
            { letter: 'O', word: 'I/O' },
            { letter: 'P', word: 'IP address' },
            { letter: 'Q', word: 'IQ' },
            { letter: 'R', word: 'Infrared' },
            { letter: 'S', word: 'Is' },
            { letter: 'T', word: 'It' },
            { letter: 'U', word: 'I&U' },
            { letter: 'V', word: 'Ivory' },
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
            { letter: 'L', word: 'Jill' },
            { letter: 'M', word: 'Jam' },
            { letter: 'N', word: 'John' },
            { letter: 'O', word: 'Joe' },
            { letter: 'P', word: 'JP' },
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
            { letter: 'H', word: 'Kindhearted' },
            { letter: 'I', word: 'Kick' },
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
            { letter: 'D', word: 'Ladel' },
            { letter: 'E', word: 'Lee' },
            { letter: 'F', word: 'Leaf' },
            { letter: 'G', word: 'Leg' },
            { letter: 'H', word: 'Laugh' },
            { letter: 'I', word: 'Lie' },
            { letter: 'J', word: 'Ledge' },
            { letter: 'K', word: 'Lick' },
            { letter: 'L', word: '-' },
            { letter: 'M', word: 'Limb' },
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
            { letter: 'G', word: 'Magazine' },
            { letter: 'H', word: 'My heart' },
            { letter: 'I', word: 'Mii' },
            { letter: 'J', word: 'Michael Jackson' },
            { letter: 'K', word: 'Mike' },
            { letter: 'L', word: 'Mail' },
            { letter: 'M', word: '-' },
            { letter: 'N', word: 'Man' },
            { letter: 'O', word: 'Moe' },
            { letter: 'P', word: 'Map' },
            { letter: 'Q', word: 'Mecha' },
            { letter: 'R', word: 'Mr.' },
            { letter: 'S', word: 'Master' },
            { letter: 'T', word: 'Matt' },
            { letter: 'U', word: 'Mew' },
            { letter: 'V', word: 'Mohave' },
            { letter: 'W', word: 'Maw' },
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
            { letter: 'H', word: 'Mash' },
            { letter: 'I', word: 'Ni' },
            { letter: 'J', word: 'Nudge' },
            { letter: 'K', word: 'Nick' },
            { letter: 'L', word: 'Null' },
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
            { letter: 'Q', word: 'Oh Quick' },
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
            { letter: 'G', word: 'Peg' },
            { letter: 'H', word: 'Phone' },
            { letter: 'I', word: 'Pie' },
            { letter: 'J', word: 'Pajamas' },
            { letter: 'K', word: 'Pack' },
            { letter: 'L', word: 'Pill' },
            { letter: 'M', word: 'Pam' },
            { letter: 'N', word: 'Pen' },
            { letter: 'O', word: 'Poe' },
            { letter: 'P', word: '-' },
            { letter: 'Q', word: 'Peck' },
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
            { letter: 'A', word: 'Quack' },
            { letter: 'B', word: 'Quarterback' },
            { letter: 'C', word: 'Quick' },
            { letter: 'D', word: 'Quad' },
            { letter: 'E', word: 'Qué' },
            { letter: 'F', word: 'Queef' },
            { letter: 'G', word: 'Quagmire' },
            { letter: 'H', word: 'Quohog' },
            { letter: 'I', word: 'Qi' },
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
            { letter: 'A', word: 'Rat' },
            { letter: 'B', word: 'Rub' },
            { letter: 'C', word: 'Race' },
            { letter: 'D', word: 'Rode' },
            { letter: 'E', word: 'Read' },
            { letter: 'F', word: 'Referee' },
            { letter: 'G', word: 'Rag' },
            { letter: 'H', word: 'Rhombus' },
            { letter: 'I', word: 'Rice' },
            { letter: 'J', word: 'Ridge' },
            { letter: 'K', word: 'Rake' },
            { letter: 'L', word: 'Rail' },
            { letter: 'M', word: 'Ram' },
            { letter: 'N', word: 'Run' },
            { letter: 'O', word: 'Row' },
            { letter: 'P', word: 'Rope' },
            { letter: 'Q', word: 'Roche' },
            { letter: 'R', word: '-' },
            { letter: 'S', word: 'Rise' },
            { letter: 'T', word: 'Rot' },
            { letter: 'U', word: 'Roo' },
            { letter: 'V', word: 'Rave' },
            { letter: 'W', word: 'Raw' },
            { letter: 'X', word: 'Rex' },
        ],
    },
    {
        letter: 'S',
        pairs: [
            { letter: 'A', word: 'Saw' },
            { letter: 'B', word: 'Sandbox' },
            { letter: 'C', word: 'Scare' },
            { letter: 'D', word: 'Sad' },
            { letter: 'E', word: 'See' },
            { letter: 'F', word: 'San Fran' },
            { letter: 'G', word: 'Sag' },
            { letter: 'H', word: 'Shh' },
            { letter: 'I', word: 'Sipher' },
            { letter: 'J', word: 'Sledge' },
            { letter: 'K', word: 'Sack' },
            { letter: 'L', word: 'Slay' },
            { letter: 'M', word: 'Samoa' },
            { letter: 'N', word: 'Sun' },
            { letter: 'O', word: 'Soap' },
            { letter: 'P', word: 'Sap' },
            { letter: 'Q', word: 'Esquire' },
            { letter: 'R', word: 'Sir' },
            { letter: 'S', word: '-' },
            { letter: 'T', word: 'Star' },
            { letter: 'U', word: 'Soup' },
            { letter: 'V', word: 'Save' },
            { letter: 'W', word: 'Southwest' },
            { letter: 'X', word: 'Sax' },
        ],
    },
    {
        letter: 'T',
        pairs: [
            { letter: 'A', word: 'Tattoo' },
            { letter: 'B', word: 'Tab' },
            { letter: 'C', word: 'Total Comp' },
            { letter: 'D', word: 'Toad' },
            { letter: 'E', word: 'Tea' },
            { letter: 'F', word: 'Taffy' },
            { letter: 'G', word: 'Tag' },
            { letter: 'H', word: 'The' },
            { letter: 'I', word: 'Tie' },
            { letter: 'J', word: 'Taj Mahal' },
            { letter: 'K', word: 'Tak' },
            { letter: 'L', word: 'Till' },
            { letter: 'M', word: 'TM' },
            { letter: 'N', word: 'Tin' },
            { letter: 'O', word: 'Toe' },
            { letter: 'P', word: 'Top' },
            { letter: 'Q', word: 'Toke' },
            { letter: 'R', word: 'Tar' },
            { letter: 'S', word: 'Test' },
            { letter: 'T', word: '-' },
            { letter: 'U', word: 'Tutu' },
            { letter: 'V', word: 'Trevor' },
            { letter: 'W', word: 'Two' },
            { letter: 'X', word: 'Tax' },
        ],
    },
    {
        letter: 'U',
        pairs: [
            { letter: 'A', word: 'United' },
            { letter: 'B', word: 'Ubisoft' },
            { letter: 'C', word: 'UC (cal)' },
            { letter: 'D', word: 'IUD' },
            { letter: 'E', word: 'Uematsu' },
            { letter: 'F', word: 'UFO' },
            { letter: 'G', word: 'Ugh' },
            { letter: 'H', word: 'Uhh' },
            { letter: 'I', word: 'User Interface' },
            { letter: 'J', word: 'Udge' },
            { letter: 'K', word: 'United Kingdom' },
            { letter: 'L', word: 'Unordered List' },
            { letter: 'M', word: 'Umm' },
            { letter: 'N', word: 'Unite' },
            { letter: 'O', word: 'Nobuo' },
            { letter: 'P', word: 'Up' },
            { letter: 'Q', word: 'Unique' },
            { letter: 'R', word: 'URL website' },
            { letter: 'S', word: 'United States' },
            { letter: 'T', word: 'UTI' },
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
            { letter: 'F', word: 'Vodophone' },
            { letter: 'G', word: 'Vegeta' },
            { letter: 'H', word: 'VHS' },
            { letter: 'I', word: 'Vivi' },
            { letter: 'J', word: 'Vaj' },
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
            { letter: 'U', word: 'Mr. Vu' },
            { letter: 'V', word: '-' },
            { letter: 'W', word: 'Volkswagon' },
            { letter: 'X', word: 'Vex' },
        ],
    },
    {
        letter: 'W',
        pairs: [
            { letter: 'A', word: 'Washington' },
            { letter: 'B', word: 'Web' },
            { letter: 'C', word: 'Water Closet' },
            { letter: 'D', word: 'Wedding' },
            { letter: 'E', word: 'Weewee' },
            { letter: 'F', word: 'Wife' },
            { letter: 'G', word: 'Wag' },
            { letter: 'H', word: 'White House' },
            { letter: 'I', word: 'Wii' },
            { letter: 'J', word: 'Wedge' },
            { letter: 'K', word: 'Wok' },
            { letter: 'L', word: 'Whale' },
            { letter: 'M', word: 'Watermelon' },
            { letter: 'N', word: 'Win' },
            { letter: 'O', word: 'Wow' },
            { letter: 'P', word: 'Whip' },
            { letter: 'Q', word: 'Watch' },
            { letter: 'R', word: 'War' },
            { letter: 'S', word: 'West' },
            { letter: 'T', word: 'Water' },
            { letter: 'U', word: 'Wut' },
            { letter: 'V', word: 'Wave' },
            { letter: 'W', word: '-' },
            { letter: 'X', word: 'Wax' },
        ],
    },
    {
        letter: 'X',
        pairs: [
            { letter: 'A', word: 'Exam' },
            { letter: 'B', word: 'Ex-bf' },
            { letter: 'C', word: 'Excite' },
            { letter: 'D', word: 'Laughing face XD' },
            { letter: 'E', word: 'Z' },
            { letter: 'F', word: 'Zephyr' },
            { letter: 'G', word: 'Zigzag' },
            { letter: 'H', word: 'Extra hot' },
            { letter: 'I', word: 'Xi' },
            { letter: 'J', word: 'ZJ' },
            { letter: 'K', word: 'Exec' },
            { letter: 'L', word: 'Extra Large' },
            { letter: 'M', word: 'Zim' },
            { letter: 'N', word: 'Zen' },
            { letter: 'O', word: 'Hugs/kisses xoxo' },
            { letter: 'P', word: 'Experience Points' },
            { letter: 'Q', word: 'Quetzalcoatl' },
            { letter: 'R', word: 'Zorro' },
            { letter: 'S', word: 'Extra Small' },
            { letter: 'T', word: 'Exit' },
            { letter: 'U', word: 'Zu' },
            { letter: 'V', word: '15' },
            { letter: 'W', word: 'Woz' },
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
