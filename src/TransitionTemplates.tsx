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
import { Box, Button, Table, TableRow } from "@mui/material";
import { dimensionNames, DimensionTag, ElectionDetails, elections, ElectionTag, makeTransitionGetter, OVERVIEW_DIMENSIONS, TransitionGetter } from "./Transitions";
import LinkIcon from '@mui/icons-material/Link';

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

const BackToTop = ({tag}: {tag: string}) => {
    if(getDimensionFromURL() != 'overview') return <></>
    return <> <div id={tag} style={{position: 'absolute', top: '-30vh'}}/>
        <a href='#toc'>️↑back to top️↑</a>
        <hr style={{width: '100%'}}/>
    </>
}

export const dimensionInfo = (election: ElectionDetails, dimensionTag: DimensionTag, isDimensionPage: boolean) => {
    if(getDimensionFromURL() != 'overview') return []
    return [
    new SimTransition({
        explainer: <div style={{position: 'relative'}}>
            {!isDimensionPage && <BackToTop tag={dimensionTag}/>}
            {isDimensionPage && <DimensionButtons election={undefined} />}
            <h1>{dimensionNames[dimensionTag]}</h1>
            {dimensionTag == 'spoiler' && <p>Spoiler Effect<br/><i>When a minor candidate enters a race and pulls votes away from the otherwise winning candidate, causing the winner to change to a different major candidate.</i></p>}
            {dimensionTag == 'upward-mono' && <p>Upward Monotonicity Pathology<br/>
                <i>A scenario where if the winning candidate had gained more support they would have lost</i>
            </p>}
            {dimensionTag == 'condorcet' && <>
                <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
                <p>Condorcet Failure<br/><i>A scenario where the voting method doesn't elect the candidate who was preferred over all others.</i></p>
                <p>Condorcet Failures are especially problematic for ranked methods like RCV that only look at voter preferences.
                    In other methods, like STAR Voting, where voters can show their level of support for each candidate in addition to their preference order, the case
                    can be made that the Condorcet Winner may not have been the most representative overall, but under ranked voting methods the Condorcet Winner is
                    widely recognized as the correct winner and is used to assess the voting method's accuracy.</p>
            </>}
            {dimensionTag == 'condorcet_success' && <>
                <p>For this election RCV did successfully elect the Condorcet Winner.</p>
                <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
            </>}
            {dimensionTag == 'cycle' && <>
                <p>Condorcet Winner<br/><i>A candidate who wins head-to-head against all other candidates</i></p>
                <p>Condorcet Cycle<br/><i>A scenario where no Condorcet Winner is present due to a cycle in the head-to-head matchups</i></p>
                <p>To be clear Condorcet Cycles ARE NOT failures of RCV (unlike the other failures in the list).
                    In some scenarios, voter preferences are cyclical and there is no one candidate preferred over all others.</p>
            </>}
            {dimensionTag == 'majority' && <>
                <p>Majoritarian Failure<br/><i>When the winning candidate does not have the majority of votes in the final round</i></p>
                <p>
                    Majoritarian Failures differ from the other failures in that they're so prolific. Research was conducted on all US RCV elections
                    that required multiple elimination rounds (i.e. the ones that would not have had a majority under plurality), and they found that <a href="https://arxiv.org/pdf/2301.12075.pdf">RCV
                    had Majoritarian Failures 52% of the time</a>
                </p>
            </>}
            {dimensionTag == 'downward-mono' && <>
                <p>Downward Monotonicity Pathology<br/><i>A scenario where a losing candidate could have lost support and won</i></p>
            </>}
            {dimensionTag == 'no-show' && <>
                <p>No Show Failure<br/><i>Scenario where a set of voters can get a better result by not voting at all</i></p>
            </>}
            {dimensionTag == 'compromise' && <>
                <p>Lesser-Evil Failure<br/><i>A scenario where a group of voters could have strategically
                    elevated the rank of a 'compromise' or 'lesser-evil' candidate over their actual favorite to get a better result.</i></p>
                <p>This is very familiar in Choose One Voting where you have to compromise to pick one of the front runners instead of picking your favorite.</p>
            </>}
            {dimensionTag == 'repeal' && <>
                <p>Repeal<br/><i>A scenario where a juristiction reverts back to Choose-One voting after trying RCV</i></p>
            </>}
            {isDimensionPage && <ScrollMessage/>}
            {isDimensionPage && <div style={{position: 'relative'}}>
                <div id='toc' style={{position: 'absolute', top: '-30vh'}}/>
                <p>Elections experiencing a "{dimensionNames[dimensionTag]}"</p>
                <ul>{elections.filter(e => e.dimensions.includes(dimensionTag)).map((e,i) => <li><a href={`#${e.tag}`}>{e.title}</a></li>)}</ul>
            </div>}
        </div>,
        electionName: election.tag,
        visible: 'undefined',
        runoffStage: 'firstRound',
        voterMovements: [ new VoterMovement(election.camps) ] 
    })
]};

