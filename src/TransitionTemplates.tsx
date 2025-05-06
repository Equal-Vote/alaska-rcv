// Added no checks since the following line was being annoying
// visible: [Candidate, Voter, VoterCamp, Pie],
// I don't know how to fix it without updating SimTransition to typescript

import { Fragment, useState } from "react";
// @ts-ignore
import { SimTransition } from "./SimTransition";
// @ts-ignore
import Candidate from "./components/Candidate";
// @ts-ignore
import Voter from "./components/Voter";
// @ts-ignore
import VoterCamp from "./components/VoterCamp";
// @ts-ignore
import Pie from "./components/Pie";
// @ts-ignore
import { VoterMovement } from "./VoterMovement";
// @ts-ignore
import Bars from "./components/Bars";
import { Table, TableRow } from "@mui/material";
import { dimensionNames, DimensionTag, ElectionDetails, ElectionTag, makeTransitionGetter, OVERVIEW_DIMENSIONS, TransitionGetter } from "./Transitions";

export const [
    HOME,
    CENTER_BULLET,
    CENTER_THEN_RIGHT,
    RIGHT_THEN_CENTER, 
    RIGHT_BULLET,
    RIGHT_THEN_LEFT,
    LEFT_THEN_RIGHT,
    LEFT_BULLET,
    LEFT_THEN_CENTER,
    CENTER_THEN_LEFT
] = Array(10).fill(0).map((_, i) => i)


