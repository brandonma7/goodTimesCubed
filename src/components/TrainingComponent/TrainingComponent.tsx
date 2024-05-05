import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import BldTrainerComponent from '../BldTrainerComponent';
import TwoSideLibraryComponent from '../TwoSideLibraryComponent';
import './TrainingComponent.scss';

export default function TrainingComponent() {
    const navigate = useNavigate();
    return (
        <div className='timer__trainer-component'>
            <div>
                <button className='timer__button' onClick={() => navigate('p2s')}>
                    Two Side PLL
                </button>
                <button className='timer__button' onClick={() => navigate('bld')}>
                    BLD
                </button>
            </div>

            <div>
                <Routes>
                    <Route path='p2s/*' element={<TwoSideLibraryComponent />} />
                    <Route path='bld/*' element={<BldTrainerComponent />} />
                </Routes>
            </div>
        </div>
    );
}
