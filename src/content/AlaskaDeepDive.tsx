// @ts-ignore
import { SimTransition } from '../SimTransition';
import { VoterMovement } from '../VoterMovement';
// @ts-ignore
import Candidate from '../components/Candidate';
// @ts-ignore
import Voter from '../components/Voter';
// @ts-ignore
import VoterCamp from '../components/VoterCamp';
// @ts-ignore
import Pie from '../components/Pie';
// @ts-ignore
import VideoEmbed from '../components/VideoEmbed';
import { makeTransitionGetter } from '../Transitions';

export default () => [
    // intro
    //new SimTransition({
    //    visible: ['choose_one'],
    //    explainer: <>
    //        <h1 style={{textAlign: 'center'}}>Alaska mobilized the nation around Ranked Choice Voting -- for better or worse: </h1>
    //        <h2 style={{textAlign: 'center', marginBottom: '50px'}}>We've brought the data to life to find out what really happened</h2>
    //    </>
    //}),
    new SimTransition({
        visible: ['choose_one'],
        explainer: <p>For centuries, we've been cursed with a voting method where it's not necessarily safe to pick your favorite.</p>,
    }),
    new SimTransition({
        visible: ['alaska'],
        explainer: <>
            <p>
                But Alaska decided to change that, and in 2022 they ran their first election replacing the current Choose One Voting system with Ranked Choice Voting (also called RCV).
            </p>
        </>,
    }),
    new SimTransition({
        visible: [Candidate],
        explainer: 
        <>
            <p>
                This election had the following candidates.
            </p>
            <ul>
                <li>Nick Begich (R)</li>
                <li>Sarah Palin (R)</li>
                <li>Mary Peltola (D)</li>
            </ul>
        </>,
    }),
    new SimTransition({
        visible: [Candidate],
        explainer: 
            <p>
                RCV claims to let more people run without fear of splitting the vote,
                so Republicans figured it was safe to run multiple candidates.
            </p>
        ,
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp],
        explainer: <p>We'll simplify the voters and pretend there were only 200 of them.</p>,
        voterMovements: [new VoterMovement(200, undefined, 'home')]
    }),
    // moving voters
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>12 voters ranked Begich first without ranking other candidates.</p>
            <img src={require("../assets/begichBullet.png")} style={{width: '75%'}}/>
            <p>We'll put them next to Begich.</p>
            <br/>
            <p>Only ranking a single candidate is called Bullet Voting.</p>
            <p>Bullet voting is not an effective strategy under RCV, but some voters genuinely only like one candidate, and that's okay.</p>
        </>,
        voterMovements: [new VoterMovement(12, 'home', 'centerBullet')]
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>There were also 16 voters who ranked Begich first, and Peltola second, as well as 29 voters who ranked Begich first and Palin second.</p>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <img src={require("../assets/begichThenPeltola.png")} style={{width: '40%'}}/>
                <img src={require("../assets/begichThenPalin.png")} style={{width: '40%'}}/>
            </div>
            <p>We'll put them close to Begich, but also leaning toward their second choice.</p>
        </>,
        voterMovements: [
            new VoterMovement(16, 'home', 'centerThenLeft'),
            new VoterMovement(29, 'home', 'centerThenRight'),
        ],
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>And then we'll distribute the rest of the votes accordingly.</p>,
        voterMovements: [
            new VoterMovement(36, 'home', 'rightThenCenter'),
            new VoterMovement(23, 'home', 'rightBullet'),
            new VoterMovement(4, 'home', 'rightThenLeft'),
            new VoterMovement(5, 'home', 'leftThenRight'),
            new VoterMovement(25, 'home', 'leftBullet'),
            new VoterMovement(50, 'home', 'leftThenCenter'),
        ],
    }),
    // counting votes
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>For the first round of RCV, we count the first choice votes for each candidate.</p>
            <p>Begich has the least 1st choice votes, so he gets eliminated.</p>
        </>,
        runoffStage: 'firstRound',
    }),
    // Majority Winner
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Then the Begich voters were transferred to their second choice.</p>,
        </>,
        runoffStage: 'right_vs_left',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>The Begich voters that didn't list a second choice are exhausted, and they get removed.</p>,
        </>,
        runoffStage: 'right_vs_left',
        exhaustedCamp: 'centerBullet'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Then Peltola Wins! Congratulations to Peltola for running a great campaign. She won fair and square by the rules of RCV.</p>
            <br/>
            <p>But did Ranked Choice Voting do a good job here? Peltola would have won under either Choose One or RCV, and RCV was able to reveal more Peltola support from Republican voters, but was she truly the best winner for the Alaskan voters?</p>

            <p>This election exposed many of the common RCV misconceptions. Let's take a closer look...</p>
        </>,
        runoffStage: 'right_vs_left',
        exhaustedCamp: 'centerBullet'
    }),
    
    // Condorcet
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>❌ Misconception #1: "RCV elects the most preferred candidate"</h1>
            <p>Actually Peltola was not this election's most preferred candidate.</p>
            <br/>
            <p>The most preferred candidate is also known as the Condorcet Winner,
            and the Condorcet Winner is the candidate who beat any of the other candidates head-to-head.</p>
            <p>We know that Peltola beats Palin head-to-head but what about the other matchups?</p>
        </>,
        runoffStage: 'right_vs_left',
        exhaustedCamp: 'centerBullet'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Begich beats Peltola head-to-head.</p>
        </>,
        runoffStage: 'center_vs_left',
        exhaustedCamp: 'rightBullet'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>And Begich beats Palin head-to-head.</p>
        </>,
        runoffStage: 'center_vs_right',
        exhaustedCamp: 'leftBullet'
    }),
    new SimTransition({
        visible: [Candidate, 'center_beats_right', 'center_beats_left', 'left_beats_right'],
        focused: ['centerCandidate', 'center_beats_right', 'center_beats_left'],
        explainer: <>,
            <p>So Begich is the actual Condorcet Winner!</p>
        </>,
        runoffStage: 'center_vs_right',
    }),
    new SimTransition({
        visible: [Candidate, 'center_beats_right', 'center_beats_left', 'left_beats_right'],
        focused: ['rightCandidate', 'center_beats_right', 'left_beats_right'],
        explainer: <>
            <p>Additionally, Palin lost all her head-to-head matchups.
            That makes her the Condorcet Loser for this election. She never really had a chance to win this election.</p>
        </>,
        runoffStage: 'firstRound',
    }),
    // spoiler effect
    new SimTransition({
        visible: [],
        explainer: <>
            <h1>❌ Misconception #2: "RCV solves the Spoiler Effect"</h1>
            <p>Once you have more than two competitive candidates, RCV DOES allow for the Spoiler Effect.</p>
            <br/>
            <i>But what is the Spoiler Effect?</i>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: ['spoiler_2000'],
        explainer: <>
            <p>Well the most famous example happened in the 2000 US presidential election.</p>
            <p>Gore likely would have been the Majority Winner if he faced Bush head-to-head.</p>
        </>,
        runoffStage: 'center_vs_left',
        exhaustedCamp: 'rightBullet',
        videoStopTime: 3
    }),
    new SimTransition({
        visible: ['spoiler_2000'],
        explainer: <>
            <p>But adding Nader to the race took votes from Gore and as a result the win went to Bush.</p>
            <p>So the spoiler effect is not a partisan issue, it can hurt either party. In 2000 it hurt the Democrats, but in Alaska it hurt the Republicans.</p>
            <p>In the 2000 race, Nader was the spoiler candidate because he had no chance of winning but still impacted the results.</p>
        </>,
        runoffStage: 'center_vs_left',
        exhaustedCamp: 'rightBullet'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>In Alaska we see that if the election was just Peltola and Begich, then Begich would have won.</p>,
        runoffStage: 'center_vs_left',
        exhaustedCamp: 'rightBullet'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>But once we add Palin back to the race she pulls voters away from Begich.</p>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Then Begich gets eliminated in the first round and Peltola wins!</p>
            <p>Therefore Palin was the spoiler candidate in this election. She would have lost regardless, but her presence in the race was still enough to spoil the election and change the result.</p>
        </>,
        runoffStage: 'right_vs_left',
        exhaustedCamp: 'centerBullet'
    }),
    
    // majority
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>❌ Misconception #3: "RCV guarantees a Majority Winner"</h1>
            <p>Peltola clearly did not have a true majority because
                a majority of 200 would require more than 100 votes, and none of the candidates reached that.</p>
            <br/>
            <i>But then why did outlets report a majority for Peltola?</i>
            <img src={require("../assets/cnnResults.png")} style={{width: '90%'}}/>
            <p><a target="_blank" href="https://www.cnn.com/election/2022/results/alaska/special-election/us-house-district-1-final">CNN Results</a></p>
        </>,
        runoffStage: 'right_vs_left',
        exhaustedCamp: 'centerBullet'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        focused: ['centerBullet', 'centerCandidate'],
        explainer: <>
            <p>The outlets reported this as a majority because the 12 bullet votes for Begich
                weren't able to transfer and weren't counted in the final round.</p>
            <p>So they reported that Peltola had 96/188 = 51% , but she actually had 96/200 = 45%.</p>
            <p>The majority is an illusion! In reality, it's impossible for any voting method to guarantee a true Majority Winner because a Majority Winner doesn't always exist.</p>
        </>,
        runoffStage: 'right_vs_left',
        exhaustedCamp: 'centerBullet'
    }),

    
    // monotonicity
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>❌ Misconception #4: "It's safe to rank your favorite candidate first"</h1>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        focused: ['rightThenCenter'],
        explainer: <>
            <p>This election was particularly rough for the "Palin 1st, Begich 2nd" voters because supporting Palin gave them their worst choice, and their vote never transferred to Begich.</p>
            <p>They may as well have been using Choose One Voting because RCV never counted their down ballot rankings.</p>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Let's say that some of the "Palin 1st, Begich 2nd" voters had realized that Begich was the more electable of the two Republicans. </p>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>
            If just a few of them had switched their first place ranking from Palin to Begich...
        </p>,
        runoffStage: 'firstRound',
        voterMovements: [
            new VoterMovement(4, 'rightThenCenter', 'centerThenRight')
        ]
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Then Begich would have won and these voters would have been happier. </p>
            <p>Sounds familiar, right? Choose One voting makes us vote for the more electable lesser-of-two-evils type candidates to avoid our worst case scenario all the time.</p>
            <p>This is called a Lesser-Evil failure and despite claims to the contrary, RCV does not solve this problem either.</p>
        </>,
        runoffStage: 'center_vs_left',
        exhaustedCamp: 'rightBullet'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>
            But this election has an even stranger scenario where Peltola could have gained supporters and lost as a result.
        </p>,
        voterMovements: [
            new VoterMovement(4, 'centerThenRight', 'rightThenCenter')
        ],
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Let's pretend 7 of the Palin bullet voters chose to support Peltola instead.</p>
        </>,
        runoffStage: 'default',
        voterMovements: [
            new VoterMovement(7, 'rightBullet', 'leftBullet')
        ]
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>The reduced support causes Palin to lose in the first round.</p>
        </>,
        runoffStage: 'firstRound'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>And then Peltola loses in the final round!</p>
            <br/>
            <p>This is known as a Monotonicity Pathology.</p>
            <p>A Monotonicity Pathology is when increasing support for a winning candidate can cause them to lose or if decreasing support for a losing candidate causes them to win, and RCV is one of the only single-winner voting methods to have this problem.</p>
        </>,
        runoffStage: 'center_vs_left',
        exhaustedCamp: 'rightBullet'

    }),
    new SimTransition({
        visible: [],
        explainer: <>
            <h1>❌ Misconception #5: "Alaska was a very rare edge case"</h1>
        </>,
        voterMovements: [],
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: ['all_elections_1'],
        explainer: <p>
            Yes and No. There have been over 500 RCV elections in the US, and we have data for 463 of them. We can look at the failure rates to see how rare Alaska was.
        </p>,
        videoStopTime: 2.3,
    }),
    new SimTransition({
        visible: ['all_elections_1'],
        explainer: <p>
            A third of them had at least one of the failures we discussed.
        </p>,
        videoStopTime: 4.7
    }),
    new SimTransition({
        visible: ['all_elections_1'],
        explainer: <p>
            However most of them only had Majority Failures, if we just look at Condorcet, Monotonicity, and Lesser-Evil Failures then there are only 11 left.
        </p>,
        videoStopTime: 5.7
    }),
    new SimTransition({
        visible: ['all_elections_1'],
        explainer: <>
            <p>And this goes down to 3 if we only look at Condorcet Failures.</p>
            <i>So is a 0.6% failure rate really so bad?</i>
        </>,
        videoStopTime: 6.9
    }),
    new SimTransition({
        visible: ['parties'],
        explainer: <p>
            Let's reframe that a bit. The US has been trapped in a 2 party system for so long that it's quite rare to have races with a competitive 3rd candidate.
        </p>,
        videoStopTime: 3.5
    }),
    new SimTransition({
        visible: ['parties'],
        explainer: <>
            <p>What we really want is a system where many parties can exist together without fear of vote splitting.</p>
        </>
    }),
    new SimTransition({
        visible: ['all_elections_2'],
        explainer: <>
            <p>We've seen that RCV has a low failure rate under the status quo, but does it perform well in scenarios with many competitive candidates?</p>
        </>,
        videoStopTime: 0.2
    }),
    new SimTransition({
        visible: ['all_elections_2'],
        explainer: <>
            <p>To help answer this, let's remove the elections that only had 2 candidates.</p>
        </>,
        videoStopTime: 1.0
    }),
    new SimTransition({
        visible: ['all_elections_2'],
        explainer: <>
            <p>...and also the elections where the 3rd candidate was too small to be threatening.</p>
            <p>Now our failure rate has gone up to 3 out of 89, or 3.4%.
                That's starting to get a little concerning but this is still a very small sample size.</p>
        </>
    }),
    new SimTransition({
        visible: ['australia'],
        explainer: <>
            <p>For a bigger sample size, let's look at Australia. Their house of representatives have been using RCV for over 100 years, 
                and their overall Condorcet Failure rate could range from <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4763372">1%</a> up to <a href="https://www.youtube.com/watch?v=wQs0k0P1LYU&t=1346s">7%</a>!</p>
        </>
    }),
    new SimTransition({
        visible: ['australia_house'],
        explainer: <>
            <p>And despite all of that time, the Australian house is still stuck in a 2 party dominated system. By contrast the Australian Senate uses a different method, <a href="https://en.wikipedia.org/wiki/Single_transferable_vote">Single Transferable Vote</a>, and they have more 3rd party representation as a result.</p>
            <p>These failure rates are extra devastating when you consider the damage that each of these causes.</p>
        </>
    }),
    new SimTransition({
        visible: ['usa_1'],
        explainer: <>
            <h1>❌ The Consequences</h1>
            <p>After the failure in Alaska, do you think Republicans will ever feel safe running multiple candidates again? Or even voting honestly?</p>
        </>,
        voterMovements: [],
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: ['usa_2'],
        explainer: <>
            <p>The election inaccuracies and general voter confusion have
                caused many RCV repeals including 3 jurisdictions that experienced Monotonicity Pathologies or Lesser-Evil Failures (Burlington, VT (later-reinstated); Pierce, WA; and Moab, UT).
            </p>
        </>,
        // reset so we can scrollback properly
        voterMovements: [
            new VoterMovement(7, 'leftBullet', 'rightBullet')
        ]
    }),
    new SimTransition({
        visible: ['usa_3'],
        explainer: <>
            <p>Many states have been considering legislation to limit RCV, and 10 have gone so far as to ban it entirely. The number of bans is growing rapidly
                but <a href="https://ballotpedia.org/Ranked-choice_voting_(RCV)">the latest numbers are available on ballotpedia</a>.
            </p>
            <p>You can browse some of these failures and repeals in the tool below.</p>
        </>,
        voterMovements: [new VoterMovement([0, 12, 29, 36, 23, 4, 5, 25, 50, 16])] // reset to handle cases where you scroll back from the election selector
    }),
    new SimTransition({
        visible: [],
        electionName: 'burlington-2009', // presetting burlington so it's ready at the next step
        explainer: <>
            <p>RCV has the most investment, but when it fails, it hurts the movement as a whole. This time it hurt Republicans in Alaska but it could just as easily hurt Democrats in a
                blue state like Oregon if two Democrats ran against one Republican.</p>
            <p>RCV improves on Choose One in some ways (a more expressive ballot, the option to eliminate the primary, etc), however in competitive elections we still see the same spoiler
                issues as Choose One. For this election both RCV and Choose One would have elected Peltola as a result of the spoiler effect.</p>
            <p>Instead we should look closer at alternatives such as STAR Voting, Approval Voting, and Ranked Robin.</p>
        </>,
    }),
    new SimTransition({
        visible: ['star_ballot'],
        explainer: <p>
            STAR Voting lets you score candidates from 0 to 5, and it's the best option we have for voter expression and accuracy.
        </p>,
    }),
    new SimTransition({
        visible: ['approval_ballot'],
        explainer: <p>
            Approval Voting lets you pick as many candidates as you like, and it's the best option for simplicity.
        </p>,
    }),
    new SimTransition({
        visible: ['ranked_ballot'],
        explainer: <p>
            And you don't even need to ditch the ranked ballot. There are ranked methods, such as Ranked Robin, that have a far simpler and more accurate way to tally rankings.
        </p>,
    }),
    new SimTransition({
        visible: [],
        explainer: <>
            <p>In summary, here are the points to remember.</p>
            <ol>
                <li>RCV does NOT guarantee a Condorcet Winner</li>
                <li>RCV does NOT solve the Spoiler Effect</li>
                <li>RCV does NOT guarantee a Majority Winner</li>
                <li>RCV does NOT make it safe to rank your favorite first</li>
                <li>RCV failures will become much more common as our elections become more competitive</li>
            </ol>
            <p>We need to start considering other voting methods, but before we can do that, we need to stop overselling the claims of RCV.</p>
        </>,
    }),
    new SimTransition({
        visible: [],
        explainer: <>
            <p>This article was created by Arend Peter Castelein, with the help & feedback of the Equal Vote community.</p>
            <br/>
            <p>Pencil animations were created by Annie Kallen.</p>
            <br/>
            <p>The content was based on a <a target="_blank" href="https://arxiv.org/pdf/2209.04764.pdf">paper by Adam Graham-Squire and David McCune</a> (It's only 5 pages long, definitely worth a read! ).</p>
            <br/>
            <p>Here's <a target="_blank" href="https://arxiv.org/pdf/2303.00108.pdf">another paper by Jeanne N. Clelland simulating the Alaska election with other voting methods</a>.</p>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [VideoEmbed],
        explainer: <>
            <p>Click the videos to learn more about STAR and Approval Voting!</p>
        </>,
        runoffStage: 'firstRound',
    }),
];