export const ELECTION_TITLES = {
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

    'minneapolis-2021': 'Minneapolis 2021 Ward 2 City Council Election',
            // 'minneapolis-2021': ['Gordon', 'Arab', 'Worlobah'],
//    'minneapolis-2021': {
//        'failures': [FAILURE.unselected, FAILURE.spoiler, FAILURE.cycle, FAILURE.majority, FAILURE.compromise, FAILURE.upward_mono, FAILURE.downward_mono, FAILURE.star_conversion],
//    },
//    'minneapolis-2021': [0, 19, 18, 20, 35, 17, 25, 11, 29, 26],
//...electionInfo(ELECTIONS.minneapolis_2021, 44.5,),
//...spoiler(ELECTIONS.minneapolis_2021),
        //...electionNote(ELECTIONS.minneapolis_2021, FAILURE.spoiler,
            //<p>Note that the existence of a condorcet cycle implies that there will be a spoiler candidate regardless of which winner is chosen.</p>
        //),
        //...majorityFailure({
            //electionTag: ELECTIONS.minneapolis_2021,
            //winnerVoteCount: 91,
            //bulletVoteCount: 19
        //}),
        //...compromise(ELECTIONS.minneapolis_2021, new VoterMovement(8, 'rightThenCenter', 'centerThenRight')),        
        //...upwardMonotonicity(ELECTIONS.minneapolis_2021, [new VoterMovement(11, 'rightThenLeft', 'leftThenRight')]), 
        //...downwardMonotonicity(ELECTIONS.minneapolis_2021, new VoterMovement(2, 'rightThenCenter', 'centerThenRight')),
        //...condorcetCycle(ELECTIONS.minneapolis_2021),
        //...starConversion(ELECTIONS.minneapolis_2021),

    'pierce-2008': 'Pierce County WA 2008 County Executive Election',
            // 'pierce-2008': ['Goings', 'Bunney', 'McCarthy'],
//    'pierce-2008': {
//        'failures': [FAILURE.unselected, FAILURE.condorcet_success, FAILURE.compromise, FAILURE.majority, FAILURE.repeal, FAILURE.star_conversion],
//    'pierce-2008': [0, 14, 9, 19, 44, 19, 9, 14, 41, 31],
        //...electionInfo(ELECTIONS.pierce_2008, 1441.6),
//...compromise(ELECTIONS.pierce_2008, new VoterMovement(11, 'rightThenCenter', 'centerThenRight'), 'center_vs_right'),
        //...majorityFailure({
            //electionTag: ELECTIONS.pierce_2008,
            //winnerVoteCount: 95,
            //bulletVoteCount: 14
        //}),
        //...condorcetSuccess(ELECTIONS.pierce_2008),
        //...electionNote(ELECTIONS.pierce_2008, FAILURE.unselected,
            //<p>Despite picking this correct winner, the Lesser-Evil Failure is still concerning because it shows that the result isn't stable,
                //and could potentially be vulnerable to strategic voting.</p>
        //),
        //...electionNote(ELECTIONS.pierce_2008, FAILURE.repeal, <>
            //<p>RCV was only used for one election cycle, here's a quote from Elections Direcector Nick Handy:</p>
            //<p><i>"Just three years ago, Pierce County voters enthusiastically embraced this new idea as a replacement for the then highly unpopular Pick-a-Party primary.”   Pierce County did a terrific job implementing ranked choice voting, but voters flat out did not like it.
                //The rapid rejection of this election model that has been popular in San Francisco, but few other places, was expected, but no one really anticipated how fast the cradle to grave cycle would run.  The voters wanted it. The voters got and tried it.  The voters did not like it.
                //And the voters emphatically rejected it.  All in a very quick three years."</i> <a href="https://blogs.sos.wa.gov/FromOurCorner/index.php/2009/11/pierce-voters-nix-ranked-choice-voting/">source</a></p>
        //</>),
        //...starConversion(ELECTIONS.pierce_2008),

    'san-francisco-2020': 'San Francisco 2020 District 7 Board of Supervisors Election',
            // 'san-francisco-2020': ['Nguyen', 'Engardio', 'Melgar'],
//    'san-francisco-2020': {
//        'failures': [FAILURE.unselected, FAILURE.condorcet_success, FAILURE.downward_mono, FAILURE.star_conversion],
//    },
//    'san-francisco-2020': [0, 9, 12, 18, 31, 29, 22, 10, 31, 38],
        //...electionInfo(ELECTIONS.san_francisco_2020,
            //178.1),
//...downwardMonotonicity(ELECTIONS.san_francisco_2020, new VoterMovement(5, 'rightThenCenter', 'centerThenRight')),
        //...electionNote(ELECTIONS.san_francisco_2020, FAILURE.downward_mono,
            //<p>(It shows as a tie here because they only won by a fraction of a vote).</p>
        //),
        //...condorcetSuccess(ELECTIONS.san_francisco_2020, false),
        //...electionNote(ELECTIONS.san_francisco_2020, FAILURE.unselected,
            //<p>Despite picking this correct winner, the Downward Monotonicity Pathology is still concerning because it shows that the result isn't stable,
                //and could potentially be vulnerable to strategic voting.</p>
        //),
        //...starConversion(ELECTIONS.san_francisco_2020),

    'alameda-2022': 'Oakland 2022 School Director Election',
            // 'alameda-2022': ['Manigo', 'Resnick', 'Hutchinson'],
//    'alameda-2022': {
//        'failures': [FAILURE.unselected, FAILURE.spoiler, FAILURE.cycle, FAILURE.tally, FAILURE.majority, FAILURE.downward_mono, FAILURE.upward_mono, FAILURE.compromise, FAILURE.star_conversion],
//    },
//    'alameda-2022': [0, 14, 16, 24, 28, 23, 18, 18, 27, 32],
//...electionNote(ELECTIONS.alameda_2022, FAILURE.spoiler, <>
            //<p>Note that the Hutchinson vs Manigo head-to-head appears to be tied but this is because Manigo wins by a fraction of a simulated vote</p>
        //</>),
        //...spoiler(ELECTIONS.alameda_2022),
        //...electionNote(ELECTIONS.alameda_2022, FAILURE.spoiler, <>
            //<p>Note that the existence of a condorcet cycle implies that there will be a spoiler candidate regardless of which winner is chosen.</p>
        //</>),
        //...majorityFailure({
            //electionTag: ELECTIONS.alameda_2022,
            //winnerVoteCount: 95,
            //bulletVoteCount: 14
        //}),
        //...alamedaTallyError(),
        //...downwardMonotonicity(ELECTIONS.alameda_2022, new VoterMovement(1, 'rightThenCenter', 'centerThenRight')),
        //...upwardMonotonicity(ELECTIONS.alameda_2022, [new VoterMovement(16, 'rightThenLeft', 'leftThenRight')]),
        //...compromise(ELECTIONS.alameda_2022, new VoterMovement(13, 'rightThenCenter', 'centerThenRight')),
        //...electionNote(ELECTIONS.alameda_2022, FAILURE.cycle,
            //<p>Note that the Hutchinson vs Manigo head-to-head appears to be tied but this is because Manigo wins by a fraction of a simulated vote</p>
        //),
        //...condorcetCycle(ELECTIONS.alameda_2022),
        //...starConversion(ELECTIONS.alameda_2022),

    'moab-2021': 'Moab 2021 City Council Election',
            // 'moab-2021': ['Wojciechowski', 'Kovash', 'Taylor'],
//    'moab-2021': {
//        'failures': [FAILURE.unselected, FAILURE.spoiler, FAILURE.condorcet, FAILURE.majority, FAILURE.upward_mono,  FAILURE.no_show, FAILURE.repeal, FAILURE.star_conversion],
//    },
//    'moab-2021': [0, 3, 41, 50, 1, 4, 13, 38, 41, 10],
//...electionInfo(ELECTIONS.moab_2021, 8.7,
            //'Analysis of the 2021 Instant Run-Off Elections in Utah',
            //'https://vixra.org/abs/2208.0166',
            //<li>Moab was actually a multi winner election where they ran RCV multiple times to pick the winners.
                //The first round failed to elect the Condorcet Winner, but they were still elected in the second round so the error didn't have any impact
            //</li>
        //),
//...condorcet(ELECTIONS.moab_2021),
        //...spoiler(ELECTIONS.moab_2021),
        //...upwardMonotonicity(ELECTIONS.moab_2021, [
            //new VoterMovement(3, 'rightThenLeft', 'leftThenRight')
        //]),
        //...noShow(ELECTIONS.moab_2021, new VoterMovement(3, 'rightThenCenter', 'home')),
        //...electionNote(ELECTIONS.moab_2021, FAILURE.repeal,
            //<p>Moab used RCV under Utah's pilot program for testing the system. In 2021, 23 cities signed up, but then only 12 of those cities stayed, and moab was one of the ones that opted
                //out <a href="https://www.moabtimes.com/articles/city-returns-to-traditional-election-method/">source1</a> <a href="https://kslnewsradio.com/2003994/draper-city-bows-out-of-ranked-choice-voting-as-pilot-program-proceeds/">source2</a>
            //</p>
        //),
        //...starConversion(ELECTIONS.moab_2021),

    'nyc-2021': 'New York City 2021 Democratic Mayor Election',
            // 'nyc-2021': ['Wiley', 'Garcia', 'Adams'],
//    'nyc-2021': {
//        'failures': [FAILURE.unselected, FAILURE.condorcet_success, FAILURE.tally, FAILURE.majority, FAILURE.bullet_allocation, FAILURE.star_conversion],
//    },
//    'nyc-2021': [0, 17, 30, 24, 19, 18, 21, 35, 25, 11],
//...electionInfo(ELECTIONS.nyc_2021, 
            //4355.9,
            //'Harvard Data Verse',
            //'https://dataverse.harvard.edu/file.xhtml?fileId=6707224&version=7.0'
        //),
//...majorityFailure({
            //electionTag: ELECTIONS.nyc_2021,
            //winnerVoteCount: 92,
            //bulletVoteCount: 17
        //}),
        //...condorcetSuccess(ELECTIONS.nyc_2021),
        //...nycTallyError(ELECTIONS.nyc_2021),
        //...nycBulletAllocation(ELECTIONS.nyc_2021),
        //...starConversion(ELECTIONS.nyc_2021),

    'aspen-2009': 'Aspen 2009 Council Election',
            // 'aspen-2009': ['Johnson', 'Behrendt', 'Torre'],
//    'aspen-2009': {
//        'failures': [FAILURE.unselected, FAILURE.condorcet_success, FAILURE.majority, FAILURE.downward_mono, FAILURE.repeal, FAILURE.star_conversion],
//    },
//    'aspen-2009': [0, 11, 19, 15, 22, 37, 24, 19, 23, 30],
        //...electionInfo(ELECTIONS.alameda_2022, 132.1,
            //'Ranked Choice Bedlam in a 2022 Oakland School Director Election',
            //'https://arxiv.org/abs/2303.05985',
        //),
        //...electionInfo(ELECTIONS.aspen_2009, 11.1,
            //'RangeVoting.org',
            //'https://rangevoting.org/Aspen09.html ',
            //<>
                //<li>Dataset: <a href='https://www.preflib.org/dataset/00016'>Preflib</a></li>
                //<li>NOTE: This was a 2 seat election using a heavily modified version of STV (it's misleading to even call it STV, read the details <a href='https://rangevoting.org/cc.ord.003-09sec.pdf'>here</a>).
                    //The first seat was given to Derek Johnson (not to be confused with Jack Johnson), and the Monotonicity occured when determining the second seat.
                    //The computation for the second seat is identical to standard IRV.
                //</li>
            //</>
        //),
        //...condorcetSuccess(ELECTIONS.aspen_2009, false),
        //...majorityFailure({
            //electionTag: ELECTIONS.aspen_2009,
            //winnerVoteCount: 96,
            //bulletVoteCount: 11
        //}),
        //...downwardMonotonicity(ELECTIONS.aspen_2009, new VoterMovement(7, 'rightBullet', 'centerBullet')),
        //...electionNote(ELECTIONS.aspen_2009, FAILURE.repeal,
            //<p> Aspen did not enjoy their experience with IRV and repealed it shortly after this election, <a href='https://rangevoting.org/Aspen09.html'>view details</a></p>
        //),
        //...starConversion(ELECTIONS.aspen_2009),
}

