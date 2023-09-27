import { Fragment, useState } from "react";
import { SimTransition } from "../SimTransition";
import Candidate from "./Candidate";
import Voter from "./Voter";
import VoterCamp from "./VoterCamp";
import Pie from "./Pie";
import { VoterMovement } from "../VoterMovement";

const FAILURE= {
    'unselected': '<pick a failure type>',
    'condorcet': 'condorcet failure',
    'mono': 'monotonicity failure',
    'noshow': 'no show failure',
    'compromise': 'compromise failure',
};

const lanes = [
    'center',
    'right',
    'left'
];

const electionSelectorTransitions = (simState, setRefreshBool) => {
    const candidateAsLane = (simState, electionTag, candidate) => lanes[simState.candidateNames[electionTag].indexOf(candidate.toLowerCase())];
    const elections = {
        'alaska-2022': {
            'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.mono, FAILURE.noshow, FAILURE.compromise],
        },
        'burlington-2009': {
            'failures': [FAILURE.unselected, FAILURE.condorcet],
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
                new VoterMovement(camps[0], 'home', 'centerBullet'),
                new VoterMovement(camps[1], 'home', 'centerThenRight'),
                new VoterMovement(camps[2], 'home', 'rightThenCenter'),
                new VoterMovement(camps[3], 'home', 'rightBullet'),
                new VoterMovement(camps[4], 'home', 'rightThenLeft'),
                new VoterMovement(camps[5], 'home', 'leftThenRight'),
                new VoterMovement(camps[6], 'home', 'leftBullet'),
                new VoterMovement(camps[7], 'home', 'leftThenCenter'),
                new VoterMovement(camps[8], 'home', 'centerThenLeft'),
            ],
        })
    }

    const condorcetTransitions = ({electionTag, rcvWinner, condorcetWinner, loser}) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.condorcet,
        }
        const rcvWinnerLane = candidateAsLane(simState, electionTag, rcvWinner);
        const condorcetWinnerLane = candidateAsLane(simState, electionTag, condorcetWinner);
        const loserLane = candidateAsLane(simState, electionTag, loser);
        return [
            new SimTransition({
                ...def,
                explainer: <>
                    <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
                    <p>Condorcet Failure<br/><i>A scenario where the election method doesn't select a condorcet winner</i></p>
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
                runoffStage: `${loserLane}_vs_${rcvWinnerLane}`,
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>but {condorcetWinner} would have beaten {rcvWinner} head-to-head</p>
                </>,
                runoffStage: `${condorcetWinnerLane}_vs_${rcvWinnerLane}`,
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>and {condorcetWinner} also beats {loser} head-to-head</p>
                </>,
                runoffStage: `${condorcetWinnerLane}_vs_${loserLane}`,
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, `${rcvWinnerLane}_beats_${loserLane}`, `${condorcetWinnerLane}_beats_${loserLane}`, `${condorcetWinnerLane}_beats_${rcvWinnerLane}`],
                focused: ['centerCandidate', `${condorcetWinnerLane}_beats_${loserLane}`, `${condorcetWinnerLane}_beats_${rcvWinnerLane}`],
                explainer: <>,
                    <p>So {condorcetWinner} is the actual Condorcet winner! and RCV failed to elect them</p>
                </>,
                runoffStage: `${condorcetWinnerLane}_vs_${loserLane}`,
            }),
        ]
    }

    return [
        new SimTransition({
            explainer:  <>
                <h1>Browse some other RCV case studies</h1>
                <div className='selectorPanel'>
                    <div className='electionSelector'>
                        <select name="election" defaultValue={simState.selectorElection} onChange={(event) => {
                            simState.selectorElection=event.target.value;
                            simState.selectorFailure=FAILURE.unselected;
                            document.querySelectorAll('.failureOption').forEach((elem) =>{
                                let electionFailures = elections[simState.selectorElection].failures;
                                elem.style.display = electionFailures.includes(elem.textContent)? 'block' : 'none';
                            });

                            document.querySelectorAll('.failureSelect').forEach((elem) =>{
                                elem.value = simState.selectorFailure;
                            });

                            setRefreshBool(b => !b);
                        }}>
                            {Object.keys(elections).map((election ,i) => 
                                <option key={i}>{election}</option>
                            )}
                        </select>
                    </div>
                    <div className='failureSelector'>
                        <select className='failureSelect' name="failure" defaultValue={simState.selectorFailure} onChange={(event) => {
                            simState.selectorFailure=event.target.value;
                            setRefreshBool(b => !b);
                        }}>
                            {Object.entries(FAILURE).map(([key, failure], i) => {
                                let electionFailures = elections[simState.selectorElection].failures;
                                return <option className='failureOption' key={i} style={{display: electionFailures.includes(failure)? 'block' : 'none'}}>{failure}</option>
                            })}
                        </select>
                    </div>
                </div>
                <a href="https://arxiv.org/pdf/2301.12075.pdf">source</a>
            </>
        }),
        introTransition('alaska-2022', 'Alaska 2022 Senator Special Election', [12, 29, 36, 23, 4, 5, 25, 50, 16]),
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