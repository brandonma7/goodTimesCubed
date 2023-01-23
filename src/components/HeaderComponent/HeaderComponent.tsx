import React, { useContext } from 'react';
import { DialogContext, DialogType } from '../../dialogs/UseDialogsContext';

import { ReactComponent as GearIcon } from '../../icons/gear.svg';
import { ReactComponent as GraphIcon } from '../../icons/graph.svg';

import './HeaderComponent.scss';

export default function HeaderComponent() {
    const { setDialogData } = useContext(DialogContext);

    return (
        <header className='timer__header'>
            <div className='timer__header-actions'>
                <button
                    className='timer__button'
                    onClick={() => {
                        setDialogData({
                            dialogType: DialogType.INSIGHTS,
                            isOpen: true,
                        });
                    }}
                >
                    <GraphIcon className='timer__icon' aria-label='Insights' />
                </button>
                <button
                    className='timer__button'
                    onClick={() => {
                        setDialogData({
                            dialogType: DialogType.SETTINGS,
                            isOpen: true,
                        });
                    }}
                >
                    <GearIcon className='timer__icon' aria-label='Settings' />
                </button>
            </div>
            <div className='timer__header-title'>
                {'(GoodTimes)'}
                <sup>3</sup>
            </div>
        </header>
    );
}