const dimensionInfo = (election: ElectionDetails, dimensionTag: DimensionTag, content: any) => {
    let intro = [new SimTransition({
        explainer: <div style={{position: 'relative'}}>
            <div id={dimensionTag} style={{position: 'absolute', top: '-30vh'}}/>
            <a href='#toc'>️↑back to top️↑</a>
            <hr/>
            <h1>{dimensionNames[dimensionTag]}</h1>
            {content}
        </div>,
        electionName: 'undefined',
        visible: 'undefined',
        runoffStage: 'firstRound',
        voterMovements: [ new VoterMovement(election.camps) ] 
    })];

    //let electionsWithFailure = Object.values(ELECTIONS).filter(election => 
    //    election != ELECTIONS.unselected && elections[election].failures.includes(failureTag)
    //);
    //if(electionsWithFailure.length  > 1){
    //    intro.push(new SimTransition({
    //        explainer: <p>{failureTag} occurred in the following elections : 
    //            <ul>{electionsWithFailure.map((f,i) => <li>{f}</li>)}</ul>
    //            Pick from the drop down above for more details</p>,
    //        electionName: 'undefined',
    //        visible: 'undefined',
    //        runoffStage: 'undefined',
    //    }));
    //}

    return intro;
}

export const electionInfo = (election: ElectionDetails): TransitionGetter => (makeTransitionGetter(election, undefined, () => ([
    new SimTransition({
        explainer: <>
        <h1>{election.title}</h1>
        <p>
            <ul>
                <li>1 voter = {election.ratio} real voters</li>
                <li>Source: <a href={election.sourceURL}>{election.sourceTitle}</a></li>
                {election?.extraBullets}
            </ul>
        </p>
        {election?.extraContext}
        {election.dimensions.length > 1 && <div style={{position: 'relative'}}>
            <div id='toc' style={{position: 'absolute', top: '-30vh'}}/>
            <p>This election had the following scenarios : 
            <ul>{OVERVIEW_DIMENSIONS.filter(d => election.dimensions.includes(d)).map((d,i) => <li><a href={`#${d}`}>{dimensionNames[d]}</a></li>)}</ul>
            </p>
        </div>}
        </>,
        electionName: election.tag,
        visible: [Candidate, Voter, VoterCamp, Pie],
        runoffStage: 'firstRound',
        // @ts-ignore
        voterMovements: [ new VoterMovement(election.camps) ] 
    })
])));

