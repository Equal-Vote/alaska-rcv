import { Fragment } from "react";
import { SimTransition } from "../SimTransition";
import Candidate from "./Candidate";
import Voter from "./Voter";
import VoterCamp from "./VoterCamp";
import Pie from "./Pie";
import { VoterMovement } from "../VoterMovement";

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

    const introTransition = (electionName, description, camps) => {
        return new SimTransition({
            explainer: <p>{description}</p>,
            electionName: electionName,
            electionTag: electionName,
            failureTag: undefined,
            visible: [Candidate, Voter, VoterCamp, Pie],
            runoffStage: 'firstRound',
            voterMovements: [
                // burlington
                new VoterMovement(200, 'anywhere', 'home'),
                new VoterMovement(camps[0], 'home', 'begich_bullet'),
                new VoterMovement(camps[1], 'home', 'begich_then_palin'),
                new VoterMovement(camps[2], 'home', 'palin_then_begich'),
                new VoterMovement(camps[3], 'home', 'palin_bullet'),
                new VoterMovement(camps[4], 'home', 'palin_then_peltola'),
                new VoterMovement(camps[5], 'home', 'peltola_then_palin'),
                new VoterMovement(camps[6], 'home', 'peltola_bullet'),
                new VoterMovement(camps[7], 'home', 'peltola_then_begich'),
                new VoterMovement(camps[8], 'home', 'begich_then_peltola'),
            ],
        })
    }

    const condorcetTransitions = ({electionTag, rcvWinner, condorcetWinner, loser}) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.condorcet,
        }
        return [
            new SimTransition({
                ...def,
                explainer: <>
                    <p>Condorcet Winner: The candidate who wins head-to-head against all other candidates'</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>{rcvWinner} won in the runoff</p>
                </>,
                runoffStage: 'palinVsPeltola',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>but {condorcetWinner} would have beaten {rcvWinner} head-to-head</p>
                </>,
                runoffStage: 'begichVsPeltola',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>and {condorcetWinner} also beats {loser} head-to-head</p>
                </>,
                runoffStage: 'begichVsPalin',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, 'begich_beats_palin', 'begich_beats_peltola', 'peltola_beats_palin'],
                focused: ['begich', 'begich_beats_palin', 'begich_beats_peltola'],
                explainer: <>,
                    <p>So {condorcetWinner} is the actual Condorcet winner! and RCV failed to elect them</p>
                </>,
                runoffStage: 'begichVsPalin',
            }),
        ]
    }

    return [
        new SimTransition({
            explainer:  <>
                <p>Browse some other RCV case studies</p>
                <div className='selectorPanel'>
                    <div className='electionSelector'>
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
                    </div>
                    <div className='failureSelector'>
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
                </div>
                <a href="https://arxiv.org/pdf/2301.12075.pdf">source</a>
            </>
        }),
        new SimTransition({
            explainer: <p></p>,
            electionName: 'alaska-2022',
            electionTag: 'alaska-2022',
            failureTag: undefined,
            visible: [Candidate, Voter, VoterCamp, Pie],
            runoffStage: 'firstRound',
        }),
        introTransition('alaska-2022', 'Alaska 2022 Senator Special Election', [12, 16, 29, 36, 23, 4, 5, 25, 50]),
        ...condorcetTransitions({
            electionTag: 'alaska-2022',
            rcvWinner: 'Peltola',
            condorcetWinner: 'Begich',
            loser: 'Palin',
        }),
        introTransition('burlington-2009', 'Burlington 2009 Mayor Election', [10, 18, 34, 29, 11, 9, 13, 46, 30]),
        ...condorcetTransitions({
            electionTag: 'burlington-2009',
            rcvWinner: 'Kiss',
            condorcetWinner: 'Montroll',
            loser: 'Wright',
        })
    ]
}

export default electionSelectorTransitions;