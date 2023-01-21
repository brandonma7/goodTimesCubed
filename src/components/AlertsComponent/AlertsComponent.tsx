import React from 'react';
import { useContext } from 'react';
import { AlertsContext } from '../../TimerApp';

import './AlertsComponent.scss';

export default function AlertsComponent(): JSX.Element {
    const { alerts, deleteAlert } = useContext(AlertsContext);

    if (!alerts.length) {
        return <></>;
    }

    return (
        <div className='timer__alerts-container'>
            {alerts.map((alert, index) => {
                return (
                    <div key={index} className='timer__alert'>
                        <div className='timer__alert-message'>{alert}</div>
                        <button
                            className='timer__button'
                            onClick={() => {
                                deleteAlert(index);
                            }}
                        >
                            Close
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
