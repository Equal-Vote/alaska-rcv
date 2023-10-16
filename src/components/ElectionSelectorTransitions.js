import { Fragment, useState } from "react";
import { SimTransition } from "../SimTransition";
import Candidate from "./Candidate";
import Voter from "./Voter";
import VoterCamp from "./VoterCamp";
import Pie from "./Pie";
import { VoterMovement } from "../VoterMovement";

const FAILURE= {
    'unselected': '<pick a failure type>',
    'condorcet': 'Condorcet Failure',
    'cycle': 'Condorcet Cycle',
    'majority': 'Majoritarian Failure',
    'upward_mono': 'Upward Monotonicity Failure',
    'downward_mono': 'Downward Monotonicity Failure',
    'no_show': 'No Show Failure',
    'compromise': 'Compromise Failure',
    'spoiler': 'Spoiler Effect',
    'tally': 'Tally Error',
};

const ELECTIONS = {
    alaska_special_2022: 'alaska-special-2022',
    alaska_general_2022: 'alaska-general-2022',
    burlington_2009: 'burlington-2009',
    minneapolis_2021: 'minneapolis-2021',
    pierce_2008: 'pierce-2008',
    san_francisco_2020: 'san-francisco-2020',
    alameda_2022: 'alameda-2022',
    moab_2021: 'moab-2021',
    nyc_2021: 'nyc-2021',

    // "Voters in alaska are organizing a campaign for repeal" I need to find the source on this
    // https://youtu.be/2aNdceVMyrM?t=162

    // Maine TIE scenario https://arxiv.org/pdf/2303.05985.pdf

    // Other Compromise failures, https://arxiv.org/pdf/2301.12075.pdf
    // Oakland 2010
    // Berkley 2016
    // Minneapolis 2017

    // Other monotonicity failures, https://starvoting.slack.com/archives/C9U6425CM/p1695006449951199?thread_ts=1695005666.307199&cid=C9U6425CM
    // Aspen, Colorado
        // https://rangevoting.org/TallyCorrectedTB.pdf (tally error)
        // https://rangevoting.org/Aspen09.html

    // Repeals mentioned here, https://alaskapolicyforum.org/wp-content/uploads/2020-10-APF-Ranked-Choice-Voting-Report.pdf
    // Burlington, Vermont
        // reason: because incumbant won with only 29% of the first place votes?
    // Aspen, Colorado
        // reason: results are same as plurality, but lack of precint summabilility caused delays in the results
    // Pierce County, WA
        // reason: voters opinion shifted massively, presumably because it was complicated to vote in?
    // Ann Arbor Michigan
        // reason: RCV created unity between democrats and 3rd party, so republicans repealed it
    // State of North Carolina
        // reason: repealed via a bill because voters found it difficult?

    // Google slides case studies; https://docs.google.com/presentation/d/1G40n79tcUPdVkZWr-tNXSz7q9ddbwOUw4Ev0G_jKq6I/edit#slide=id.g1e29c24f2cf_0_7
    // There's a bunch more examples there, I'll need to research them
}