export const getDimensionFromURL = (i=1) => window.location.pathname.replaceAll('/', ' ').trim().split(' ')?.[i] ?? 'overview'

export const DimensionButtons = ({election=undefined, excludeSelected=false}: {election?: ElectionDetails, excludeSelected?: boolean}) => {
    const DimensionButton = ({title, href, selected, isExternal}: {title: string, href: string, selected: boolean, isExternal: boolean}) =>
        <Button disabled={selected} href={href} sx={{
            background: selected? 'black': 'white',
            border: selected? '2px solid white' : 'none',
            //height: '30px',
            borderRadius: '20px',
            textTransform: 'none',
            ':visited': {
                color: selected? 'white' : 'black',
            },
            ':hover': {
                backgroundColor: 'gray'
            }
        }}>
            <Box display='flex' sx={{
                color: selected? 'white' : 'black',
                justifyContent: 'center',
                gap: 1
            }}>
                <b>{title}</b>
                {isExternal && <LinkIcon sx={{margin: 'auto'}}/>}
            </Box>
        </Button>

    const host = window.location.href.split('/')[0]

    let dims: DimensionTag[] = [];
    let tag: string = '';
    let selected: string = '';
    if(election === undefined){
        tag = getDimensionFromURL(0);
        selected = tag;
        dims = OVERVIEW_DIMENSIONS;
    }else{
        tag = election.tag;
        selected = getDimensionFromURL(1);
        dims = [
            'overview',
            ...(Object.keys(election.customDimensions ?? {}) as DimensionTag[]),
            ...election.dimensions.filter(dim => !OVERVIEW_DIMENSIONS.includes(dim) && !(dim in (election.customDimensions ?? {})))
        ]
    }

    return <Box display='flex' flexDirection='row' flexWrap='wrap' gap={3} sx={{ml: 5}}>
        {dims.filter(dim => excludeSelected? (dim != selected) : true).map(dim => 
            <DimensionButton
                title={dimensionNames[dim]}
                href={
                    (election === undefined ? 
                        `${host}/${dim}`
                    : (
                        (election && typeof election.customDimensions?.[dim] === 'string') ?
                            election.customDimensions[dim] as string :
                        `${host}/${tag}/${dim == 'overview' ? '' : dim}`
                    ))
                }
                isExternal={election !== undefined && (typeof election.customDimensions?.[dim] === 'string')}
                selected={dim == selected}
            />
        )}
    </Box>
}

export const ScrollMessage = () => 
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px', margin: 'auto', marginBottom: '200px'}}>
        <img src={require("./assets/arrows.png")} style={{width: '40px'}}/>
        <p style={{textAlign: 'center'}}>scroll to see more</p>
        <img src={require("./assets/arrows.png")} style={{width: '40px'}}/>
    </div>

