import { Fragment } from "react";
import { SimTransition } from "../SimTransition";

const FAILURE= {
    'condorcet': 'condorcet failure',
    'mono': 'monotonicity failure',
    'noshow': 'no show failure',
    'compromise': 'compromise failure',
}

const electionSelectorTransitions = (simState, setRefreshBool) => {
    const elections = {
        'alaska-2022': {
            'failures': [FAILURE.condorcet, FAILURE.mono, FAILURE.noshow, FAILURE.compromise],
        },
        'burlington-2009': {
            'failures': [FAILURE.condorcet],
        },
    };
    return [
        new SimTransition({
            explainer:  <div className='electionSelector'>
                <select name="election" onChange={(event) => {
                    simState.selectorElection=event.target.value;
                    simState.selectorFailure=undefined;
                    document.querySelectorAll('.failureSelector').forEach((elem) =>{
                        let v = elections[event.target.value].failures.includes(elem.children[1].textContent)
                        elem.style.visibility = v? 'visible': 'hidden';
                    });
                    setRefreshBool(b => !b);
                }}>
                    {Object.keys(elections).map((election ,i) => 
                        <option key={i}>{election}</option>
                    )}
                </select>
                <br/><br/>
                {Object.entries(FAILURE).map(([failure, title], i) => 
                    <div className="failureSelector" key={i}>
                        <input
                            id={`failureSelector-${failure}`}
                            type="radio"
                            name="failure" 
                            onChange={() => {
                                simState.selectorFailure=failure;
                                setRefreshBool(b => !b);
                            }}
                        />
                        <label htmlFor={`failureSelector-${failure}`}>
                            {title}
                        </label>
                    </div>
                )}
            </div>
        }),
        new SimTransition({
            explainer: <p>Alaska</p>,
            electionTag: 'alaska-2022',
            failureTag: 'monotonicity'
        }),
        new SimTransition({
            explainer: <p>Burlington</p>,
            electionTag: 'burlington-2009',
            failureTag: 'condorcet'
        }),
    ];
}

export default electionSelectorTransitions;