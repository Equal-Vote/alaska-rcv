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
    'no_show': 'no show failure',
    'compromise': 'compromise failure',
    'spoiler': 'spoiler effect',
};

const ELECTIONS = {
    alaska_special_2022: 'alaska-special-2022',
    alaska_general_2022: 'alaska-general-2022',
    burlington_2009: 'burlington-2009',
    minneapolis_2021: 'minneapolis-2021',
    pierce_2008: 'pierce-2008',
    san_francisco_2020: 'san-francisco-2020',
}

const elections = {
    'alaska-special-2022': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority, FAILURE.upward_mono, FAILURE.compromise, FAILURE.no_show],
    },
    'alaska-general-2022': {
        'failures': [FAILURE.unselected],
    },
    'burlington-2009': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority, FAILURE.upward_mono, FAILURE.compromise],
    },
    'minneapolis-2021': {
        'failures': [FAILURE.unselected, FAILURE.spoiler, FAILURE.majority, FAILURE.compromise, FAILURE.upward_mono, FAILURE.downward_mono],
    },
    'pierce-2008': {
        'failures': [FAILURE.unselected, FAILURE.compromise, FAILURE.majority],
    },
    'san-francisco-2020': {
        'failures': [FAILURE.unselected, FAILURE.downward_mono],
    }
};
const electionSelectorTransitions = (simState, setRefreshBool, refreshVoters) => {
    
    const selectorTransition = () => {
        return new SimTransition({
            visible: [Candidate, Pie],
            runoffStage: 'default',
            electionName: 'undefined',
            explainer:  <>
                <h1 style={{marginTop: 0, marginBottom: 0}}>RCV Case Studies</h1>
                {new URLSearchParams(window.location.search).get('onlySelector') && <a href={`${window.location.href.split('?')[0]}`}>Link to full article</a>}
                <div className='selectorPanel'>
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
                            refreshVoters();
                            setRefreshBool(b => !b);
                        }}>
                            {Object.entries(FAILURE).map(([key, failure], i) => {
                                let electionFailures = elections[simState.selectorElection].failures;
                                return <option className='failureOption' key={i} style={{display: electionFailures.includes(failure)? 'block' : 'none'}}>{failure}</option>
                            })}
                        </select>
                    </div>
                    <button onClick={(event) => {
                        let link = `${window.location.href.split('?')[0]}?onlySelector=true&selectorElection=${simState.selectorElection}&selectorFailure=${simState.selectorFailure}`
                        navigator.clipboard.writeText(link);
                        event.target.textContent = 'Link Copied!'
                        setTimeout(() => event.target.textContent = 'Copy Link', 800);
                    }}>Copy Link</button>
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
            voterMovements: [ new VoterMovement(camps) ] 
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
                    had majoritarian failures 52% of the time <a href="https://arxiv.org/pdf/2301.12075.pdf">link</a>
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

    const noShow = (electionTag, movement) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.no_show,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
        return [
            new SimTransition({
                ...def,
                explainer: <>
                    <p>Truncation Failure<br/><i>Scenario where a set of voters can get a better result by supporting fewer candidates (or "truncating" their ballot)</i></p>
                    <p>No Show Failure<br/><i>The most extreme truncation failure where where a set of voters can get a better result by not voting at all (or fully "truncating" their ballot)</i></p>
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
                    <p>But if we restart the election</p>
                </>,
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>And pretend that {movement.count} {rightCandidate} voters stayed home</p>
                </>,
                runoffStage: 'firstRound',
                voterMovements: [movement]
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>Then {rightCandidate} would be eliminated in the first round and {centerCandidate} would win</p>
                </>,
                runoffStage: 'center_vs_right'
            })
        ]
    }
    const downwardMonotonicity = (electionTag, movement) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.downward_mono,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
        return [
            new SimTransition({
                ...def,
                explainer: <>
                    <p>Downward Monotonicity Failure<br/><i>A scenario where a losing candidate could have lost support and won</i></p>
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
                    <p>But if we restart the election</p>
                </>,
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>And pretend {rightCandidate} lost {movement.count} voters to {centerCandidate}</p>
                </>,
                runoffStage: 'firstRound',
                voterMovements: [movement]
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>Then {leftCandidate} would be eliminated in the first round and {rightCandidate} would win</p>
                </>,
                runoffStage: 'center_vs_right'
            })
        ]
    }

    const upwardMonotonicity = (electionTag, movements) => {
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
                    <p>But if we restart the election</p>
                </>,
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>And pretend {leftCandidate} gained {movements.reduce((p, m) => p + m.count, 0)} voters from {rightCandidate}</p>
                </>,
                runoffStage: 'firstRound',
                voterMovements: movements
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>Then {leftCandidate} would have lost to {centerCandidate} in the runoff</p>
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
                    <p>But if we restart the election</p>
                </>,
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>And pretend {movement.count} "{rightCandidate} > {centerCandidate}" voters were to compromise and rank {centerCandidate} above {rightCandidate}...</p>
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
        ...introTransition(ELECTIONS.alaska_special_2022, 'Alaska 2022 US Representative Special Election', 942.9, [0, 12, 29, 36, 23, 4, 5, 25, 50, 16]),
        ...condorcet(ELECTIONS.alaska_special_2022),
        ...spoiler(ELECTIONS.alaska_special_2022),
        ...majorityFailure({
            electionTag: ELECTIONS.alaska_special_2022,
            winnerVoteCount: 96,
            bulletVoteCount: 12
        }),
        ...upwardMonotonicity(ELECTIONS.alaska_special_2022, [new VoterMovement(7, 'rightBullet', 'leftBullet')]),
        ...compromise(ELECTIONS.alaska_special_2022, new VoterMovement(6, 'rightThenCenter', 'centerThenRight')),
        ...noShow(ELECTIONS.alaska_special_2022, new VoterMovement(7, 'rightThenCenter', 'home')),

        // Alaska General
        ...introTransition(ELECTIONS.alaska_general_2022, 'Alaska 2022 US Representative Special Election',
            1318.4, [0, 11, 33, 32, 17, 3, 6, 50, 42, 6]),

        // Burlington
        ...introTransition(ELECTIONS.burlington_2009, 'Burlington 2009 Mayor Election', 44.2, [0, 10, 18, 34, 29, 11, 9, 13, 46, 30]),
        ...upwardMonotonicity(ELECTIONS.burlington_2009, [
            new VoterMovement(11, 'rightBullet', 'leftBullet'),
            new VoterMovement(7, 'rightThenLeft', 'leftThenRight')
        ]),
        ...condorcet(ELECTIONS.burlington_2009),
        ...spoiler(ELECTIONS.burlington_2009),
        ...majorityFailure({
            electionTag: ELECTIONS.burlington_2009,
            winnerVoteCount: 98,
            bulletVoteCount: 10
        }),
        ...compromise(ELECTIONS.burlington_2009, new VoterMovement(9, 'rightThenCenter', 'centerThenRight')),

        // Minneapolis
        ...introTransition(ELECTIONS.minneapolis_2021, 'Minneapolis 2021 Ward 2 City Council Election', 44.5, [0, 19, 18, 20, 35, 17, 25, 11, 29, 26]),
        ...condorcet(ELECTIONS.minneapolis_2021),
        ...spoiler(ELECTIONS.minneapolis_2021),
        ...majorityFailure({
            electionTag: ELECTIONS.minneapolis_2021,
            winnerVoteCount: 91,
            bulletVoteCount: 19
        }),
        ...compromise(ELECTIONS.minneapolis_2021, new VoterMovement(8, 'rightThenCenter', 'centerThenRight')),
        ...upwardMonotonicity(ELECTIONS.minneapolis_2021, [new VoterMovement(11, 'rightThenLeft', 'leftThenRight')]),
        ...downwardMonotonicity(ELECTIONS.minneapolis_2021, new VoterMovement(2, 'rightThenCenter', 'centerThenRight')),
        new SimTransition({
            electionName: ELECTIONS.minneapolis_2021,
            electionTag: ELECTIONS.minneapolis_2021,
            failureTag: FAILURE.downward_mono,
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>(It shows as a tie in the first round because they only won by a fraction of a vote)</p>
            </>,
            runoffStage: 'center_vs_right'
        }),

        // Pierce
        ...introTransition(ELECTIONS.pierce_2008, 'Pierce County WA 2008 County Executive Election', 1441.6, [0, 14, 9, 19, 44, 19, 9, 14, 41, 31]),
        ...compromise(ELECTIONS.pierce_2008, new VoterMovement(11, 'rightThenCenter', 'centerThenRight'), 'center_vs_right'),
        ...majorityFailure({
            electionTag: ELECTIONS.pierce_2008,
            winnerVoteCount: 95,
            bulletVoteCount: 14
        }),

        // San Francisco
        ...introTransition(ELECTIONS.san_francisco_2020, 'San Francisco 2020 District 7 Board of Supervisors Election',
            178.1, [0, 9, 12, 18, 31, 29, 22, 10, 31, 38]),
        ...downwardMonotonicity(ELECTIONS.san_francisco_2020, new VoterMovement(5, 'rightThenCenter', 'centerThenRight')),
        new SimTransition({
            electionName: ELECTIONS.san_francisco_2020,
            electionTag: ELECTIONS.san_francisco_2020,
            failureTag: FAILURE.downward_mono,
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>(It shows as a tie here because they only won by a fraction of a vote)</p>
            </>,
            runoffStage: 'center_vs_right'
        }),
        new SimTransition({
            explainer: <p>Read the full study <a href="https://arxiv.org/pdf/2301.12075.pdf">here</a></p> 
        })
    ]
}

export default electionSelectorTransitions;