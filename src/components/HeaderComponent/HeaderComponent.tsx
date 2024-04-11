import React from 'react';

import { ReactComponent as GearIcon } from '../../icons/gear.svg';
import { ReactComponent as GraphIcon } from '../../icons/graph.svg';
import { AppMode } from '../GoodTimes';

import './HeaderComponent.scss';

export default function HeaderComponent({ setAppMode }: { setAppMode: (appMode: AppMode) => void }) {
    return (
        <header className='timer__header'>
            <div className='timer__header-actions'>
                <button
                    className='timer__button'
                    onClick={() => {
                        setAppMode(AppMode.TIMER);
                    }}
                >
                    Timer
                </button>
                <button
                    className='timer__button'
                    onClick={() => {
                        setAppMode(AppMode.INSIGHTS);
                    }}
                >
                    <GraphIcon className='timer__icon' aria-label='Insights' />
                </button>
                <button
                    className='timer__button'
                    onClick={() => {
                        setAppMode(AppMode.SETTINGS);
                    }}
                >
                    <GearIcon className='timer__icon' aria-label='Settings' />
                </button>
            </div>
            <div className='timer__header-title'>Good Times</div>
        </header>
    );
}