export const electionInfo = (election: ElectionDetails, isElectionPage: boolean): TransitionGetter => (makeTransitionGetter(election, undefined, () => {
    let items = [
        new SimTransition({
            explainer: <>
            {!isElectionPage && <BackToTop tag={election.tag}/>}
            <h1>{election.title}{isElectionPage && <>{':'} <br/> {dimensionNames[getDimensionFromURL() as DimensionTag]}</>}</h1>
            {isElectionPage && <DimensionButtons election={election} excludeSelected/>}
            <hr style={{marginTop: '30px', width: '100%'}}/>
            <p>
                <ul>
                    <li>Source: <a href={election.sourceURL}>{election.sourceTitle}</a></li>
                    <li>1 circle represents {election.ratio} real voters</li>
                    {election?.extraBullets}
                </ul>
            </p>
            {isElectionPage && <ScrollMessage/>}
            </>,
            electionName: election.tag,
            visible: [Candidate, Voter, VoterCamp, Pie],
            runoffStage: 'firstRound',
            // @ts-ignore
            voterMovements: [ new VoterMovement(election.camps) ] ,
            // HACK to keep the alaska deep dive working
            ...((getDimensionFromURL() == 'deep-dive') ? {
                visible: [Candidate],
                voterMovements: [],
            }: {})
        }),
    ];
    if((isElectionPage && election.dimensions.length > 1 && getDimensionFromURL() == 'overview') || election.extraContext){
        items.push(
            new SimTransition({
                explainer: <>
                {election?.extraContext}
                {isElectionPage && election.dimensions.length > 1 && getDimensionFromURL() == 'overview' && <div style={{position: 'relative'}}>
                    <div id='toc' style={{position: 'absolute', top: '-30vh'}}/>
                    <h1>Overview</h1>
                    <p>This election had the following scenarios : 
                    <ul>{OVERVIEW_DIMENSIONS.filter(d => election.dimensions.includes(d)).map((d,i) => <li><a href={`#${d}`}>{dimensionNames[d]}</a></li>)}</ul>
                    </p>
                </div>}
                </>,
                electionName: election.tag,
                visible: [Candidate, Voter, VoterCamp, Pie],
                runoffStage: 'firstRound',
                // @ts-ignore
                voterMovements: [ new VoterMovement(election.camps) ] ,
                // HACK to keep the alaska deep dive working
                ...((getDimensionFromURL() == 'deep-dive') ? {
                    visible: [Candidate],
                    voterMovements: [],
                }: {})
            })
        );
    }
    return items;
}));

