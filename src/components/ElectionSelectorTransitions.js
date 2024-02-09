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
    'repeal': 'Repealed',
    'bullet_allocation': 'Bullet Vote Allocation'
};

const ELECTIONS = {
    unselected: '<pick an election>',
    alaska_special_2022: 'alaska-special-2022',
    alaska_general_2022: 'alaska-general-2022',
    burlington_2009: 'burlington-2009',
    minneapolis_2021: 'minneapolis-2021',
    pierce_2008: 'pierce-2008',
    san_francisco_2020: 'san-francisco-2020',
    alameda_2022: 'alameda-2022',
    moab_2021: 'moab-2021',
    nyc_2021: 'nyc-2021',
    aspen_2009: 'aspen-2009',

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
        // https://www.preflib.org/dataset/00016

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
        'failures': [FAILURE.unselected, FAILURE.compromise, FAILURE.majority, FAILURE.repeal],
    },
    'burlington-2009': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority, FAILURE.upward_mono, FAILURE.compromise, FAILURE.repeal],
    },
    'aspen-2009': {
        'failures': [FAILURE.unselected, FAILURE.majority, FAILURE.downward_mono, FAILURE.repeal],
    },
    'san-francisco-2020': {
        'failures': [FAILURE.unselected, FAILURE.downward_mono],
    },
    'minneapolis-2021': {
        'failures': [FAILURE.unselected, FAILURE.cycle, FAILURE.spoiler, FAILURE.majority, FAILURE.compromise, FAILURE.upward_mono, FAILURE.downward_mono],
    },
    'moab-2021': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.majority, FAILURE.upward_mono, FAILURE.spoiler, FAILURE.no_show, FAILURE.repeal],
    },
    'nyc-2021': {
        'failures': [FAILURE.unselected, FAILURE.tally, FAILURE.majority, FAILURE.bullet_allocation],
    },
    'alameda-2022': {
        'failures': [FAILURE.unselected, FAILURE.cycle, FAILURE.tally, FAILURE.spoiler, FAILURE.majority, FAILURE.downward_mono, FAILURE.upward_mono, FAILURE.compromise],
    },
    'alaska-special-2022': {
        'failures': [FAILURE.unselected, FAILURE.condorcet, FAILURE.spoiler, FAILURE.majority, FAILURE.upward_mono, FAILURE.compromise, FAILURE.no_show],
    },
    'alaska-general-2022': {
        'failures': [FAILURE.unselected],
    },
};

