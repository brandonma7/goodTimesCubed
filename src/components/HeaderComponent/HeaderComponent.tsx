import React, { useContext } from 'react';
import { DialogContext, DialogType } from '../../dialogs/UseDialogsContext';

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
                            dialogType: DialogType.SETTINGS,
                            isOpen: true,
                        });
                    }}
                >
                    Settings
                </button>
            </div>
            <div className='timer__header-title'>
                {'(FunTimes)'}
                <sup>3</sup>
            </div>
        </header>
    );
}
