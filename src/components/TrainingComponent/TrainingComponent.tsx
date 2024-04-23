import React, { useState } from 'react';
import BldTrainerComponent from '../BldTrainerComponent';
import TwoSideLibraryComponent from '../TwoSideLibraryComponent';
import './TrainingComponent.scss';

type TrainerState = 'p2s' | 'bld';

function renderTrainer(trainer: TrainerState) {
    switch (trainer) {
        case 'p2s':
            return <TwoSideLibraryComponent />;
        case 'bld':
            return <BldTrainerComponent />;
    }
    return <></>;
}

export default function TrainingComponent() {
    const [trainer, setTrainer] = useState<TrainerState>('p2s');
    return (
        <div className='timer__trainer-component'>
            <div>
                <button className='timer__button' onClick={() => setTrainer('p2s')}>
                    Two Side PLL
                </button>
                <button className='timer__button' onClick={() => setTrainer('bld')}>
                    BLD
                </button>
            </div>
            <div>{renderTrainer(trainer)}</div>
        </div>
    );
}