const elections = {
    'pierce-2008': {
        'failures': [FAILURE.unselected, FAILURE.compromise, FAILURE.majority],
    },
    'burlington-2009': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority, FAILURE.upward_mono, FAILURE.compromise],
    },
    'san-francisco-2020': {
        'failures': [FAILURE.unselected, FAILURE.downward_mono],
    },
    'minneapolis-2021': {
        'failures': [FAILURE.unselected, FAILURE.spoiler, FAILURE.majority, FAILURE.compromise, FAILURE.upward_mono, FAILURE.downward_mono],
    },
    'moab-2021': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.majority, FAILURE.upward_mono, FAILURE.spoiler, FAILURE.no_show],
    },
    'nyc-2021': {
        'failures': [FAILURE.unselected, FAILURE.tally, FAILURE.majority],
    },
    'alameda-2022': {
        'failures': [FAILURE.unselected, FAILURE.tally, FAILURE.spoiler, FAILURE.majority, FAILURE.downward_mono, FAILURE.upward_mono, FAILURE.compromise],
    },
    'alaska-special-2022': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority, FAILURE.upward_mono, FAILURE.compromise, FAILURE.no_show],
    },
    'alaska-general-2022': {
        'failures': [FAILURE.unselected],
    },
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

    const introTransition = (electionName, description, ratio, camps, srcTitle='An Examination of Ranked-Choice Voting in the United States, 2004–2022', srcUrl='https://arxiv.org/abs/2301.12075', moreBullets=<></>) => {
        let intro = [new SimTransition({
            explainer: <p>{description}<ul><li>1 voter = {ratio} real voters</li><li>Source: <a href={srcUrl}>{srcTitle}</a></li>{moreBullets}</ul></p>,
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
                    <p>{leftCandidate} won in the final round, but then only had {winnerVoteCount}/200 votes (that's {Math.round(100*winnerVoteCount/200)}% of the vote)</p>
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
                runoffStage: 'center_vs_left'
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

    const condorcetCycle = (electionTag) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.unselected,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
        return [
            new SimTransition({
                ...def,
                explainer: <>
                    <p>This election was particularly interesting because it had a condorcet cycle (it's super rare, there are only 2 documented cases in the US)</p>
                    <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
                    <p>Condorcet Cycle<br/><i>A scenario where no Condorcet Winner is present due to a cycle in the head-to-head matchups</i></p>
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
                    <p>and {rightCandidate} would have beaten {centerCandidate} head-to-head</p>
                </>,
                runoffStage: 'center_vs_right'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, 'left_beats_right', 'center_beats_left', 'right_beats_center'],
                explainer: <>,
                    <p>So the head-to-head match ups form a cycle, and it's not clear who the ideal winner should be</p>
                    <p>One could argue that a cardinal (or scoring) voting system like STAR or Approval could have done a better job of guaging level of support in addition to relative ranking, but 
                    this election isn't necessarily a failure of RCV. It's a super rare edge case that would be difficult for any voting method to handle</p>
                </>,
                runoffStage: 'center_vs_right'
            }),
        ]
    }

    const nycTallyError = () => {
        let def = {
            electionName: ELECTIONS.nyc_2021,
            electionTag: ELECTIONS.nyc_2021,
            failureTag: FAILURE.tally,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[ELECTIONS.nyc_2021];


        return [
            new SimTransition({
                ...def,
                explainer: 
                <>
                    <p>
                        This election had an issue where 135,000 test ballots were accidentally included in the final tally (the equivalent of 31 simulated voters ) when they originally reported the results.
                        NYC had to issue an apology and do a recount <a href='https://www.nytimes.com/2021/06/29/nyregion/adams-garcia-wiley-mayor-ranked-choice.html'>Full Story</a>
                    </p>,
                    <p>(unfortunately we don't have the data to show the effect in the simulation)</p>
                    <p>To be clear this was just human error and there was no evidence of election interference here.</p>
                    <p>However this still highlights a problem with RCV in that it's hard to audit.
                        Unlike other methods RCV needs to be tallied centrally. Under Choose-one, Approval, and STAR each juristiction can count the results decentrally, so
                        it's easier to check your work as you go and catch errors like this.
                    </p>
                    <p>
                        The test ballots being included is only half the problem, the other half is that the election board was unable to discover the issue themselves before releasing the results
                    </p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }),
        ]
    }

    const alamedaTallyError = () => {
        let def = {
            electionName: ELECTIONS.alameda_2022,
            electionTag: ELECTIONS.alameda_2022,
            failureTag: FAILURE.tally,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[ELECTIONS.alameda_2022];
        return [
            new SimTransition({
                ...def,
                explainer: 
                <>
                    <p>
                        This election had a bug in their software, so the election originally called for Resnick instead of Hutchinson, and 
                        the issue wasn't caught until multiple months after Resnick took office. 
                    </p>,
                    <p>
                        The bug was specifically related to ballots that either skipped their first ranking, or specified a write-in for their ranking.
                        When tallying the top 3 candidates, these votes should have been transferred to their next choice, but they weren't and a disproportionate number of the voters who misfilled their rankings were Hutchinson voters.
                    </p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                explainer: <p>
                     We can simulate how the ballots were counted by removing 1 of the Hutchinson voters from the tally
                </p>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
                voterMovements: [
                    new VoterMovement(1, 'leftBullet', 'home')
                ]
            }),
            new SimTransition({
                ...def,
                explainer: <p>
                    This causes Hutchinson to be eliminated first (by a fraction of a vote), and then Resnick won in the final round
                </p>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'center_vs_right',
            }),
            new SimTransition({
                ...def,
                explainer: <p>
                    But if we start over...
                </p>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }),
            new SimTransition({
                ...def,
                explainer: <p>
                    and include all the ballots in the count
                </p>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
                voterMovements: [
                    new VoterMovement(1, 'home', 'leftBullet')
                ]
            }),
            new SimTransition({
                ...def,
                explainer: <>
                    <p>then Manigo get's elimated in the first round, and Hutchinson is now the winner</p>
                    <p>The other concerning thing is that this bug existed for all of the elections in Alameda County. This just happened to be the only election that was close enough for the result to change</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'right_vs_left',
            }),
            new SimTransition({
                ...def,
                explainer: <p>
                    then Manigo get's elimated in the first round, and Hutchinson is now the winner
                </p>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'right_vs_left',
            }),
            new SimTransition({
                ...def,
                explainer: 
                <>
                    <p>To be clear, this was a accidental bug, due to human error and there was no evidence of election interference here.</p>
                    <p>However this still tells us a few things about RCV
                    <ol>
                        <li><u>RCV is Complicated</u>: There are a lot of edge cases to consider, so it's easy to make an oversight when implementing the algorithm</li>
                        <li><u>RCV is Unstable</u>: If the first choice tallies are close, then minor adjustments to the vote can change the elimination order and have a major impact to the result
                            (whereas Approval and STAR count all the rankings so we'd expect them to be more stable)</li>
                        <li><u>RCV is hard to audit</u>: Unlike other methods RCV needs to be tallied centrally. Under Choose-one, Approval, and STAR each juristiction can count the results decentrally, so
                            it's easier to check your work as you go and catch errors like this. The fact that the software bug existed is only half the problem, the other half is that it took months for us to figure it out</li>
                    </ol>
                    </p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'right_vs_left',
            }),
        ]
    }

    const condorcetSuccess = (electionTag) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.unselected,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
        return [
            new SimTransition({
                ...def,
                explainer: <>
                    <p>For this election RCV did successfully elect the condorcet winner  </p>
                    <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
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
                    <p>and {leftCandidate} would have also beaten {centerCandidate} head-to-head</p>
                </>,
                runoffStage: 'center_vs_left'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>and looks like {centerCandidate} also beats {rightCandidate} head-to-head (but it's not relevant for this case)</p>
                </>,
                runoffStage: 'center_vs_right'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, 'left_beats_right', 'center_beats_right', 'left_beats_center'],
                focused: ['centerCandidate', 'left_beats_center', 'left_beats_right'],
                explainer: <>,
                    <p>So {leftCandidate} is the Condorcet winner! and RCV was successful in this case</p>
                </>,
                runoffStage: 'center_vs_right'
            }),
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

    const electionNote = (electionTag, failureTag, explainer) => {
        // this doesn't need to be an array, but I figured this will keep the functions more consistent
        return [new SimTransition({
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: failureTag,
            explainer: explainer,
            runoffStage: 'undefined',
            visible: 'undefined',
        })]
    }

    return [
        selectorTransition(),

        // Alaska Special Election
        ...introTransition(ELECTIONS.alaska_special_2022, 'Alaska 2022 US Representative Special Election', 942.9, [0, 12, 29, 36, 23, 4, 5, 25, 50, 16],
            'A Mathematical Analysis of the 2022 Alaska Special Election for US House',
            'https://arxiv.org/abs/2209.04764'
        ),
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
        ...introTransition(ELECTIONS.alaska_general_2022, 'Alaska 2022 US Representative General Election',
            1318.4, [0, 11, 33, 32, 17, 3, 6, 50, 42, 6],
            'Ranked Choice Voting And the Center Squeeze in the Alaska 2022 Special Election: How Might Other Voting Methods Compare?',
            'https://arxiv.org/abs/2303.00108',
        ),
        ...condorcetSuccess(ELECTIONS.alaska_general_2022),
        ...electionNote(ELECTIONS.alaska_general_2022, FAILURE.unselected, <>
            <p>This election was essentially a repeat of the special election 6 months prior, and it was interesting to see how the votes changed</p>
            <p>Voting theorists wondered if the results from the previous election would cause voters to be more strategic in the general, but this wasn't the case</p>
            <p>Instead voters shifted left across the board and Peltola was the true condorcet winner this time</p>
            <p>There are 2 primary explanations for this <ul>
                <li>The general election had much more voters, and voters in general elections tend to be more left leaning</li>
                <li>Sarah Palin had the most name recognition going into the special election, and this likely created an electability bias in her favor.
                    Going into the general Peltola was the incumbant, so this shifted the electability bias to her. This implies that one unrepresentative
                    outcome can create a domino effect and give the that candidate an edge in future elections
                </li>
            </ul></p>
        </>),

        // NYC
        ...introTransition(ELECTIONS.nyc_2021, 'New York City 2021 Democratic Mayor Election',
            4355.9, [0, 17, 30, 24, 19, 18, 21, 35, 25, 11],
            'Harvard Data Verse',
            'https://dataverse.harvard.edu/file.xhtml?fileId=6707224&version=7.0'
        ),
        ...majorityFailure({
            electionTag: ELECTIONS.nyc_2021,
            winnerVoteCount: 92,
            bulletVoteCount: 17
        }),
        ...condorcetSuccess(ELECTIONS.nyc_2021),
        ...nycTallyError(ELECTIONS.nyc_2021),

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
        ...spoiler(ELECTIONS.minneapolis_2021),
        ...electionNote(ELECTIONS.minneapolis_2021, FAILURE.spoiler,
            <p>Note that the existence of a condorcet cycle implies that there will be a spoiler candidate regardless of which winner is chosen</p>
        ),
        ...majorityFailure({
            electionTag: ELECTIONS.minneapolis_2021,
            winnerVoteCount: 91,
            bulletVoteCount: 19
        }),
        ...compromise(ELECTIONS.minneapolis_2021, new VoterMovement(8, 'rightThenCenter', 'centerThenRight')),        
        ...upwardMonotonicity(ELECTIONS.minneapolis_2021, [new VoterMovement(11, 'rightThenLeft', 'leftThenRight')]), 
        ...downwardMonotonicity(ELECTIONS.minneapolis_2021, new VoterMovement(2, 'rightThenCenter', 'centerThenRight')),
        ...condorcetCycle(ELECTIONS.minneapolis_2021),

        // Moab
        ...introTransition(ELECTIONS.moab_2021, 'Moab 2021 City Council Election', 8.7, [0, 3, 41, 50, 1, 4, 13, 38, 41, 10],
            'Analysis of the 2021 Instant Run-Off Elections in Utah',
            'https://vixra.org/abs/2208.0166',
            <li>Moab was actually a multi winner election where they ran RCV multiple times to pick the winners.
                The first round failed to elect the condorcet winner, but they were still elected in the second round so the error didn't have any impact
            </li>
        ),
        ...condorcet(ELECTIONS.moab_2021),
        ...spoiler(ELECTIONS.moab_2021),
        ...upwardMonotonicity(ELECTIONS.moab_2021, [
            new VoterMovement(3, 'rightThenLeft', 'leftThenRight')
        ]),
        ...noShow(ELECTIONS.moab_2021, new VoterMovement(3, 'rightThenCenter', 'home')),

        // Alameda
        ...introTransition(ELECTIONS.alameda_2022, 'Alameda 2022 Oakland School Director Election', 132.1, [0, 14, 16, 24, 28, 23, 18, 18, 27, 32],
            'Ranked Choice Bedlam in a 2022 Oakland School Director Election',
            'https://arxiv.org/abs/2303.05985',
            <li>NOTE: The Hutchinson vs Manigo head-to-head appears to be tied but this is because Manigo wins by a fraction of a simulated vote</li>
        ),
        ...spoiler(ELECTIONS.alameda_2022),
        ...electionNote(ELECTIONS.alameda_2022, FAILURE.spoiler,
            <p>Note that the existence of a condorcet cycle implies that there will be a spoiler candidate regardless of which winner is chosen</p>
        ),
        ...majorityFailure({
            electionTag: ELECTIONS.alameda_2022,
            winnerVoteCount: 95,
            bulletVoteCount: 14
        }),
        ...alamedaTallyError(),
        ...downwardMonotonicity(ELECTIONS.alameda_2022, new VoterMovement(1, 'rightThenCenter', 'centerThenRight')),
        ...upwardMonotonicity(ELECTIONS.alameda_2022, [new VoterMovement(16, 'rightThenLeft', 'leftThenRight')]),
        ...compromise(ELECTIONS.alameda_2022, new VoterMovement(13, 'rightThenCenter', 'centerThenRight')),
        ...condorcetCycle(ELECTIONS.alameda_2022),

        // Pierce
        ...introTransition(ELECTIONS.pierce_2008, 'Pierce County WA 2008 County Executive Election', 1441.6, [0, 14, 9, 19, 44, 19, 9, 14, 41, 31]),
        ...compromise(ELECTIONS.pierce_2008, new VoterMovement(11, 'rightThenCenter', 'centerThenRight'), 'center_vs_right'),
        ...majorityFailure({
            electionTag: ELECTIONS.pierce_2008,
            winnerVoteCount: 95,
            bulletVoteCount: 14
        }),
        ...condorcetSuccess(ELECTIONS.pierce_2008),
        ...electionNote(ELECTIONS.pierce_2008, FAILURE.unselected,
            <p>Despite picking this correct winner, the compromise failure is still concerning because it shows that the result isn't stable,
                and could potentially be vulnerable to strategic voting</p>
        ),

        // San Francisco
        ...introTransition(ELECTIONS.san_francisco_2020, 'San Francisco 2020 District 7 Board of Supervisors Election',
            178.1, [0, 9, 12, 18, 31, 29, 22, 10, 31, 38]),
        ...downwardMonotonicity(ELECTIONS.san_francisco_2020, new VoterMovement(5, 'rightThenCenter', 'centerThenRight')),
        ...electionNote(ELECTIONS.san_francisco_2020, FAILURE.downward_mono,
            <p>(It shows as a tie here because they only won by a fraction of a vote)</p>
        ),
        ...condorcetSuccess(ELECTIONS.san_francisco_2020),
        ...electionNote(ELECTIONS.san_francisco_2020, FAILURE.unselected,
            <p>Despite picking this correct winner, the downward monotonicity failure is still concerning because it shows that the result isn't stable,
                and could potentially be vulnerable to strategic voting</p>
        ),
    ]
}

export default electionSelectorTransitions;