const electionSelectorTransitions = (simState, setRefreshBool, refreshVoters) => {
    const urlFormat = (txt) => {
        return txt.replace('<', '').replace('>', '');
    }

    const selectorTransition = () => {
        const switchElection = (newElection) => {
            simState.electionName=newElection;
            simState.selectorElection=newElection;

            document.querySelectorAll('.electionSelect').forEach((elem) =>{
                elem.value = newElection;
            });

            const url = new URLSearchParams(window.location.search);

            if(!url.get('primarySelector') || url.get('primarySelector') == 'election'){
                simState.selectorFailure=FAILURE.unselected;

                let electionFailures = elections[simState.selectorElection].failures;
                document.querySelectorAll('.failureOption').forEach((elem) =>{
                    elem.style.display = electionFailures.includes(elem.textContent)? 'block' : 'none';
                });

                document.querySelectorAll('.electionOption').forEach((elem) =>{
                    elem.style.display = elem.textContent == ELECTIONS.unselected ? 'none': 'block'; 
                });

                document.querySelectorAll('.failureSelect').forEach((elem) =>{
                    elem.value = FAILURE.unselected;
                });
            }

            url.set('selectorElection', urlFormat(simState.selectorElection));
            url.set('selectorFailure', urlFormat(simState.selectorFailure));
            window.history.replaceState( {} , '', `${window.location.href.split('?')[0]}?${url.toString()}`);

            refreshVoters();

            setRefreshBool(b => !b);
        }

        const switchFailure = (newFailure) => {
            simState.selectorFailure=newFailure;

            document.querySelectorAll('.failureSelect').forEach((elem) =>{
                elem.value = newFailure;
            });

            const url = new URLSearchParams(window.location.search);
            
            if(url.get('primarySelector') == 'failure'){
                simState.selectorElection = ELECTIONS.unselected;

                document.querySelectorAll('.electionOption').forEach((elem) =>{
                    elem.style.display = (elem.textContent == ELECTIONS.unselected || elections[elem.textContent].failures.includes(simState.selectorFailure))? 'block' : 'none';
                });

                document.querySelectorAll('.failureOption').forEach((elem) =>{
                    elem.style.display = elem.textContent == FAILURE.unselected ? 'none': 'block'; 
                });

                document.querySelectorAll('.electionSelect').forEach((elem) =>{
                    elem.value = ELECTIONS.unselected;
                });
            }

            url.set('selectorElection', urlFormat(simState.selectorElection));
            url.set('selectorFailure', urlFormat(newFailure));
            window.history.replaceState( {} , '', `${window.location.href.split('?')[0]}?${url.toString()}`);

            refreshVoters();

            setRefreshBool(b => !b);
        }

        return new SimTransition({
            visible: [Candidate, Pie],
            runoffStage: 'default',
            electionName: 'undefined',
            explainer:  <>
                <h1 style={{marginTop: 0, marginBottom: 0}}>RCV Case Studies</h1>
                <div className='selectorPanel'>
                    <div className={`selectors ${(new URLSearchParams(window.location.search).get('primarySelector') == 'failure')? 'selectorsSwapped' : ''}`}>
                        <div className='electionSelector'>
                            <select className='electionSelect' name="election" defaultValue={simState.selectorElection} onChange={(event) => {
                                switchElection(event.target.value);
                            }}>
                                {Object.entries(ELECTIONS).map(([key, election], i) => {
                                    const url = new URLSearchParams(window.location.search);
                                    let visible = url.get('primarySelector')=='failure'?
                                        election == ELECTIONS.unselected || elections[election].failures.includes(simState.selectorFailure) :
                                        election != ELECTIONS.unselected;
                                    return <option className='electionOption' key={i} style={{display: visible? 'block' : 'none'}}>{election}</option>
                                })}
                            </select>
                        </div>
                        <div className='failureSelector'>
                            <select className='failureSelect' name="failure" defaultValue={simState.selectorFailure} onChange={(event) => {
                                switchFailure(event.target.value);
                            }}>

                                {Object.entries(FAILURE).map(([key, failure], i) => {
                                    const url = new URLSearchParams(window.location.search);
                                    let visible = url.get('primarySelector')=='failure'?
                                        failure != FAILURE.unselected :
                                        elections[simState.selectorElection].failures.includes(failure);
                                    return <option className='failureOption' key={i} style={{display: visible? 'block' : 'none'}}>{failure}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='selectorButtons'>
                        <button onClick={(event) => {
                            const url = new URLSearchParams(window.location.search);
                            url.set('primarySelector', url.get('primarySelector') == 'failure'? 'election' : 'failure');
                            window.history.replaceState( {} , '', `${window.location.href.split('?')[0]}?${url.toString()}`);

                            if(url.get('primarySelector') == 'failure'){
                                document.querySelector('.selectors').classList.add('selectorsSwapped');
                                switchFailure(simState.selectorFailure == FAILURE.unselected ? FAILURE.condorcet : simState.selectorFailure);
                            }else{
                                document.querySelector('.selectors').classList.remove('selectorsSwapped');
                                switchElection(simState.selectorElection == ELECTIONS.unselected ? ELECTIONS.pierce_2008 : simState.selectorElection);
                            }
                        }}>⇅</button>
                        <button onClick={(event) => {
                            const url = new URLSearchParams(window.location.search);
                            url.set('onlySelector', 'true');
                            url.set('selectorElection', urlFormat(simState.selectorElection));
                            url.set('selectorFailure', urlFormat(simState.selectorFailure));
                            navigator.clipboard.writeText(`${window.location.href.split('?')[0]}?${url.toString()}`);
                            event.target.textContent = 'Link Copied!'
                            setTimeout(() => event.target.textContent = 'Copy Link', 800);
                        }}>Copy Link</button>
                    </div>
                </div>
            </>
        });
    }

    const electionInfo = (electionName, description, ratio, camps, srcTitle='An Examination of Ranked-Choice Voting in the United States, 2004–2022', srcUrl='https://arxiv.org/abs/2301.12075', moreBullets=<></>) => {
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
                    Pick from the drop down above for more details</p>,
                electionName: electionName,
                electionTag: electionName,
                failureTag: FAILURE.unselected,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }));
        }

        return intro;
    }

    const failureInfo = (failureTag, content) => {
        let intro = [new SimTransition({
            explainer: content,
            electionName: 'undefined',
            visible: 'undefined',
            runoffStage: 'undefined',
            electionTag: undefined,
            failureTag: failureTag,
        })];

        let electionsWithFailure = Object.values(ELECTIONS).filter(election => 
            election != ELECTIONS.unselected && elections[election].failures.includes(failureTag)
        );
        if(electionsWithFailure.length  > 1){
            intro.push(new SimTransition({
                explainer: <p>{failureTag} occurred in the following elections : 
                    <ul>{electionsWithFailure.map((f,i) => <li>{f}</li>)}</ul>
                    Pick from the drop down above for more details</p>,
                electionName: 'undefined',
                visible: 'undefined',
                runoffStage: 'undefined',
                electionTag: ELECTIONS.unselected,
                failureTag: failureTag,
            }));
        }

        return intro;
    }

    const majorityFailure = ({electionTag, winnerVoteCount, bulletVoteCount}) => {
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
                    <p>{leftCandidate} won in the final round, but then only had {winnerVoteCount}/200 votes (that's {Math.round(100*winnerVoteCount/200)}% of the vote)</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'right_vs_left',
            }),
            new SimTransition({
                ...def,
                explainer: <>
                    <p>The outlets reported this as a majority because the {bulletVoteCount} bullet votes for {centerCandidate} weren't able to transfer and weren't counted in the final round.</p>
                    <p>So as a result, the tally was reported as {winnerVoteCount}/{200-bulletVoteCount} = {Math.round(100*winnerVoteCount/(200-bulletVoteCount))}% instead of {Math.round(100*winnerVoteCount/200)}%</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                focused: ['centerCandidate', 'centerBullet'],
                runoffStage: 'right_vs_left',
            }),
        ];
    }

    const spoiler = (electionTag) => {
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
            failureTag: FAILURE.cycle,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
        return [
            
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
                        In this election, over 135,000 official looking test ballots were run through the system and were added to the
                        official preliminary results tally and reported to the public. The error was discovered by a candidate
                        who had done extensive exit polling and who called the preliminary results into question after finding
                        that the official results were inconsistent with his campaign's internal data.
                        NYC had to issue an apology and do a recount <a href='https://www.nytimes.com/2021/06/29/nyregion/adams-garcia-wiley-mayor-ranked-choice.html'>Full Story</a>
                    </p>,
                    <p>(unfortunately we don't have the data to show the effect in the simulation)</p>
                    <p>To be clear, this was the first election to use RCV in NYC. Running test ballots through voting software is
                        standard practice for system testing, but these ballots should have been deleted before the official
                        tabulation began and using real ballots filled out for real candidates for this kind of testing is not
                        consistent with best practices.</p>
                    <p>While this error wasn't specific to RCV, it still highlights the fact that RCV's complexity makes
                        it less transparent, harder to audit, and harder to detect errors that may occur. Unlike other
                        methods, with RCV all ballots have to be centralized in one location in order to determine the
                        elimination order and the vote transfers, which in turn means that early returns can't be fully
                        processed. Under Choose One, Approval, and STAR Voting, any subset of ballots can be tallied
                        separately and then added together later. This makes it much easier to tally ballots in the
                        first place, and makes it easier for election officials to check their work as they go.
                    </p>
                    <p>
                        The test ballots being included in the official count is only half the problem, the other half is that the election board was unable to discover the issue themselves before releasing the results.
                    </p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
            }),
        ]
    }

    const nycBulletAllocation = () => {
        let def = {
            electionName: ELECTIONS.nyc_2021,
            electionTag: ELECTIONS.nyc_2021,
            failureTag: FAILURE.bullet_allocation,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[def.electionTag];

        return [
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>Bullet Voting<br/><i>When a voter only chooses to rank their first choice preference</i></p>
                    <p>Some voters who bullet vote genuinely only like one candidate, and that's okay. </p>
                    <p>However other voters bullet vote because they're confused about the voting system and
                        likely would have ranked more candidates if they had a better understanding.</p>
                    <p>Eric Adams is the correct winner based on the ballot data we have, however if we assume that some of the
                        Wiley bullet voters were confused and would have preferred Garcia over Adams then we get a different result.</p>
                </>,
                runoffStage: 'firstRound'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>Let's assume that 4 of the Wiley bullet voters were confused and that their second choice picks were proportional to the second choice picks of the other Wiley voters (3 for Garcia, and 1 for Adams).</p>
                    <p>This level of voter confusion is reasonable considering that this was the first RCV election held in New York City. There's a learning curve before voter behaviour becomes more ideal.</p>
                </>,
                voterMovements: [
                    new VoterMovement(1, 'centerBullet', 'centerThenLeft'),
                    new VoterMovement(3, 'centerBullet', 'centerThenRight')
                ],
                runoffStage: 'firstRound'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>Wiley is still eliminated in the first round, but the voters that transferred to Garcia are enough give her the win.</p>
                    <p>This shows that Wiley and Garcia may have split the progressive vote in this election. If Wiley hadn't run, and only a few of those who bullet voted came out for Garcia then the results would have been different.</p>
                    <p>But again Eric Adams was the correct winner based on the data we have. There is no way to prove how bullet voters would have chosen to rank the rest of their ballot.</p>
                    <p>To learn more here's <a href="https://electionconfidence.org/2024/01/11/ranked-choice-voting-hurts-minorities-study/">a paper exploring the trends of bullet voting and ballot exhaustion among minority voters in the nyc election</a></p>
                </>,
                runoffStage: 'right_vs_left'
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
                        A bug in the software caused votes to not transfer correctly.
                        In one race this caused the candidates to be eliminated in the wrong order and the election was incorrectly
                        called for Resnick instead of Hutchinson. The issue was discovered 50 days later after the election
                        had been certified. Resnick took office initially, but the matter was eventually resolved in court.
                    </p>
                    <p>
                        The bug was specifically related to ballots that either skipped their first ranking or that specified a write-in for their first ranking.
                        These votes should have transferred to the next choice ranked.
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
                explainer: 
                <>
                    <p>To be clear, this bug was likely caused by human error and there was no evidence of election interference.</p>
                    <p>However, this still tells us a few things about RCV
                    <ol>
                        <li><u>RCV is Complicated</u>:
                       Most ballot data will never be counted, and determining which data to count in what order is inherently complex.
                       There are a lot of edge cases to consider so it's easy to miss an important detail when implementing the algorithm, and errors made are harder to catch.</li>
                        <li><u>RCV is Unstable</u>: If the first choice tallies are close, then minor adjustments to the vote can change the elimination order and have a major impact to the result
                            (Most other voting methods, including Approval and STAR Voting, count all ballot data given to ensure that popular candidates aren't eliminated prematurely.)</li>
                        <li><u>RCV is hard to audit</u>: Unlike other methods, with RCV all ballots have to be centralized
                        in one location in order to determine the elimination order and the vote transfers, which in turn
                        means that early returns can't be fully processed. Under Choose One, Approval, and STAR Voting, any
                        subset of ballots can be tallied separately and then added together later. This makes it much easier
                        to tally ballots in the first place, and makes it easier for election officials to check their work
                        as they go. The fact that the RCV software bug existed was only half the problem, the other half is
                        that it took over a month to realize that an error had even occurred and months to correct the issue
                        and then seat the correct candidate.</li>
                    </ol>
                    </p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'right_vs_left',
            }),
        ]
    }

    const condorcetSuccess = (electionTag, centerBeatsRight=true) => {
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
                    <p>and looks like {centerBeatsRight? centerCandidate : rightCandidate} also beats {centerBeatsRight? rightCandidate : centerCandidate} head-to-head (but it's not relevant for this case)</p>
                </>,
                runoffStage: 'center_vs_right'
            }),
            new SimTransition({
                ...def,
                visible: [Candidate, 'left_beats_right', centerBeatsRight? 'center_beats_right' : 'right_beats_center', 'left_beats_center'],
                focused: ['leftCandidate', 'left_beats_center', 'left_beats_right'],
                explainer: <>,
                    <p>So {leftCandidate} is the Condorcet winner! and RCV was successful in this case</p>
                </>,
                runoffStage: 'center_vs_right'
            }),
        ]
    }

    const condorcet = (electionTag) => {
        let def = {
            electionName: electionTag,
            electionTag: electionTag,
            failureTag: FAILURE.condorcet,
        }
        const [centerCandidate, rightCandidate, leftCandidate] = simState.candidateNames[electionTag];
        return [
            
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
        // Election Info
        ...electionInfo(ELECTIONS.alaska_special_2022, 'Alaska 2022 US Representative Special Election', 942.9, [0, 12, 29, 36, 23, 4, 5, 25, 50, 16],
            'A Mathematical Analysis of the 2022 Alaska Special Election for US House',
            'https://arxiv.org/abs/2209.04764'
        ),
        ...electionInfo(ELECTIONS.alaska_general_2022, 'Alaska 2022 US Representative General Election',
            1318.4, [0, 11, 33, 32, 17, 3, 6, 50, 42, 6],
            'Ranked Choice Voting And the Center Squeeze in the Alaska 2022 Special Election: How Might Other Voting Methods Compare?',
            'https://arxiv.org/abs/2303.00108',
        ),
        ...electionInfo(ELECTIONS.nyc_2021, 'New York City 2021 Democratic Mayor Election',
            4355.9, [0, 17, 30, 24, 19, 18, 21, 35, 25, 11],
            'Harvard Data Verse',
            'https://dataverse.harvard.edu/file.xhtml?fileId=6707224&version=7.0'
        ),
        ...electionInfo(ELECTIONS.burlington_2009, 'Burlington 2009 Mayor Election', 44.2, [0, 10, 18, 34, 29, 11, 9, 13, 46, 30]),
        ...electionInfo(ELECTIONS.minneapolis_2021, 'Minneapolis 2021 Ward 2 City Council Election', 44.5, [0, 19, 18, 20, 35, 17, 25, 11, 29, 26]),
        ...electionInfo(ELECTIONS.moab_2021, 'Moab 2021 City Council Election', 8.7, [0, 3, 41, 50, 1, 4, 13, 38, 41, 10],
            'Analysis of the 2021 Instant Run-Off Elections in Utah',
            'https://vixra.org/abs/2208.0166',
            <li>Moab was actually a multi winner election where they ran RCV multiple times to pick the winners.
                The first round failed to elect the Condorcet winner, but they were still elected in the second round so the error didn't have any impact
            </li>
        ),
        ...electionInfo(ELECTIONS.alameda_2022, 'Alameda 2022 Oakland School Director Election', 132.1, [0, 14, 16, 24, 28, 23, 18, 18, 27, 32],
            'Ranked Choice Bedlam in a 2022 Oakland School Director Election',
            'https://arxiv.org/abs/2303.05985',
            <li>NOTE: The Hutchinson vs Manigo head-to-head appears to be tied but this is because Manigo wins by a fraction of a simulated vote</li>
        ),
        ...electionInfo(ELECTIONS.pierce_2008, 'Pierce County WA 2008 County Executive Election', 1441.6, [0, 14, 9, 19, 44, 19, 9, 14, 41, 31]),
        ...electionInfo(ELECTIONS.san_francisco_2020, 'San Francisco 2020 District 7 Board of Supervisors Election',
            178.1, [0, 9, 12, 18, 31, 29, 22, 10, 31, 38]),
        ...electionInfo(ELECTIONS.aspen_2009, 'Aspen 2009 Council Election', 11.1, [0, 11, 19, 15, 22, 37, 24, 19, 23, 30],
            'RangeVoting.org',
            'https://rangevoting.org/Aspen09.html ',
            <>
                <li>Dataset: <a href='https://www.preflib.org/dataset/00016'>Preflib</a></li>
                <li>NOTE: This was a 2 seat election using a heavily modified version of STV (it's misleading to even call it STV, read the details <a href='https://rangevoting.org/cc.ord.003-09sec.pdf'>here</a>).
                    The first seat was given to Derek Johnson (not to be confused with Jack Johnson), and the Monotonicity occured when determining the second seat.
                    The computation for the second seat is identical to standard IRV.
                </li>
            </>
        ),

        // Failure Info
        ...failureInfo(FAILURE.condorcet, <>
            <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
            <p>Condorcet Failure<br/><i>A scenario where the voting method doesn't elect the candidate who was preferred over all others.</i></p>
            <p>Condorcet Failures are especially problematic for ranked methods like RCV that only look at voter preferences.
                In other methods, like STAR Voting, where voters can show their level of support for each candidate in addition to their preference order, the case
                can be made that the Condorcet winner may not have been the most representative overall, but under ranked voting methods the Condorcet winner is
                widely recognized as the correct winner and is used to assess the voting method's accuracy.</p>
        </>),
        ...failureInfo(FAILURE.tally, <p>Tally Error<br/><i>A scenario where the election administrators failed to compute the election correctly</i></p>),
        ...failureInfo(FAILURE.repeal, <p>Repeal<br/><i>A scenario where a juristiction reverts back to Choose-One voting after trying RCV</i></p>),
        ...failureInfo(FAILURE.spoiler, <p>Spoiler Effect<br/><i>When removing 1 or more losing candidates could cause the winner to change</i></p>),
        ...failureInfo(FAILURE.majority, <>
            <p>Majoritarian Failure<br/><i>When the winning candidate does not have the majority of votes in the final round</i></p>
            <p>
                Majoritarian failures differ from the other failures in that they're so prolific. Research was conducted on all US RCV elections
                that required multiple elimination rounds (i.e. the ones that would not have had a majority under plurality), and they found that <a href="https://arxiv.org/pdf/2301.12075.pdf">RCV
                had Majoritarian failures 52% of the time</a>
            </p>
        </>),
        ...failureInfo(FAILURE.upward_mono, <p>Upward Monotonicity Failure<br/>
        <i>A scenario where if the winning candidate had gained more support they would have lost</i></p>),
        ...failureInfo(FAILURE.compromise, <>
            <p>Lesser-Evil Failure<br/><i>A scenario where a group of voters could have strategically
                elevated the rank of a 'compromise' or 'lesser-evil' candidate over their actual favorite to get a better result.</i></p>
            <p>This is very familiar in Choose One Voting where you have to compromise to pick one of the front runners instead of picking your favorite</p>
        </>),
        ...failureInfo(FAILURE.downward_mono, <p>Downward Monotonicity Failure<br/><i>A scenario where a losing candidate could have lost support and won</i></p>),
        ...failureInfo(FAILURE.no_show, <>
            <p>No Show Failure<br/><i>Scenario where a set of voters can get a better result by not voting at all</i></p>
        </>),
        ...failureInfo(FAILURE.cycle, <>
            <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
            <p>Condorcet Cycle<br/><i>A scenario where no Condorcet Winner is present due to a cycle in the head-to-head matchups</i></p>
            <p>To be clear Condorcet Cycles ARE NOT failures of RCV (unlike the other failures in the list).
                In some scenarios, voter preferences are cyclical and there is no one candidate preferred over all others.</p>
        </>),

        // Aspen
        ...condorcetSuccess(ELECTIONS.aspen_2009, false),
        ...majorityFailure({
            electionTag: ELECTIONS.aspen_2009,
            winnerVoteCount: 96,
            bulletVoteCount: 11
        }),
        ...downwardMonotonicity(ELECTIONS.aspen_2009, new VoterMovement(7, 'rightBullet', 'centerBullet')),
        ...electionNote(ELECTIONS.aspen_2009, FAILURE.repeal,
            <p> Aspen did not enjoy their experience with IRV and repealed it shortly after this election, view details and
                polling <a href='https://rangevoting.org/Aspen09.html'>here</a>
            </p>
        ),

        // Alaska Special Election
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
        ...majorityFailure({
            electionTag: ELECTIONS.nyc_2021,
            winnerVoteCount: 92,
            bulletVoteCount: 17
        }),
        ...condorcetSuccess(ELECTIONS.nyc_2021),
        ...nycTallyError(ELECTIONS.nyc_2021),
        ...nycBulletAllocation(ELECTIONS.nyc_2021),

        // Burlington
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
        ...electionNote(ELECTIONS.burlington_2009, FAILURE.repeal,
            <p>Burlington repealed RCV after having used it in 2 mayoral elections in 2006 and
                2009 <a href="https://alaskapolicyforum.org/2020/10/failed-experiment-rcv/#_ftn46:~:text=choice%20voting%20system.-,Burlington%2C%20Vermont,-The%20City%20of">more details</a>
            </p>
        ),

        // Minneapolis
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
        ...condorcet(ELECTIONS.moab_2021),
        ...spoiler(ELECTIONS.moab_2021),
        ...upwardMonotonicity(ELECTIONS.moab_2021, [
            new VoterMovement(3, 'rightThenLeft', 'leftThenRight')
        ]),
        ...noShow(ELECTIONS.moab_2021, new VoterMovement(3, 'rightThenCenter', 'home')),
        ...electionNote(ELECTIONS.moab_2021, FAILURE.repeal,
            <p>Moab used RCV under Utah's pilot program for testing the system. In 2021, 23 cities signed up, but then only 12 of those cities stayed, and moab was one of the ones that opted
                out <a href="https://www.moabtimes.com/articles/city-returns-to-traditional-election-method/">source1</a> <a href="https://kslnewsradio.com/2003994/draper-city-bows-out-of-ranked-choice-voting-as-pilot-program-proceeds/">source2</a>
            </p>
        ),

        // Alameda
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
        ...compromise(ELECTIONS.pierce_2008, new VoterMovement(11, 'rightThenCenter', 'centerThenRight'), 'center_vs_right'),
        ...majorityFailure({
            electionTag: ELECTIONS.pierce_2008,
            winnerVoteCount: 95,
            bulletVoteCount: 14
        }),
        ...condorcetSuccess(ELECTIONS.pierce_2008),
        ...electionNote(ELECTIONS.pierce_2008, FAILURE.unselected,
            <p>Despite picking this correct winner, the Lesser-Evil failure is still concerning because it shows that the result isn't stable,
                and could potentially be vulnerable to strategic voting</p>
        ),
        ...electionNote(ELECTIONS.pierce_2008, FAILURE.repeal, <>
            <p>RCV was only used for one election cycle, here's a quote from Elections Direcector Nick Handy:</p>
            <p><i>"Just three years ago, Pierce County voters enthusiastically embraced this new idea as a replacement for the then highly unpopular Pick-a-Party primary.”   Pierce County did a terrific job implementing ranked choice voting, but voters flat out did not like it.
                The rapid rejection of this election model that has been popular in San Francisco, but few other places, was expected, but no one really anticipated how fast the cradle to grave cycle would run.  The voters wanted it. The voters got and tried it.  The voters did not like it.
                And the voters emphatically rejected it.  All in a very quick three years."</i> <a href="https://blogs.sos.wa.gov/FromOurCorner/index.php/2009/11/pierce-voters-nix-ranked-choice-voting/">source</a></p>
        </>),

        // San Francisco
        ...downwardMonotonicity(ELECTIONS.san_francisco_2020, new VoterMovement(5, 'rightThenCenter', 'centerThenRight')),
        ...electionNote(ELECTIONS.san_francisco_2020, FAILURE.downward_mono,
            <p>(It shows as a tie here because they only won by a fraction of a vote)</p>
        ),
        ...condorcetSuccess(ELECTIONS.san_francisco_2020, false),
        ...electionNote(ELECTIONS.san_francisco_2020, FAILURE.unselected,
            <p>Despite picking this correct winner, the Downward Monotonicity failure is still concerning because it shows that the result isn't stable,
                and could potentially be vulnerable to strategic voting</p>
        ),
    ]
}

export default electionSelectorTransitions;