export type TransitionGetterGen = ((election: ElectionDetails) => TransitionGetter)
type GetterMap = Partial<{
    [K in DimensionTag] : TransitionGetterGen;
}>
export const dimensionTemplates: GetterMap = {
    'spoiler': (election: ElectionDetails) => makeTransitionGetter(election, 'spoiler', () => ([
        ...dimensionInfo(election, 'spoiler', <p>Spoiler Effect<br/><i>When a minor candidate enters a race and pulls votes away from the otherwise winning candidate, causing the winner to change to a different major candidate.</i></p>),
        new SimTransition({
            explainer: <>
                <p>If the election was between {election.names.left} and {election.names.center} then {election.names.center} would have won</p>
            </>,
            visible: [Candidate, Voter, VoterCamp, Pie],
            runoffStage: 'center_vs_left'
        }),
        new SimTransition({
            explainer: <>
                <p>but when {election.names.right} joins the race voters are pulled away from {election.names.center}.</p>
            </>,
            visible: [Candidate, Voter, VoterCamp, Pie],
            runoffStage: 'firstRound'
        }),
        new SimTransition({
            explainer: <>
                <p>Then {election.names.center} gets eliminated in the first round and {election.names.left} wins!</p>
                <p>So {election.names.right} was a spoiler. {election.names.right} would have lost regardless, but joining the race still impacted the winner</p>
            </>,
            visible: [Candidate, Voter, VoterCamp, Pie],
            runoffStage: 'right_vs_left'
        }),
    ])),
    'upward_mono': (election: ElectionDetails) => makeTransitionGetter(election, 'upward_mono', () => ([
        ...dimensionInfo(election, 'upward_mono', <p>Upward Monotonicity Pathology<br/>
        <i>A scenario where if the winning candidate had gained more support they would have lost</i></p>),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>{election.names.left} won in the runoff.</p>
            </>,
            runoffStage: 'right_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>But if we restart the election.</p>
            </>,
            runoffStage: 'firstRound',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>And pretend {election.names.left} gained {election.upwardMonoMovements?.reduce((p, m) => p + m.count, 0)} voters from {election.names.right}.</p>
            </>,
            runoffStage: 'firstRound',
            voterMovements: election.upwardMonoMovements ?? []
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>Then {election.names.left} would have lost to {election.names.center} in the runoff.</p>
            </>,
            runoffStage: 'center_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>(reset)</p>
            </>,
            runoffStage: 'center_vs_left',
            voterMovements: election.upwardMonoMovements?.map(v => v.getReversed()) ?? []
        }),

    ])),
    'condorcet': (election: ElectionDetails) => makeTransitionGetter(election, 'condorcet', () => ([
        ...dimensionInfo(election, 'condorcet', <>
            <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
            <p>Condorcet Failure<br/><i>A scenario where the voting method doesn't elect the candidate who was preferred over all others.</i></p>
            <p>Condorcet Failures are especially problematic for ranked methods like RCV that only look at voter preferences.
                In other methods, like STAR Voting, where voters can show their level of support for each candidate in addition to their preference order, the case
                can be made that the Condorcet Winner may not have been the most representative overall, but under ranked voting methods the Condorcet Winner is
                widely recognized as the correct winner and is used to assess the voting method's accuracy.</p>
        </>),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>{election.names.left} won in the runoff.</p>
            </>,
            runoffStage: 'right_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>but {election.names.center} would have beaten {election.names.left} head-to-head.</p>
            </>,
            runoffStage: 'center_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>and {election.names.center} also beats {election.names.right} head-to-head.</p>
            </>,
            runoffStage: 'center_vs_right'
        }),
        new SimTransition({
            visible: [Candidate, 'left_beats_right', 'center_beats_right', 'center_beats_left'],
            focused: ['centerCandidate', 'center_beats_right', 'center_beats_left'],
            explainer: <>,
                <p>So {election.names.center} is the actual Condorcet Winner! and RCV failed to elect them.</p>
            </>,
            runoffStage: 'center_vs_right'
        }),
    ])),
    'condorcet_success': (election: ElectionDetails) => makeTransitionGetter(election, 'condorcet_success', () => ([
        ...dimensionInfo(election, 'condorcet_success', <>
            <p>For this election RCV did successfully elect the Condorcet Winner.</p>
            <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
        </>),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>{election.names.left} won in the runoff.</p>
            </>,
            runoffStage: 'right_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>and {election.names.left} would have also beaten {election.names.center} head-to-head.</p>
            </>,
            runoffStage: 'center_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>and looks like {election.centerBeatsRight? election.names.center : election.names.right} also beats {election.centerBeatsRight? election.names.right : election.names.center} head-to-head (but it's not relevant for this case).</p>
            </>,
            runoffStage: 'center_vs_right'
        }),
        new SimTransition({
            visible: [Candidate, 'left_beats_right', election.centerBeatsRight? 'center_beats_right' : 'right_beats_center', 'left_beats_center'],
            focused: ['leftCandidate', 'left_beats_center', 'left_beats_right'],
            explainer: <>,
                <p>So {election.names.left} is the Condorcet Winner! and RCV was successful in this case.</p>
            </>,
            runoffStage: 'center_vs_right'
        }),
    ])),
    'cycle': (election: ElectionDetails) => makeTransitionGetter(election, 'cycle', () => ([
        ...dimensionInfo(election, 'cycle', <>
            <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
            <p>Condorcet Cycle<br/><i>A scenario where no Condorcet Winner is present due to a cycle in the head-to-head matchups</i></p>
            <p>To be clear Condorcet Cycles ARE NOT failures of RCV (unlike the other failures in the list).
                In some scenarios, voter preferences are cyclical and there is no one candidate preferred over all others.</p>
        </>),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>{election.names.left} won in the runoff.</p>
            </>,
            runoffStage: 'right_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>but {election.names.center} would have beaten {election.names.left} head-to-head.</p>
            </>,
            runoffStage: 'center_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>and {election.names.right} would have beaten {election.names.center} head-to-head.</p>
            </>,
            runoffStage: 'center_vs_right'
        }),
        new SimTransition({
            visible: [Candidate, 'left_beats_right', 'center_beats_left', 'right_beats_center'],
            explainer: <>,
                <p>So the head-to-head match ups form a cycle, and it's not clear who the ideal winner should be.</p>
            </>,
            runoffStage: 'center_vs_right'
        }),
    ])),
    'majority': (election: ElectionDetails) => makeTransitionGetter(election, 'majority', () => {
        const winnerVoteCount =
            election.camps[LEFT_THEN_RIGHT] +
            election.camps[LEFT_BULLET] +
            election.camps[LEFT_THEN_CENTER] +
            election.camps[CENTER_THEN_LEFT];
        return [
            ...dimensionInfo(election, 'majority', <>
                <p>Majoritarian Failure<br/><i>When the winning candidate does not have the majority of votes in the final round</i></p>
                <p>
                    Majoritarian Failures differ from the other failures in that they're so prolific. Research was conducted on all US RCV elections
                    that required multiple elimination rounds (i.e. the ones that would not have had a majority under plurality), and they found that <a href="https://arxiv.org/pdf/2301.12075.pdf">RCV
                    had Majoritarian Failures 52% of the time</a>
                </p>
            </>),
            new SimTransition({
                explainer: <>
                    <p>{election.names.left} won in the final round, but then only had {winnerVoteCount}/200 votes (that's {Math.round(100*winnerVoteCount/200)}% of the vote).</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'right_vs_left',
            }),
            new SimTransition({
                explainer: <>
                    <p>The outlets reported this as a majority because the {election.camps[CENTER_BULLET]} bullet votes for {election.names.center} weren't able to transfer and weren't counted in the final round.</p>
                    <p>So as a result, the tally was reported as {winnerVoteCount}/{200-election.camps[CENTER_BULLET]} = {Math.round(100*winnerVoteCount/(200-election.camps[CENTER_BULLET]))}% instead of {Math.round(100*winnerVoteCount/200)}%.</p>
                </>,
                visible: [Candidate, Voter, VoterCamp, Pie],
                focused: ['centerCandidate', 'centerBullet'],
                runoffStage: 'right_vs_left',
            }),
        ]
    }),
    'downward_mono': (election: ElectionDetails) => makeTransitionGetter(election, 'downward_mono', () => ([
        ...dimensionInfo(election, 'downward_mono', <p>Downward Monotonicity Pathology<br/><i>A scenario where a losing candidate could have lost support and won</i></p>),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>{election.names.left} won in the runoff.</p>
            </>,
            runoffStage: 'right_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>But if we restart the election.</p>
            </>,
            runoffStage: 'firstRound',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>And pretend {election.names.right} lost {election.downwardMonoMovement?.count} voters to {election.names.center}.</p>
            </>,
            runoffStage: 'firstRound',
            voterMovements: [election.downwardMonoMovement]
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>Then {election.names.left} would be eliminated in the first round and {election.names.right} would win.</p>
            </>,
            runoffStage: 'center_vs_right'
        })
    ])),
    'no_show': (election: ElectionDetails) => makeTransitionGetter(election, 'no_show', () => ([
        ...dimensionInfo(election, 'no_show', <>
            <p>No Show Failure<br/><i>Scenario where a set of voters can get a better result by not voting at all</i></p>
        </>),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>{election.names.left} won in the runoff.</p>
            </>,
            runoffStage: 'right_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>But if we restart the election.</p>
            </>,
            runoffStage: 'firstRound',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>And pretend that {election.noShowMovement?.count} {election.names.right} voters stayed home.</p>
            </>,
            runoffStage: 'firstRound',
            voterMovements: [election.noShowMovement]
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>Then {election.names.right} would be eliminated in the first round and {election.names.center} would win.</p>
            </>,
            runoffStage: 'center_vs_left'
        })
    ])),
    'compromise': (election: ElectionDetails) => makeTransitionGetter(election, 'compromise', () => ([
        ...dimensionInfo(election, 'compromise', <>
            <p>Lesser-Evil Failure<br/><i>A scenario where a group of voters could have strategically
                elevated the rank of a 'compromise' or 'lesser-evil' candidate over their actual favorite to get a better result.</i></p>
            <p>This is very familiar in Choose One Voting where you have to compromise to pick one of the front runners instead of picking your favorite.</p>
        </>),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>{election.names.left} won in the runoff.</p>
            </>,
            runoffStage: 'right_vs_left'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>But if we restart the election.</p>
            </>,
            runoffStage: 'firstRound',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>And pretend {election.compromiseMovement?.count} "{election.names.right} {'>'} {election.names.center}" voters were to compromise and rank {election.names.center} above {election.names.right}...</p>
            </>,
            runoffStage: 'firstRound',
            voterMovements: [election.compromiseMovement]
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>Then {election.names.center} would have won instead of {election.names.left}.</p>
                <p>Therefore it was not safe for the "{election.names.right} {'>'} {election.names.center}" voters to give their honest first choice. Doing so gave them their worst scenario.</p>
            </>,
            runoffStage: election.compromiseRunoffStage ?? 'center_vs_left'
        })
    ])),
    'star_conversion': (election: ElectionDetails) => makeTransitionGetter(election, 'star_conversion', () => {
        const c: number[] = election.camps;

        // @ts-ignore
        const starBallot = (stars) => 
            <table style={{border: 'none', background: '#222222', color: 'white', marginLeft: '20px', width: '300px'}}>
                {['center', 'right', 'left'].map((key: string, i) => <tr>
                    <td style={{textAlign: 'right'}}>{
                        //@ts-ignore (typescript being annoying)
                        election.names[key]
                    }</td>
                    <td style={{textAlign: 'left'}}>{new Array(stars[i]+1).join('⭐')}</td>
                </tr>)}
            </table>

        // @ts-ignore
        const dotCamp = (ballots) => {
            let data = [[0, 0], [0, 0], [0, 0]];
            for(let i = 0; i < ballots.length; i++){
                for(let j = 0; j < 3; j++){
                    let score = ballots[i][j];
                    if(Array.isArray(score)){
                        data[j][0] += score[0]*c[i+1];
                        data[j][1] += score[1]*c[i+1];
                    }else{
                        data[j][0] += score*c[i+1];
                        data[j][1] += score*c[i+1];
                    }
                }
            }
            return data;
        }

        // @ts-ignore
        const lowestScoringCandidate = (data) => {
            if(data[0][0] <= data[1][0] && data[0][0] <= data[2][0]) return 0;
            if(data[1][0] <= data[0][0] && data[1][0] <= data[2][0]) return 1;
            if(data[2][0] <= data[0][0] && data[2][0] <= data[1][0]) return 2;
        }

        // @ts-ignore
        const runoffWinner = (excluced) => {
            if(excluced == 0) return (c[2]+c[3]+c[4]+c[5]) > (c[6]+c[7]+c[8]+c[9])? election.names.right : election.names.left;
            if(excluced == 1) return (c[9]+c[1]+c[2]+c[3]) > (c[5]+c[6]+c[7]+c[8])? election.names.center : election.names.left;
            if(excluced == 2) return (c[8]+c[9]+c[1]+c[2]) > (c[3]+c[4]+c[5]+c[6])? election.names.center : election.names.right;
            return '';
        }

        const avgScore = dotCamp([
            [5,        0,       0       ],
            [5,        2.5,     0       ],
            [2.5,      5,       0       ],
            [0,        5,       0       ],
            [0,        5,       2.5     ],
            [0,        2.5,     5       ],
            [0,        0,       5       ],
            [2.5,      0,       5       ],
            [5,        0,       2.5     ],
        ]);

        const avgLowScoreIndex = lowestScoringCandidate(avgScore);

        return [
            new SimTransition({
                visible: [Candidate, Voter, VoterCamp, Pie],
                focused: ['centerBullet'],
                explainer: <>
                    <p>TODO: this will likely be the first time the reader is exposed to STAR, so I should add an intro here explaining the system, and linking them to a video</p>
                </>,
                runoffStage: 'default'
            }),
            new SimTransition({
                visible: [Candidate, Voter, VoterCamp, Pie],
                focused: ['centerBullet'],
                explainer: <>
                    <p>Let's convert the {election.names.center} bullet voters first. We'll assume that they gave 5 stars to {election.names.center} and then no stars to anyone else</p>
                    {starBallot([5, 0, 0])}
                    <p>Since there are {c[1]} of those voters then that adds up to {c[1]*5} stars for {election.names.center}</p>
                    <Bars election={election} data={dotCamp([
                        [5, 0, 0]
                    ])}/>
                </>,
                runoffStage: 'default'
            }),
            new SimTransition({
                visible: [Candidate, Voter, VoterCamp, Pie],
                focused: ['centerThenRight'],
                explainer: <>
                    <p>Next we'll look at those who voted {election.names.center} 1st and {election.names.right} 2nd. We can assume they would have given {election.names.center} 5 stars,
                    and {election.names.left} 0 stars, but their level of support for {election.names.right} is not as clear.</p>
                    <p>Depending on how strongly they felt about {election.names.right} they could have given a score anywhere between 1 and 4 stars and still maintained their relative ranking.</p>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                    {starBallot([5, 1, 0])}
                    {starBallot([5, 4, 0])}
                    </div>
                    <p>Here's what we get if we add the 5,1,0 ballots to the previous data</p>
                    <Bars election={election} data={dotCamp([
                        [5, 0, 0],
                        [5, 1, 0]
                    ])}/>
                    <p>And then we'll add a range to get a sense for how much bigger the {election.names.right} support could have been with the 5,4,0 ballots</p>
                    <Bars election={election} data={dotCamp([
                        [5, 0,      0],
                        [5, [1, 4], 0]
                    ])}/>
                </>,
                runoffStage: 'default'
            }),
            new SimTransition({
                visible: [Candidate, Voter, VoterCamp, Pie],
                focused: ['rightThenCenter'],
                explainer: <>
                    <p>And then repeating the same process for those who voted {election.names.right} 1st and {election.names.center} 2nd, here's the 2 extremes for those converted ballots</p>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                    {starBallot([1, 5, 0])}
                    {starBallot([4, 5, 0])}
                    </div>
                    <p>And then here's what the updated totals looks like</p>
                    <Bars election={election} data={dotCamp([
                        [5,        0,       0],
                        [5,        [1,4],   0],
                        [[1,4],    5,       0]
                    ])}/>
                </>,
                runoffStage: 'default'
            }),
            new SimTransition({
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>After repeating the process for the remaining ballots, here are the final score ranges for STAR</p>

                    <Bars election={election} data={dotCamp([
                        [5,        0,       0       ],
                        [5,        [1,4],   0       ],
                        [[1,4],    5,       0       ],
                        [0,        5,       0       ],
                        [0,        5,       [1,4]   ],
                        [0,        [1,4],   5       ],
                        [0,        0,       5       ],
                        [[1,4],    0,       5       ],
                        [5,        0,       [1,4]   ],
                    ])}/>

                </>,
                runoffStage: 'default'
            }),
            new SimTransition({
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>There are several possible outcomes depending on where the votes land in those ranges, but for a specific example let's see what would happen if we assume each
                        total ends up in the center of the ranges</p>
                    <Bars election={election} data={avgScore}/>
                    <p>If this happened then 
                        {avgLowScoreIndex == 0 && ` ${election.names.right} and ${election.names.left} `}
                        {avgLowScoreIndex == 1 && ` ${election.names.center} and ${election.names.left} `}
                        {avgLowScoreIndex == 2 && ` ${election.names.right} and ${election.names.center} `}
                        would proceed to the runoff
                    </p>
                </>,
                runoffStage: 'default'
            }),
            new SimTransition({
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>And then in the runoff round each vote will go to the finalist they most preferred (just like RCV) and then the win would go to {runoffWinner(avgLowScoreIndex)}</p>
                    <p>So RCV and STAR work similarly in that they both narrow the field down to 2 candidates and end in a runoff, but they're very different in how they reduce the candidates.
                        RCV only looks at first choice preferences so it ends up with many of the same problems as Choose-One, whereas STAR uses all the data to select the finalists with the most
                        overall support
                    </p>
                    <p>This ballot conversion method referenced <a target="_blank" href="https://arxiv.org/pdf/2303.00108.pdf">a paper by Jeanne N. Clelland simulating the Alaska election with other voting methods</a>.
                    Check it out for more details</p>
                </>,
                runoffStage: avgLowScoreIndex == 0? 'right_vs_left' : (avgLowScoreIndex == 1? 'center_vs_left' : 'center_vs_right')
            }),
            new SimTransition({
                visible: [Candidate, Voter, VoterCamp, Pie],
                focused: ['centerBullet'],
                explainer: <>
                    <p>TODO: I could add a lot more detail here going over the different paths to victory for each candidate. Also I can explain
                        if there's a condorcet winner then they'll win as long as they're in the top 2.
                        If the condorcet winner is controversial (ex. 51% 5-star and 49% 0-star), then there's a a possibility that they won't get elected under STAR </p>
                </>,
            }),
        ]
    }),
    'repeal': (election: ElectionDetails) => makeTransitionGetter(election, 'repeal', () => ([
        ...dimensionInfo(election, 'repeal', <>
            <p>Repeal<br/><i>A scenario where a juristiction reverts back to Choose-One voting after trying RCV</i></p>
        </>),
        new SimTransition({
            explainer: election.repealDetails,
            runoffstage: 'undefined',
            visible: 'undefined',
        })
    ]))
}
        
