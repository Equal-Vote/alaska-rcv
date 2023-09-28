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
    'majority': 'majoritarian failure',
    'mono': 'monotonicity failure',
    'noshow': 'no show failure',
    'compromise': 'compromise failure',
    'spoiler': 'spoiler effect',
};

const lanes = [
    'center',
    'right',
    'left'
];

const electionSelectorTransitions = (simState, setRefreshBool) => {
    const candidateAsLane = (simState, electionTag, candidate) => lanes[simState.candidateNames[electionTag].indexOf(candidate.toLowerCase())];
    
    const selectorTransition = () => {
        return new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            runoffStage: 'default',
            electionName: 'undefined',
            voterMovements: [
                new VoterMovement(200, undefined, 'home'),
            ],
            explainer:  <>
                <h1 style={{marginTop: 0, marginBottom: 0}}>Browse some other RCV case studies</h1>
                {new URLSearchParams(window.location.search).get('onlySelector') && <a href={`${window.location.href.split('?')[0]}`}>Link to full article</a>}
                <div style={{marginTop: '50px'}}className='selectorPanel'>
                    <div className='electionSelector'>
                        <select name="election" defaultValue={simState.selectorElection} onChange={(event) => {
                            simState.electionName=event.target.value;
                            simState.selectorElection=event.target.value;
                            simState.selectorFailure=FAILURE.unselected;
                            document.querySelectorAll('.failureOption').forEach((elem) =>{
                                let electionFailures = elections[simState.selectorElection].failures;
                                elem.style.display = electionFailures.includes(elem.textContent)? 'block' : 'none';
                            });

                            document.querySelectorAll('.failureSelect').forEach((elem) =>{
                                elem.value = simState.selectorFailure;
                            });

                            document.getElementById('shareLink').href = `${window.location}?onlySelector=true&selectorElection=${simState.selectorElection}&selectorFailure=${simState.selectorFailure}`;

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
                            document.getElementById('shareLink').href = `${window.location}?onlySelector=true&selectorElection=${simState.selectorElection}&selectorFailure=${simState.selectorFailure}`;
                            setRefreshBool(b => !b);
                        }}>
                            {Object.entries(FAILURE).map(([key, failure], i) => {
                                let electionFailures = elections[simState.selectorElection].failures;
                                return <option className='failureOption' key={i} style={{display: electionFailures.includes(failure)? 'block' : 'none'}}>{failure}</option>
                            })}
                        </select>
                    </div>
                    <a id="shareLink" href={`${window.location}?onlySelector=true&selectorElection=${simState.selectorElection}&selectorFailure=${simState.selectorFailure}`}>Share Link</a>
                </div>
            </>
        });
    }

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


    const majorityFailure = ({electionTag, first, second, third, winnerVoteCount, bulletVoteCount}) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.majority,
        }
        const firstLane = candidateAsLane(simState, electionTag, first);
        const secondLane = candidateAsLane(simState, electionTag, second);
        const thirdLane = candidateAsLane(simState, electionTag, third);
        return [
            new SimTransition({
                ...def,
                explainer: <>
                    <p>Majoritarian Failure<br/><i>When the winning candidate does not have the majority of votes in the final round</i></p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                explainer: <>
                    <p>{first} won in the final round, but then only had {winnerVoteCount}/200 of the vote (that's {Math.round(100*winnerVoteCount/200)}% of the vote)</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: `${secondLane}_vs_${firstLane}`,
            }),
            new SimTransition({
                ...def,
                explainer: <>
                    <p>The outlets reported this as a majority because the {bulletVoteCount} bullet voters who voted for {third} weren't counted in the total</p>
                    <p>So as a result, the tally was reported as {winnerVoteCount}/{200-bulletVoteCount}={Math.round(100*winnerVoteCount/(200-bulletVoteCount))}% instead of {Math.round(100*winnerVoteCount/200)}%</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                focused: [`${thirdLane}Candidate`, `${thirdLane}Bullet`],
                runoffStage: `${secondLane}_vs_${firstLane}`,
            }),
            new SimTransition({
                ...def,
                explainer: <p>
                    Majoritarian failures differ from the other failures in that they're so prolific. Research was conduncted on all US RCV elections
                    that required multiple elimination rounds (i.e. the ones that would not have had a majority under plurality), and they found that RCV
                    had a majoritarian failures 52% of the time <a href="https://arxiv.org/pdf/2301.12075.pdf">link</a>
                </p>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: `${secondLane}_vs_${firstLane}`,
            }),
        ];
    }

    const spoilerTransitions = ({electionTag, spoilerCandidate, oldWinner, newWinner}) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.spoiler,
        }
        const spoilerLane = candidateAsLane(simState, electionTag, spoilerCandidate);
        const oldWinnerLane = candidateAsLane(simState, electionTag, oldWinner);
        const newWinnerLane = candidateAsLane(simState, electionTag, newWinner);
        return [
            new SimTransition({
                ...def,
                explainer: <>
                    <p>Spoiler Effect<br/><i>When removing 1 or more losing candidates could cause the winner to change</i></p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                explainer: <>
                    <p>{oldWinner} won the election, and {spoilerCandidate} lost</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: `${spoilerLane}_vs_${oldWinnerLane}`,
            }),
            new SimTransition({
                ...def,
                explainer: <>
                    <p>but if {spoilerCandidate} was removed, the winner would change to {newWinner}</p>
                    <p>therefore {spoilerCandidate} was a spoiler for this election</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: `${newWinnerLane}_vs_${oldWinnerLane}`,
            }),
        ];
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

    const elections = {
        'alaska-special-2022': {
            'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority],
        },
        'burlington-2009': {
            'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority],
        },
    };

    return [
        selectorTransition(),
        introTransition('alaska-special-2022', 'Alaska 2022 US Representative Special Election', [12, 29, 36, 23, 4, 5, 25, 50, 16]),
        ...condorcetTransitions({
            electionTag: 'alaska-special-2022',
            rcvWinner: 'Peltola',
            condorcetWinner: 'Begich',
            loser: 'Palin',
        }),
        ...spoilerTransitions({
            electionTag: 'alaska-special-2022',
            spoilerCandidate: 'Palin',
            oldWinner: 'Peltola',
            newWinner: 'Begich',
        }),
        ...majorityFailure({
            electionTag: 'alaska-special-2022',
            first: 'Peltola',
            second: 'Palin',
            third: 'Begich',
            winnerVoteCount: 96,
            bulletVoteCount: 12
        }),
        introTransition('burlington-2009', 'Burlington 2009 Mayor Election', [10, 18, 34, 29, 11, 9, 13, 46, 30]),
        ...condorcetTransitions({
            electionTag: 'burlington-2009',
            rcvWinner: 'Kiss',
            condorcetWinner: 'Montroll',
            loser: 'Wright',
        }),
        ...spoilerTransitions({
            electionTag: 'burlington-2009',
            spoilerCandidate: 'Wright',
            oldWinner: 'Kiss',
            newWinner: 'Montroll',
        }),
        ...majorityFailure({
            electionTag: 'burlington-2009',
            first: 'Kiss',
            second: 'Wright',
            third: 'Montroll',
            winnerVoteCount: 98,
            bulletVoteCount: 10
        }),
        new SimTransition({
            explainer: <p>Read the full study <a href="https://arxiv.org/pdf/2301.12075.pdf">here</a></p> 
        })
    ]
}

export default electionSelectorTransitions;