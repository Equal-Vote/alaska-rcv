import { Fragment } from "react";
import { SimTransition } from "../SimTransition";

const elections = ['alaska-2022', 'burlington-2009'];
const failures = ['condorcet failure', 'monotonicity failure', 'no show failure'];

const electionSelectorTransitions = (simState, setRefreshBool) =>
    [
        new SimTransition({
            explainer:  <div className='electionSelector'>
                {elections.map((election,i) => (
                    <Fragment key={i}>
                        <label htmlFor={`electionSelector-${election}`}>
                            {election}
                        </label>
                        <input
                            id={`electionSelector-${election}`}
                            className="electionSelector"
                            type="radio"
                            name="election" 
                            onChange={() => {
                                simState.selectorElection=election;
                                setRefreshBool(b => !b);
                            }}/>
                    </Fragment>
                ))}
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

export default electionSelectorTransitions;