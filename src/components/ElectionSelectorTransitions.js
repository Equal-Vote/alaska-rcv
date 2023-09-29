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
    'cycle': 'condorcet cycle',
    'majority': 'majoritarian failure',
    'upward_mono': 'upward monotonicity failure',
    'downward_mono': 'downward monotonicity failure',
    'noshow': 'no show failure',
    'compromise': 'compromise failure',
    'spoiler': 'spoiler effect',
};

const ELECTIONS = {
    alaska_special_2022: 'alaska-special-2022',
    alaska_general_2022: 'alaska-general-2022',
    burlington_2009: 'burlington-2009',
    minneapolis_2021: 'minneapolis-2021',
    pierce_2008: 'pierce-2008',
}

const elections = {
    'alaska-special-2022': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority, FAILURE.upward_mono, FAILURE.compromise],
    },
    'burlington-2009': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority, FAILURE.compromise],
    },
    'minneapolis-2021': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority, FAILURE.compromise],
    },
    'pierce-2008': {
        'failures': [FAILURE.unselected, FAILURE.compromise],
    }
};
const electionSelectorTransitions = (simState, setRefreshBool, refreshVoters) => {
    
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
                            refreshVoters();
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
                            refreshVoters();
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

    const introTransition = (electionName, description, ratio, camps) => {
        let intro = [new SimTransition({
            explainer: <p>{description}<pre>       * 1 voter = {ratio} real voters</pre></p>,
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
            ] 
        })];

        if(elections[electionName].failures.length > 1){
            intro.push(new SimTransition({
                explainer: <p>This election had the following issues : 
                    <ul>{elections[electionName].failures.filter(f => f != FAILURE.unselected).map((f,i) => <li>{f}</li>)}</ul>
                    pick from the drop down above for more details</p>,
                electionName: electionName,
                electionTag: electionName,
                failureTag: FAILURE.unselected,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }));
        }

        return intro;
    }


    const majorityFailure= ({electionTag, winnerVoteCount, bulletVoteCount}) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.majority,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
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
                    <p>{leftCandidate} won in the final round, but then only had {winnerVoteCount}/200 of the vote (that's {Math.round(100*winnerVoteCount/200)}% of the vote)</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'right_vs_left',
            }),
            new SimTransition({
                ...def,
                explainer: <>
                    <p>The outlets reported this as a majority because the {bulletVoteCount} bullet voters who voted for {centerCandidate} weren't counted in the total</p>
                    <p>So as a result, the tally was reported as {winnerVoteCount}/{200-bulletVoteCount}={Math.round(100*winnerVoteCount/(200-bulletVoteCount))}% instead of {Math.round(100*winnerVoteCount/200)}%</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                focused: ['centerCandidate', 'centerBullet'],
                runoffStage: 'right_vs_left',
            }),
            new SimTransition({
                ...def,
                explainer: <p>
                    Majoritarian failures differ from the other failures in that they're so prolific. Research was conduncted on all US RCV elections
                    that required multiple elimination rounds (i.e. the ones that would not have had a majority under plurality), and they found that RCV
                    had a majoritarian failures 52% of the time <a href="https://arxiv.org/pdf/2301.12075.pdf">link</a>
                </p>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'right_vs_left',
            }),
        ];
    }

    const spoiler= (electionTag) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.spoiler,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
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
                    <p>{leftCandidate} won the election, and {rightCandidate} lost</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'right_vs_left'
            }),
            new SimTransition({
                ...def,
                explainer: <>
                    <p>but if {rightCandidate} was removed, the winner would change to {centerCandidate}</p>
                    <p>therefore {rightCandidate} was a spoiler for this election</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'center_vs_left'
            }),
        ];
    }

    const upwardMonotonicity= (electionTag, movement) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.upward_mono,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
        return [
            new SimTransition({
                ...def,
                explainer: <>
                    <p>Upward Monotonicity Failure<br/><i>A scenario where the winning candidate could have gained more support and lost</i></p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>{leftCandidate} won in the runoff</p>
                </>,
                runoffStage: 'right_vs_left'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>but if {leftCandidate} gained {movement.count} voters from {rightCandidate}</p>
                </>,
                runoffStage: 'firstRound',
                voterMovements: [movement]
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>Then {leftCandidate} would have lost to {centerCandidate}</p>
                </>,
                runoffStage: 'center_vs_left'
            })
        ]
    }

    const compromise = (electionTag, movement, alternateRound='center_vs_left') => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.compromise,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
        return [
            new SimTransition({
                ...def,
                explainer: <>
                    <p>Compromise Voting Failure<br/><i>A scenario where a group of voters can elevate the rank of a 'compromise' candidate over their actual favorite to get a better result</i></p>

                    <p>This is very familiar in choose one voting where you have to compromise to pick one of the front runners instead of picking your favorite</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>{leftCandidate} won in the runoff</p>
                </>,
                runoffStage: 'right_vs_left'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>(back to first round)</p>
                </>,
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>but if {movement.count} "{rightCandidate} > {centerCandidate}" voters were to compromise and rank {centerCandidate} above {rightCandidate}...</p>
                </>,
                runoffStage: 'firstRound',
                voterMovements: [movement]
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>Then {centerCandidate} would have won instead of {leftCandidate}</p>
                    <p>Therefore it was not safe for the "{rightCandidate} > {centerCandidate}" voters to give their honest first choice. Doing so gave them their worst scenario</p>
                </>,
                runoffStage: alternateRound
            })
        ]
    }

    const condorcet= (electionTag) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.condorcet,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
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
                    <p>{leftCandidate} won in the runoff</p>
                </>,
                runoffStage: 'right_vs_left'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>but {centerCandidate} would have beaten {leftCandidate} head-to-head</p>
                </>,
                runoffStage: 'center_vs_left'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>and {centerCandidate} also beats {rightCandidate} head-to-head</p>
                </>,
                runoffStage: 'center_vs_right'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, 'left_beats_right', 'center_beats_right', 'center_beats_left'],
                focused: ['centerCandidate', 'center_beats_right', 'center_beats_left'],
                explainer: <>,
                    <p>So {centerCandidate} is the actual Condorcet winner! and RCV failed to elect them</p>
                </>,
                runoffStage: 'center_vs_right'
            }),
        ]
    }

    return [
        selectorTransition(),
        // Alaska Special Election
        ...introTransition(ELECTIONS.alaska_special_2022, 'Alaska 2022 US Representative Special Election', 942.9, [12, 29, 36, 23, 4, 5, 25, 50, 16]),
        ...condorcet(ELECTIONS.alaska_special_2022),
        ...spoiler(ELECTIONS.alaska_special_2022),
        ...majorityFailure({
            electionTag: ELECTIONS.alaska_special_2022,
            winnerVoteCount: 96,
            bulletVoteCount: 12
        }),
        ...upwardMonotonicity(ELECTIONS.alaska_special_2022, new VoterMovement(7, 'rightBullet', 'leftBullet')),
        ...compromise(ELECTIONS.alaska_special_2022, new VoterMovement(6, 'rightThenCenter', 'centerThenRight')),

        // Burlington
        ...introTransition(ELECTIONS.burlington_2009, 'Burlington 2009 Mayor Election', 44.2, [10, 18, 34, 29, 11, 9, 13, 46, 30]),
        ...condorcet(ELECTIONS.burlington_2009),
        ...spoiler(ELECTIONS.burlington_2009),
        ...majorityFailure({
            electionTag: ELECTIONS.burlington_2009,
            winnerVoteCount: 98,
            bulletVoteCount: 10
        }),
        ...compromise(ELECTIONS.burlington_2009, new VoterMovement(9, 'rightThenCenter', 'centerThenRight')),

        // Minneapolis
        ...introTransition(ELECTIONS.minneapolis_2021, 'Minneapolis 2021 Ward 2 City Council Election', 44.5, [19, 18, 20, 35, 17, 25, 11, 29, 26]),
        ...condorcet(ELECTIONS.minneapolis_2021),
        ...spoiler(ELECTIONS.minneapolis_2021),
        ...majorityFailure({
            electionTag: ELECTIONS.minneapolis_2021,
            winnerVoteCount: 91,
            bulletVoteCount: 19
        }),
        ...compromise(ELECTIONS.minneapolis_2021, new VoterMovement(8, 'rightThenCenter', 'centerThenRight')),

        // Pierce
        ...introTransition(ELECTIONS.pierce_2008, 'Pierce County WA 2008 County Executive Election', 1441.6, [14, 9, 19, 44, 19, 9, 14, 41, 31]),
        ...compromise(ELECTIONS.pierce_2008, new VoterMovement(11, 'rightThenCenter', 'centerThenRight'), 'center_vs_right'),

        new SimTransition({
            explainer: <p>Read the full study <a href="https://arxiv.org/pdf/2301.12075.pdf">here</a></p> 
        })
    ]
}

export default electionSelectorTransitions;