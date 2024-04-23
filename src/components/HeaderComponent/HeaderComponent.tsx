import React from 'react';

import { ReactComponent as BookIcon } from '../../icons/book.svg';
import { ReactComponent as GearIcon } from '../../icons/gear.svg';
import { ReactComponent as GraphIcon } from '../../icons/graph.svg';
import { ReactComponent as PencilIcon } from '../../icons/pencil.svg';
import { ReactComponent as PodiumIcon } from '../../icons/podium.svg';
import { ReactComponent as TimerIcon } from '../../icons/timer.svg';
import { ReactComponent as WeightIcon } from '../../icons/weight.svg';
import { AppMode } from '../GoodTimes';

import './HeaderComponent.scss';

export default function HeaderComponent({ setAppMode }: { setAppMode: (appMode: AppMode) => void }) {
    return (
        <header className='timer__header'>
            <div className='timer__header-title'>Good Times</div>
            <div className='timer__header-actions'>
                <button
                    className='timer__button'
                    onClick={() => {
                        setAppMode(AppMode.TIMER);
                    }}
                >
                    <TimerIcon className='timer__icon' aria-label='Timer' />
                </button>
                <button
                    className='timer__button'
                    onClick={() => {
                        setAppMode(AppMode.COMP);
                    }}
                >
                    <PodiumIcon className='timer__icon' aria-label='Comp Mode' />
                </button>
                <button
                    className='timer__button'
                    onClick={() => {
                        setAppMode(AppMode.MATH);
                    }}
                >
                    <PencilIcon className='timer__icon' aria-label='Manual Comp Mode' />
                </button>
                <button
                    className='timer__button'
                    onClick={() => {
                        setAppMode(AppMode.ALG);
                    }}
                >
                    <BookIcon className='timer__icon' aria-label='Algorithm Library' />
                </button>
                <button
                    className='timer__button'
                    onClick={() => {
                        setAppMode(AppMode.TRAIN);
                    }}
                >
                    <WeightIcon className='timer__icon' aria-label='Training' />
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
        </header>
    );
}
