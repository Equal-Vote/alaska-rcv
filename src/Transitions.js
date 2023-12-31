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
            explainer: <p>For decades, we've been cursed with a voting method where it's not safe to pick your favorite</p>,
        }),
        new SimTransition({
            visible: ['alaska'],
            explainer: <>
                <p>
                    But in 2020, Alaska made a change and adopted Ranked Choice Voting with an open integrated primary
                <br/>
                    Let's see how the first election went in August 2022
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
            </>
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
                <img src="/alaska-rcv/images/begichBullet.png" style={{width: '75%'}}/>
                <p>We'll put them next to Begich.</p>
                <br/>
                <p>Only ranking a single candidate is called Bullet Voting</p>
                <p>Bullet Voting is a poor strategy under RCV, but some voters genuinely only like one candidate, and that’s okay</p>
            </>,
            voterMovements: [new VoterMovement(12, 'home', 'centerBullet')]
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>There were also 16 voters who ranked Begich first, and Peltola second, as well as 29 voters who ranked Begich first and Palin second</p>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <img src="/alaska-rcv/images/begichThenPeltola.png" style={{width: '40%'}}/>
                    <img src="/alaska-rcv/images/begichThenPalin.png" style={{width: '40%'}}/>
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
                <p>Then the Begich voters were transferred to their second choice, the vote was recounted, and Peltola won!</p>,
                <br/>
                <p>But did RCV pick the best winner?</p>
                <p>This election exposed many of RCV's false claims. Let's take a closer look...</p>
            </>,
            runoffStage: 'right_vs_left',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <h1>Claim #1: "RCV guarantees a majority winner"</h1>
                <p>This clearly wasn't true because a majority of 200 would require more than 100 votes and none of the candidates reached that.</p>
                <br/>
                <i>But then why did outlets report a majority for Peltola?</i>
                <img src="/alaska-rcv/images/cnnResults.png" style={{width: '90%'}}/>
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
        // Condorcet
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <h1>Claim #2: “RCV Virtually Guarantees a Condorcet Winner”</h1>
                <p>Wrong again, Peltola wasn't the Condorcet winner in this election!</p>
                <br/>
                <i>But what's a Condorcet winner?</i>
                <p>That's the candidate who can beat any of the other candidates head-to-head</p>
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
                <h1>Claim #3: "RCV solves the spoiler effect"</h1>
                <p>Nope! Once you have more than two competitive candidates, RCV often allows the spoiler effect.</p>
                <br/>
                <i>But what is the spoiler effect?</i>
                <p>This is when adding a losing candidate to the race causes the winner to change by splitting off votes from the majority</p>
                <p>Most famously under Choose One Voting, removing Nader from the 2000 presidential election likely would have caused the winner to change from Bush to Gore</p>
            </>,
            runoffStage: 'center_vs_right',
        }),
        // center squeeze
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>Here we see that removing Palin would cause the winner to change from Peltola to Begich</p>
                <p>Hence Palin was actually the spoiler candidate in this election</p>
                <br/>
                <p>The spoiler effect often causes the consensus candidate to lose and it's a main driver of polarization</p>
                <p>If there are only two candidates then the consensus candidate who best represents the will of the people will win.</p>
                <img src="/alaska-rcv/images/centerSqueeze1.png" style={{width: '50%', margin: 'auto'}}/>
            </>,
            runoffStage: 'center_vs_left',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <p>But if you add more candidates, the candidates in the middle ideologically have to compete with candidates on both sides of them for votes,
                (or in the case of RCV, 1st choice votes) while more polarizing candidates only have to defend from one side or the other.</p>
                <img src="/alaska-rcv/images/centerSqueeze2.png" style={{width: '50%', margin: 'auto'}}/>
                <p>Just like with Choose-One voting, voters in RCV aren't able to show that they would prefer either of the candidates
                they like over the opposition so majority factions can end up divided and conquered.</p>
                <p>For this election, Begich was the consensus candidate for these voters, and Palin and Peltola were pulling votes from either side</p>
            </>,
            runoffStage: 'firstRound',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            focused: ['leftThenRight', 'rightThenLeft'],
            explainer: <>
                <p>We know this because very few Palin voters gave Peltola their second rank, and vice versa</p>
            </>,
            runoffStage: 'firstRound',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            focused: ['leftThenCenter', 'rightThenCenter'],
            explainer: <>
                <p>And we can tell Begich was the consensus candidate because the majority of Peltola and Palin voters gave Begich their second rank, and because Begich was the Condorcet winner</p>
            </>,
            runoffStage: 'firstRound',
        }),
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            focused: ['rightThenCenter'],
            explainer: <>
                <p>This election was particularly rough for the "Palin 1st, Begich 2nd" voters because supporting Palin gave them their worst choice, and their vote never transferred to Begich</p>
                <p>They may as well have been using Choose One Voting because RCV never counted their down ballot rankings</p>
                <p>Which leads us to the next claim…</p>
            </>,
            runoffStage: 'firstRound',
        }),
        // monotonicity
        new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <>
                <h1>Claim #4: "It's safe to rank your favorite candidate first"</h1>
                <p>Wrong again! Let’s say that some of the "Palin 1st, Begich 2nd" voters had realized that Begich was the more electable of the two Republicans. </p>
			</>,
            runoffStage: 'firstRound',
		}),
		new SimTransition({
            visible: [Candidate, Voter, VoterCamp, Pie],
            explainer: <p>
                If just a few of them had strategically ranked him first
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
                <h1>Claim #5: "Alaska was a very rare edge case"</h1>
            </>,
            voterMovements: [],
            runoffStage: 'default',
        }),
        new SimTransition({
            visible: ['usFailures'],
            explainer: <>
                <p>Yes and No. It's true that out of the 500+ RCV elections in the US, we've only seen about a handful of monotonicity and compromise failures</p>
                <p>However this is a biased sample. RCV operates well when there's only 2 competitive candidates and the US is largely still a 2 party system.</p>
                <p>So most of our elections don't have a competitive 3rd candidate</p>
            </>,
        }),
        new SimTransition({
            visible: ['usFailures', 'expectedFailures'],
            explainer: <>
                <p>Research simulating RCV elections finds that competitive elections will have monotonicity failures at least 15% of the time (or possibly as high as 50%)  <a href="https://www.researchgate.net/publication/258164743_Frequency_of_monotonicity_failure_under_Instant_Runoff_Voting_Estimates_based_on_a_spatial_model_of_elections">link</a></p>
                <p>and this is pretty devastating when you consider the damage that each of these failures cause</p>
            </>,
        }),
        new SimTransition({
            visible: [],
            explainer: <>
                <p>After the failure in Alaska, do you think Republicans will ever feel safe running multiple candidates again? Or even voting honestly?</p>
                <p>On top of that, the failure in Alaska caused a state-wide repeal attempt in North Dakota against both RCV and Approval Voting, a simpler voting method that lacks the issues we’ve seen in RCV</p>
                <img src="/alaska-rcv/images/fargoQuote.png" style={{width:'70%'}}/>
                <p><a target="_blank" href="https://bismarcktribune.com/news/state-and-regional/govt-and-politics/north-dakota-lawmakers-ban-approval-voting-system-used-in-fargo/article_7f463c8e-cf47-11ed-86f6-974992b1a2bf.html">link</a></p>
                <p>The bill was eventually vetoed, but that veto was VERY close to being overturned</p>
                <p>But other juristictions weren't so lucky. The election inaccuracies, and general voter confusion have
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
                <p>RCV needs to stop overselling it's claims and we need to start considering other voting methods</p>
                <p>Here's a list of all the claims we've discussed. All are either false or misleading</p>
                <ol>
                    <li>RCV guarantees a majority winner - FALSE</li>
                    <li>RCV virtually guarantees a condorcet winner - FALSE</li>
                    <li>RCV solves the spoiler effect - FALSE</li>
                    <li>It's safe to rank your first choice - FALSE</li>
                    <li>Alaska is a rare situation - ONLY INSIDE THE TWO PARTY SYSTEM THAT WE’RE TRYING TO TRANSCEND</li>
                </ol>
                <p>RCV has the most investment, but when it fails, it hurts the movement as a whole</p>
                <p>Instead we should look closer to alternatives such as Approval Voting or STAR Voting. We don’t even have to ditch the ranked ballot because there are proposals like Ranked Robin that have a far simpler and more accurate way to tally rankings.</p> 
            </>,
        }),
		new SimTransition({
            visible: [],
            electionName: 'burlington-2009', // keeping burlington for the fade animation
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