export type TransitionGetterGen = ((election: ElectionDetails) => TransitionGetter)
type GetterMap = Partial<{
    [K in DimensionTag] : TransitionGetterGen;
}>
export const dimensionTemplates: GetterMap = {
    'spoiler': (election: ElectionDetails) => makeTransitionGetter(election, 'spoiler', () => ([
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
    'upward-mono': (election: ElectionDetails) => makeTransitionGetter(election, 'upward-mono', () => ([
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
    'downward-mono': (election: ElectionDetails) => makeTransitionGetter(election, 'downward-mono', () => ([
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
    'no-show': (election: ElectionDetails) => makeTransitionGetter(election, 'no-show', () => ([
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
    'star-conversion': (election: ElectionDetails) => makeTransitionGetter(election, 'star-conversion', () => {
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
                explainer: <>
                    <h1>What if this election was rerun with STAR Voting?</h1>
                    <p>STAR Voting is another alternative voting system that was designed to improve on the issues with Ranked Choice Voting.</p>
                    <img src={require(`./assets/exampleStarBallot.png`)} style={{maxWidth: '400px', width: '100%', marginLeft: '20px'}}/>
                    <p>Once voters have cast their ballots in a STAR Voting election, a winner is determined by adding up all the stars and then performing an automatic runoff between the top 2 score getters.</p>
                    <p>How would this election be different if the voters had used the STAR Voting system?</p>
                    <p>Converting between voting methods is always tricky since we can't say for sure how voters would have changed their vote, but we can still get an estimate.</p>
                </>,
                runoffStage: 'default'
            }),
            new SimTransition({
                visible: [Candidate, Voter, VoterCamp, Pie],
                focused: ['centerBullet'],
                explainer: <>
                    <p>Let's start with converting the {election.names.center} bullet voters. We'll assume that they would give 5 stars to {election.names.center} and then no stars to anyone else:</p>
                    {starBallot([5, 0, 0])}
                    <p>Since there are {c[1]} of those voters then that adds up to {c[1]*5} stars for {election.names.center}.</p>
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
                    <div style={{display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap'}}>
                    {starBallot([5, 1, 0])}
                    {starBallot([5, 4, 0])}
                    </div>
                    <p>Here's what we get if we add the 5,1,0 ballots to the previous data:</p>
                    <Bars election={election} data={dotCamp([
                        [5, 0, 0],
                        [5, 1, 0]
                    ])}/>
                    <p>And then we'll add a range to get a sense for how much bigger the {election.names.right} support could have been with the 5,4,0 ballots.</p>
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
                    <p>And then repeating the same process for those who voted {election.names.right} 1st and {election.names.center} 2nd, here's the 2 extremes for those converted ballots.</p>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap'}}>
                    {starBallot([1, 5, 0])}
                    {starBallot([4, 5, 0])}
                    </div>
                    <p>And then here's what the updated totals looks like:</p>
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
                    <p>After repeating the process for the remaining ballots, here are the final score ranges for STAR:</p>

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
                        total ends up in the center of the ranges:</p>
                    <Bars election={election} data={avgScore}/>
                    <p>If this happened then 
                        {avgLowScoreIndex == 0 && ` ${election.names.right} and ${election.names.left} `}
                        {avgLowScoreIndex == 1 && ` ${election.names.center} and ${election.names.left} `}
                        {avgLowScoreIndex == 2 && ` ${election.names.right} and ${election.names.center} `}
                        would proceed to the runoff.
                    </p>
                </>,
                runoffStage: 'default'
            }),
            new SimTransition({
                visible: [Candidate, Voter, VoterCamp, Pie],
                explainer: <>
                    <p>And then in the runoff round each vote will go to the finalist they most preferred (just like RCV) and then the win would go to {runoffWinner(avgLowScoreIndex)}.</p>
                    <p>So RCV and STAR work similarly in that they both narrow the field down to 2 candidates and end in a runoff, but they're very different in how they reduce the candidates.
                        First choice preference plays a outsized role in RCV so it ends up with many of the same problems as Choose-One, whereas STAR uses all the data to select the finalists with the most
                        overall support.
                    </p>
                    <p>This ballot conversion method referenced <a target="_blank" href="https://arxiv.org/pdf/2303.00108.pdf">a paper by Jeanne N. Clelland simulating the Alaska election with other voting methods</a>.
                    Check it out for more details.</p>
                </>,
                runoffStage: avgLowScoreIndex == 0? 'right_vs_left' : (avgLowScoreIndex == 1? 'center_vs_left' : 'center_vs_right')
            }),
            // new SimTransition({
                // visible: [Candidate, Voter, VoterCamp, Pie],
                // focused: ['centerBullet'],
                // explainer: <>
                    // <p>TODO: I could add a lot more detail here going over the different paths to victory for each candidate. Also I can explain
                        // if there's a condorcet winner then they'll win as long as they're in the top 2.
                        // If the condorcet winner is controversial (ex. 51% 5-star and 49% 0-star), then there's a a possibility that they won't get elected under STAR </p>
                // </>,
            // }),
        ]
    }),
    'repeal': (election: ElectionDetails) => makeTransitionGetter(election, 'repeal', () => ([
        new SimTransition({
            explainer: election.repealDetails,
            runoffstage: 'undefined',
            visible: 'undefined',
        })
    ]))
}
        
//...failureInfo(FAILURE.tally, <p>Tally Error<br/><i>A scenario where the election administrators failed to compute the election correctly</i></p>),

export const bulletVoteDefinition = () => {
    return new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Bullet Voting<br/><i>When a voter only chooses to rank their first choice preference</i></p>
            <p>Some voters who bullet vote genuinely only like one candidate. Others may do so because they aren't
                confident in their opinion, and that's okay. </p>
            <p>However, other voters bullet vote because they aren't confident with the voting system and
                likely would have ranked more candidates if they understood that it was safe to do so.
                Ranked Choice Voting's tabulation is not transparent, and voters may have a hard time
                navigating the incentives.</p>
        </>,
        runoffStage: 'undefined'
    });
}

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