import React, { useState } from 'react';
import { Solve } from '../../utils/cubingUtils';
import { FaceState, SingleFaceVisualizationComponent } from '../CubeVisualizationComponent';
import { SolveDataAction } from '../GoodTimes';

import './CasePickerComponent.scss';
import { pllCases } from '../../utils/cases/3x3x3/pll';
import { ollCases } from '../../utils/cases/3x3x3/oll';
import { ortegaCases } from '../../utils/cases/2x2x2/ortega';

export type AlgSets = 'oll' | 'pll' | 'oh' | 'ortega' | 'coll' | 'eg1' | 'eg2' | 'parity';

type CasePickerComponentProps = {
    solve: Solve;
    algSet: AlgSets;
    dispatchSolveData: React.Dispatch<SolveDataAction>;
    solveIndex: number;
    onSelect?: () => void;
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
    state?: FaceState;
    algs?: string[];
    algNotes?: string[];
    auf?: string[];
};

const algSetDataMap: {
    [k in AlgSets]: {
        caseGroup: CaseGroup;
        setAction?: 'SET_PLL_CASE' | 'SET_OLL_CASE';
        id: AlgSets;
    };
} = {
    pll: {
        caseGroup: pllCases,
        setAction: 'SET_PLL_CASE',
        id: 'pll',
    },
    oll: {
        caseGroup: ollCases,
        setAction: 'SET_OLL_CASE',
        id: 'oll',
    },
    oh: {
        caseGroup: [],
        id: 'oh',
    },
    ortega: {
        caseGroup: ortegaCases,
        id: 'ortega',
    },
    coll: {
        caseGroup: [],
        id: 'coll',
    },
    eg1: {
        caseGroup: [],
        id: 'eg1',
    },
    eg2: {
        caseGroup: [],
        id: 'eg2',
    },
    parity: {
        caseGroup: [],
        id: 'parity',
    },
};

export default function CasePickerComponent({
    solve,
    algSet,
    dispatchSolveData,
    solveIndex,
    onSelect = () => null,
}: CasePickerComponentProps): JSX.Element {
    if (solve?.analysisData == null || algSetDataMap[algSet] == null) {
        return <></>;
    }
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

    return (
        <div className='case-picker'>
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
            <div className='case-picker__case-list'>
                {currentlyViewingCaseGroup.cases.map((c, index) => {
                    return (
                        <div
                            className={`case${currentCaseId === c.id ? ' case--selected' : ''}`}
                            key={index}
                            onClick={() => {
                                const value = currentCaseId === c.id ? undefined : c.id;
                                dispatchSolveData({
                                    // TODO: remove null coalescence when have all actions
                                    type: algSetData?.setAction ?? 'SET_PLL_CASE',
                                    data: {
                                        index: solveIndex,
                                        value,
                                    },
                                });
                                onSelect();
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
