import { SimTransition } from './SimTransition';
import { VoterMovement } from './VoterMovement';
import Candidate from './components/Candidate';
import Voter from './components/Voter';
import VoterCamp from './components/VoterCamp';
import Pie from './components/Pie';
import electionSelectorTransitions from './components/ElectionSelectorTransitions';
import VideoEmbed from './components/VideoEmbed';

const transitions = (simState, setRefreshBool, refreshVoters) => {
    if(new URLSearchParams(window.location.search).get('onlySelector')) return [
        new SimTransition({
            explainer: <div className='explainerTopPadding'/>,
        }),
        ...electionSelectorTransitions(simState, setRefreshBool, refreshVoters),
        new SimTransition({
            explainer: <div className='explainerBottomPadding'/>
        }),
    ];

    return [
        // start
        new SimTransition({
            explainer: <div className='explainerTopPadding'/>
        }),
        // intro
        new SimTransition({
            visible: ['choose_one'],
            explainer: <p>For centuries, we've been cursed with a voting method where it's not safe to pick your favorite</p>,
        }),
        new SimTransition({
            visible: ['alaska'],
            explainer: <>
                <p>
                    But Alaska decided to change that, and in 2022 they ran their first election replacing the Choose One Voting system with Ranked Choice Voting 
                </p>
            </>,
        }),
        new SimTransition({
            visible: [Candidate],
            explainer: 
            <>
                <p>
                    RCV claims to let more candidates run without fear of vote splitting. So this election had 3 candidates
                </p>
                <ul>
                    <li>Nick Begich (R)</li>
                    <li>Sarah Palin (R)</li>
                    <li>Mary Peltola (D)</li>
                </ul>
            </>,
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp],
            explainer: <p>We'll simplify the voters and pretend there were only 200 of them</p>,
            voterMovements: [new VoterMovement(200, undefined, 'home')]
        }),
        // moving voters
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>12 voters ranked Begich first without ranking other candidates</p>
                <img src="/images/begichBullet.png" style={{width: '75%'}}/>
                <p>We'll put them next to Begich.</p>
                <br/>
                <p>Only ranking a single candidate is called Bullet Voting</p>
                <p>Bullet voting isn't an effective strategy under RCV, but some voters genuinely only like one candidate, and that’s okay</p>
            </>,
            voterMovements: [new VoterMovement(12, 'home', 'centerBullet')]
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>There were also 16 voters who ranked Begich first, and Peltola second, as well as 29 voters who ranked Begich first and Palin second</p>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <img src="/images/begichThenPeltola.png" style={{width: '40%'}}/>
                    <img src="/images/begichThenPalin.png" style={{width: '40%'}}/>
                </div>
                <p>We'll put them close to Begich, but also leaning toward their second choice</p>
            </>,
            voterMovements: [
                new VoterMovement(16, 'home', 'centerThenLeft'),
                new VoterMovement(29, 'home', 'centerThenRight'),
            ],
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <p>And then we'll distribute the rest of the votes accordingly</p>,
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
                <p>For the first round of RCV, we count the first choice votes for each candidate</p>
                <p>Begich has the least 1st choice votes, so he gets eliminated</p>
            </>,
            runoffStage: 'firstRound',
        }),
        // Majority Winner
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>Then the Begich voters were transferred to their second choice</p>,
            </>,
            runoffStage: 'right_vs_left',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>The Begich voters that didn't list a second choice are exhausted, and they get removed</p>,
            </>,
            runoffStage: 'right_vs_left',
            exhaustedCamp: 'centerBullet'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>Then Pelotla Wins! Congratulations to Peltola for running a great campaign. She won fair square by the rules of RCV.</p>
                <br/>
                <p>But did RCV pick the best winner?</p>
                <p>This election exposed many of the common RCV misconceptions. Let's take a closer look...</p>
            </>,
            runoffStage: 'right_vs_left',
        }),
        
        // Condorcet
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <h1>Misconception #1: "RCV elects the most preferred candidate"</h1>
                <p>Actually Peltola wasn't this most preferred candidate</p>
                <br/>
                <p>The most preferred candidate is also known as the Condorcet winner</p>
                <p>And the Condorcet winner is the candidate who beat any of the other candidates head-to-head</p>
                <p>We know that Peltola beats Palin head-to-head but what about the other matchups?</p>
            </>,
            runoffStage: 'right_vs_left',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>Begich beats Peltola head-to-head</p>
            </>,
            runoffStage: 'center_vs_left',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>And Begich beats Palin head-to-head</p>
            </>,
            runoffStage: 'center_vs_right',
        }),
        new SimTransition({
            visible: [Candidate, 'center_beats_right', 'center_beats_left', 'left_beats_right'],
            focused: ['centerCandidate', 'center_beats_right', 'center_beats_left'],
            explainer: <>,
                <p>So Begich is the actual Condorcet winner!</p>
            </>,
            runoffStage: 'center_vs_right',
        }),
        new SimTransition({
            visible: [Candidate, 'center_beats_right', 'center_beats_left', 'left_beats_right'],
            focused: ['rightCandidate', 'center_beats_right', 'left_beats_right'],
            explainer: <>
                <p>Additionally, Palin lost all her head-to-head matchups</p>
                <p>That makes her the Condorcet Loser for this election. She never really had a chance to win this election.</p>
            </>,
            runoffStage: 'center_vs_right',
        }),
        // spoiler effect
        new SimTransition({
            visible: [Candidate, 'center_beats_right', 'center_beats_left', 'left_beats_right'],
            explainer: <>
                <h1>Misconception #2: "RCV solves the spoiler effect"</h1>
                <p>Once you have more than two competitive candidates, RCV DOES allow for the spoiler effect.</p>
                <br/>
                <i>But what is the spoiler effect?</i>
                <p>Well the most famous example happened in the 2000 US presidential election</p>
                <p>Gore likey would have been the majority winner if he faced Bush head-to-head, but adding Nader to the race took votes from Gore and as a result the win went to Bush</p>
                <p>In that race Nader was the spoiler candidate because he had no chance of winning but he still impacted the results</p>
            </>,
            runoffStage: 'center_vs_right',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>Here we see that removing Palin would cause the winner to change from Peltola to Begich. Therefore Palin was the spoiler candidate in this election</p>
                <p>Palin would have lost regardless, but her presense in the race was still enough to spoil the election and change the result</p>
            </>,
            runoffStage: 'center_vs_left',
        }),
        
        // majority
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <h1>Misconception #3: "RCV guarantees a majority winner"</h1>
                <p>This clearly wasn't true because a majority of 200 would require more than 100 votes and none of the candidates reached that.</p>
                <br/>
                <i>But then why did outlets report a majority for Peltola?</i>
                <img src="/images/cnnResults.png" style={{width: '90%'}}/>
                <p><a target="_blank" href="https://www.cnn.com/election/2022/results/alaska/special-election/us-house-district-1-final">link</a></p>
            </>,
            runoffStage: 'right_vs_left',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            focused: ['centerBullet', 'centerCandidate'],
            explainer: <>
                <p>This was only possible by hiding the 12 Begich bullet votes from the count.</p>
                <p>So the outlet reported Peltola had 96/188 = 51% , but she actually had 96/200 = 45%</p>
                <p>The majority is an illusion! In reality, it's impossible for any voting method to guarantee a true majority winner because a majority winner doesn’t always exist</p>
            </>,
            runoffStage: 'right_vs_left',
        }),
        
        // monotonicity
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            focused: ['rightThenCenter'],
            explainer: <>
                <h1>Misconception #4: "It's safe to rank your favorite candidate first"</h1>
                <p>This election was particularly rough for the "Palin 1st, Begich 2nd" voters because supporting Palin gave them their worst choice, and their vote never transferred to Begich</p>
                <p>They may as well have been using Choose One Voting because RCV never counted their down ballot rankings</p>
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
                <p>This is called a compromise failure, and despite claims to the contrary, RCV doesn't solve the problem either.</p>
            </>,
            runoffStage: 'center_vs_left',
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
                <p>Let's pretend 7 of the Palin bullet voters chose to support Peltola instead</p>
            </>,
            runoffStage: 'default',
			voterMovements: [
				new VoterMovement(7, 'rightBullet', 'leftBullet')
			]
        }),
		new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>The reduced support causes Palin to lose in the first round</p>
            </>,
            runoffStage: 'firstRound'
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>And then Peltola loses in the final round!</p>
                <br/>
                <p>This is known as a Monotonicity Paradox</p>
                <p>Monotonicity Paradoxes are when increasing support for a winning candidate can cause them to lose or if decreasing support for a losing candidate causes them to win, and RCV is one of the only single-winner voting methods to have this problem</p>
            </>,
            runoffStage: 'center_vs_left',
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <h1>Misconception #5: "Alaska was a very rare edge case"</h1>
            </>,
            voterMovements: [],
            runoffStage: 'default',
        }),
        new SimTransition({
            visible: [],
            explainer: <p>
                Yes and No. There have been over 500 RCV elections in the US, and we have data for 448 of them, and half of them had at least one of the failures we discussed
            </p>
        }),
        new SimTransition({
            visible: [],
            explainer: <p>
                However most of them only had majority failures, if we just look at condorcet, monotonicity, and compromise failures then there are only 11 left
            </p>
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <p>And this goes down to 3 if we only look at condorcet failures</p>
                <i>So is a 0.6% failure rate really so bad?</i>
            </>
        }),
        new SimTransition({
            visible: [],
            explainer: <p>
                Let's reframe that a bit. The US has been trapped in a 2 party system for so long that it's quite rare to have races with a competitive 3rd candidate
            </p>
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <p>What we really want is a system where many parties can exist together without fear of vote splitting</p>
                <p>We've seen that RCV has a low failure rate under the status quo, but does it perform well in scenarios with many competitive candidates?</p>
            </>
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <p>To help answer this let's remove the elections that only had 2 candidates</p>
            </>
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <p>...and also the elections where the 3rd candidate was too small to be threatening</p>
                <p>Now our failure rate has gone up to 3 out of 88, or 3.5%, but this is still a very small sample size</p>
            </>
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <p>For a bigger sample size let's look at Australia. Their house of representatives have been using RCV for over 100 years, and their condorcet failure rate is close to 7%</p>
            </>
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <p>And despite all of that time they're still stuck in a 2 party dominated system</p>
                <p>These failure rates are extra devastating when you consider the damage that each of these causes</p>
            </>
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <h1>The Consequences</h1>
                <p>After the failure in Alaska, do you think Republicans will ever feel safe running multiple candidates again? Or even voting honestly?</p>
            </>,
            voterMovements: [],
            runoffStage: 'default',
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <p>The election inaccuracies, and general voter confusion have
                    caused many RCV repeals including 3 juristictions that experience monotonicity or compromise failures (Burlington, VT; Pierce, WA; and Moab, UT)</p>
                <p>We've even seen RCV complete banned in 5 states: Tennesee, Florida, Idaho, South Dakota, and Montana</p>
                <p>You can browse some of these failures and repeals in the tool below</p>
            </>,
        }),
        ...electionSelectorTransitions(simState, setRefreshBool, refreshVoters),
		new SimTransition({
            visible: [],
			electionName: 'burlington-2009', // presetting burlington so it's ready at the next step
            explainer: <>
                <p>RCV has the most investment, but when it fails, it hurts the movement as a whole. Instead we should look closer to alternatives such as STAR Voting, Approval Voting, and Ranked Robin</p>
                
            </>,
        }),
        new SimTransition({
            visible: [],
            explainer: <p>
                STAR Voting let's you score candidates from 0 to 5, and it's the best option we have for voter expression and accuracy
            </p>,
        }),
        new SimTransition({
            visible: [],
            explainer: <p>
                Approval Voting let's you pick as many candidates as they like, and it's the best option for simplicity
            </p>,
        }),
        new SimTransition({
            visible: [],
            explainer: <p>
                And you don't even need to ditch the ranked ballot. There are ranked methods, such as Ranked Robin, that have a far simpler and more accurate way to tally rankings
            </p>,
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <p>Here's a list of all the misconceptions we've discussed. All are either false or misleading</p>
                <ol>
                    <li>RCV guarantees a majority winner - FALSE</li>
                    <li>RCV virtually guarantees a condorcet winner - FALSE</li>
                    <li>RCV solves the spoiler effect - FALSE</li>
                    <li>It's safe to rank your first choice - FALSE</li>
                    <li>Alaska is a rare situation - ONLY INSIDE THE TWO PARTY SYSTEM THAT WE’RE TRYING TO TRANSCEND</li>
                </ol>
                <p>We need to start considering other voting methods, but before we can do that we need to stop overselling the claims of RCV</p>
            </>,
        }),
		new SimTransition({
            visible: [],
            explainer: <>
                <p>This animation was based on paper by Adam Graham-Squire and David McCune <a target="_blank" href="https://arxiv.org/pdf/2209.04764.pdf">link</a> (It's only 5 pages long, definitely worth a read! )</p>
                <br/>
                <p>Here's another paper by Jeanne N. Clelland simulating the Alaska election with other voting methods <a target="_blank" href="https://arxiv.org/pdf/2303.00108.pdf">link</a></p>
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
        // end
        new SimTransition({
            explainer: <div className='explainerBottomPadding'/>
        }),
    ];
}

export default transitions;