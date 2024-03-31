import React, { useState } from 'react';
import { Solve } from '../../utils/cubingUtils';
import { FaceState, SingleFaceVisualizationComponent } from '../CubeVisualizationComponent';
import { SolveDataAction } from '../Timer';

import './CasePickerComponent.scss';
import { pllCases } from './PllCases';
import { ollCases } from './OllCases';

type AlgSets = 'oll' | 'pll';

type CasePickerComponentProps = {
    solve: Solve;
    algSet: AlgSets;
    dispatchSolveData: React.Dispatch<SolveDataAction>;
    solveIndex: number;
};

/** A group of cases, like Opposite Swap or T-shapes */
export type CaseGroup = {
    name: string;
    cases: Case[];
}[];

/** A specific case, like T perm */
export type Case = {
    id: string;
    name: string;
    state: FaceState;
};

const algSetDataMap: {
    [k in AlgSets]: {
        caseGroup: CaseGroup;
        setAction: 'SET_PLL_CASE' | 'SET_OLL_CASE';
        id: 'pllCase' | 'ollCase';
    };
} = {
    pll: {
        caseGroup: pllCases,
        setAction: 'SET_PLL_CASE',
        id: 'pllCase',
    },
    oll: {
        caseGroup: ollCases,
        setAction: 'SET_OLL_CASE',
        id: 'ollCase',
    },
};

export default function CasePickerComponent({
    solve,
    algSet,
    dispatchSolveData,
    solveIndex,
}: CasePickerComponentProps): JSX.Element {
    // Alg set data contains case definitions and other metadata
    const algSetData = algSetDataMap[algSet];
    // Selected case currently stored for this solve
    const currentCaseId = solve.analysisData[algSetData.id];
    // What case group does this solve already have so we can start there
    const currentlySelectedCaseGroupIndex = algSetData.caseGroup.findIndex((cg) => {
        return cg.cases.findIndex((c) => c.id === currentCaseId) !== -1;
    });
    const [currentGroupIndex, setCurrentGroupIndex] = useState(Math.max(currentlySelectedCaseGroupIndex, 0));

    // Group names refer to sub groups like opposite, adjacent, T-shapes
    const groupNames = algSetData.caseGroup.map((g) => g.name);
    // Current group of cases to render
    const currentlyViewingCaseGroup = algSetData.caseGroup[currentGroupIndex];
    // Name of currently selected case
    const currentCaseName = currentlyViewingCaseGroup.cases.find((c) => c.id === currentCaseId)?.name;

    return (
        <div>
            {algSet.toUpperCase()}: {currentCaseName ?? 'Not selected'}
            <div className='case-picker__group-tabs'>
                {groupNames.map((name, index) => {
                    const isSelected = currentGroupIndex === index;
                    return (
                        <div
                            key={index}
                            className={`group-tab${isSelected ? ' selected' : ''}`}
                            onClick={() => {
                                setCurrentGroupIndex(index);
                            }}
                        >
                            {name}
                        </div>
                    );
                })}
            </div>
            <div
                className='case-picker__case-list'
                style={{
                    width: currentlyViewingCaseGroup.cases.length === 4 ? 300 : 450,
                }}
            >
                {currentlyViewingCaseGroup.cases.map((c, index) => {
                    return (
                        <div
                            className={`case${currentCaseId === c.id ? ' case--selected' : ''}`}
                            key={index}
                            onClick={() => {
                                dispatchSolveData({
                                    type: algSetData.setAction,
                                    data: {
                                        index: solveIndex,
                                        value: c.id,
                                    },
                                });
                            }}
                        >
                            <div className='case__name'>{c.name}</div>
                            <SingleFaceVisualizationComponent faceState={c.state} puzzleType='3x3x3' />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