//...failureInfo(FAILURE.tally, <p>Tally Error<br/><i>A scenario where the election administrators failed to compute the election correctly</i></p>),

//const bulletVoteDefinition = (def) => {
//    return new SimTransition({
//        ...def,
//        visible: [Candidate, Voter, VoterCamp, Pie],
//        explainer: <>
//            <p>Bullet Voting<br/><i>When a voter only chooses to rank their first choice preference</i></p>
//            <p>Some voters who bullet vote genuinely only like one candidate. Others may do so because they aren't
//                confident in their opinion, and that's okay. </p>
//            <p>However, other voters bullet vote because they aren't confident with the voting system and
//                likely would have ranked more candidates if they understood that it was safe to do so.
//                Ranked Choice Voting's tabulation is not transparent, and voters may have a hard time
//                navigating the incentives.</p>
//        </>,
//        runoffStage: 'undefined'
//    });
//}

//const electionNote = (electionTag, failureTag, explainer) => {
//    // this doesn't need to be an array, but I figured this will keep the functions more consistent
//    return [new simtransition({
//        electionname: electiontag,
//        electiontag: electiontag,
//        failuretag: failuretag,
//        explainer: explainer,
//        runoffstage: 'undefined',
//        visible: 'undefined',
//    })]
//}
//

