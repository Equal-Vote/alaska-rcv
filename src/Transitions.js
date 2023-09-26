import { SimTransition } from './SimTransition';
import { VoterMovement } from './VoterMovement';
import Candidate from './components/Candidate';
import Voter from './components/Voter';
import VoterCamp from './components/VoterCamp';
import Pie from './components/Pie';

export const transitions = [
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
				But in 2022, Alaska made a change and adopted Ranked Choice Voting
			<br/>
				Let's see how the first election went
			</p>
        </>,
    }),
    new SimTransition({
        visible: [Candidate],
        explainer: <p>
		RCV claims to let more candidates run without fear of vote splitting. So this had 3 candidates
		<ul>
			<li>Nick Begich (R)</li>
			<li>Sarah Palin (R)</li>
			<li>Mary Peltola (D)</li>
		</ul>
		</p>
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
            <p>We'll put them next to Begich</p>
            <br/>
            <p>Only ranking a single candidate is called Bullet Voting</p>
            <p>Bullet Voting is a poor strategy under RCV, but it's still fairly common</p>
        </>,
        voterMovements: [new VoterMovement(12, 'home', 'begich_bullet')]
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
            new VoterMovement(16, 'home', 'begich_then_peltola'),
            new VoterMovement(29, 'home', 'begich_then_palin'),
        ],
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>And then we'll distribute the rest of the votes accordingly</p>,
        voterMovements: [
            new VoterMovement(36, 'home', 'palin_then_begich'),
            new VoterMovement(23, 'home', 'palin_bullet'),
            new VoterMovement(4, 'home', 'palin_then_peltola'),
            new VoterMovement(5, 'home', 'peltola_then_palin'),
            new VoterMovement(25, 'home', 'peltola_bullet'),
            new VoterMovement(50, 'home', 'peltola_then_begich'),
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
        runoffStage: 'palinVsPeltola',
    }),
	new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>Claim #1: "RCV guarantees a majority winner"</h1>
            <p>This clearly wasn't true because neither candidate reached 100 votes</p>
            <br/>
            <i>But then why did outlets report a majority for Peltola?</i>
            <img src="/alaska-rcv/images/cnnResults.png" style={{width: '90%'}}/>
            <p><a target="_blank" href="https://www.cnn.com/election/2022/results/alaska/special-election/us-house-district-1-final">link</a></p>
        </>,
        runoffStage: 'palinVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        focused: ['begich_bullet', 'begich'],
        explainer: <>
            <p>This was only possible by hiding the 12 Begich bullet votes from the denominator</p>
            <p>So the outlets reported Peltola had 96/188 = 51% , but she actually had 96/200 = 45%</p>
			<p>The majority is an illusion! In reality it's impossible for any voting method to guarantee a majority for all scenario</p>
        </>,
        runoffStage: 'palinVsPeltola',
    }),
    // Condorcet
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>Claim #2: “RCV Virtually Guarantees a Condorcet Winner”</h1>
            <p>Wrong again, Peltola wasn't the Condorcet winner in this election!</p>
            <br/>
            <i>But what's a Condorcet winner?</i>
            <p>That's candidate who can beat any of the other candidates head-to-head</p>
            <p>We know that Peltola beats Palin head-to-head but what about the other matchups?</p>
        </>,
        runoffStage: 'palinVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Begich beat's Peltola head-to-head</p>
        </>,
        runoffStage: 'begichVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>And Begich beat's Palin head-to-head</p>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    new SimTransition({
        visible: [Candidate, 'begich_beats_palin', 'begich_beats_peltola', 'peltola_beats_palin'],
        focused: ['begich', 'begich_beats_palin', 'begich_beats_peltola'],
        explainer: <>,
            <p>So Begich is the actual Condorcet winner!</p>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    new SimTransition({
        visible: [Candidate, 'begich_beats_palin', 'begich_beats_peltola', 'peltola_beats_palin'],
        focused: ['palin', 'begich_beats_palin', 'peltola_beats_palin'],
        explainer: <>
            <p>Additionally, Palin lost all her head-to-head matchups</p>
            <p>That makes her the Condorcet Loser for this election</p>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    // spoiler effect
    new SimTransition({
        visible: [Candidate, 'begich_beats_palin', 'begich_beats_peltola', 'peltola_beats_palin'],
        explainer: <>
            <h1>Claim #3: "RCV solves the spoiler effect"</h1>
            <p>Nope! Once you have more than two competitive candidates, RCV often allows the spoiler effect.</p>
            <br/>
            <i>But what is the spoiler effect?</i>
			<p>This is when removing a losing candidate causes the winner to change</p>
            <p>Most famously under choose-one voting, removing Nader from 2000 presidential election might have changed the winner to change from Bush to Gore (however it's impossible to know for sure)</p>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    // center squeeze
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Here we see that removing Palin would cause the winner to change from Peltola to Begich</p>
            <p>Hence Palin was actually the spoiler candidate in this election</p>
            <br/>
            <p>In this case the spoiler effect happened because of Center Squeeze</p>
            <p>With 2 candidates, the concensus candidate closer to the center of popular opinion will always win</p>
            <img src="/alaska-rcv/images/centerSqueeze1.png" style={{width: '50%', margin: 'auto'}}/>
        </>,
        runoffStage: 'begichVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>But if you add more candidates, it could reduce the 1st choice rankings for the concensus candidate and cause them to be eliminated early</p>
            <img src="/alaska-rcv/images/centerSqueeze2.png" style={{width: '50%', margin: 'auto'}}/>
            <p>So Center Squeeze happens when first choice votes go to candidates on either side of the spectrum, and cause the consensus candidate to lose</p>
			<p>For this election Begich was the consensus candidate for these voters, and Palin and Peltola were pulling votes from either side</p>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        focused: ['peltola_then_palin', 'palin_then_peltola'],
        explainer: <>
            <p>We know this because very few Palin voters gave Peltola their second rank, and vice versa</p>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        focused: ['peltola_then_begich', 'palin_then_begich'],
        explainer: <>
            <p>And we can tell Begich was the consensus candidate because the majority of Peltola and Palin voters gave Begich their second rank</p>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        focused: ['palin_then_begich'],
        explainer: <>
            <p>This election was particularly rough for the "Palin then Begich" voters because supporting Palin gave them their worst choice, and their vote never transferred to Begich</p>
            <p>They may as well have been using choose-one voting because RCV never counted their down ballot rankings</p>
            <p>Which leads us to the next claim...</p>
        </>,
        runoffStage: 'firstRound',
    }),
    // monotonicity
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>Claim #4: "It's safe to rank your favorite candidate first"</h1>
            <p>Not only would it have better for Palin voters to support Begich, even staying home would have given them a better outcome</p>
        </>,
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Let's take 7 of the "Palin then Begich" voters and pretend they stayed home</p>
        </>,
        voterMovements: [new VoterMovement(7, 'palin_then_begich', 'home')],
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>After counting the votes we see that Palin gets eliminated first instead of Begich</p>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Then after that Begich wins in the runoff</p>
            <p>Thus these voters could have created a better result from themselves by not showing up, that's called the No Show Paradox</p>
        </>,
        runoffStage: 'begichVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Let's reset</p>
            <p>This election has a similar paradox, where Peltola could gain more supporters and then lose the election as a result</p>
        </>,
        voterMovements: [new VoterMovement(7, 'home', 'palin_then_begich')],
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>We'll pretend that 7 of the Palin bullet voters chose to support Peltola instead</p>
        </>,
        voterMovements: [new VoterMovement(7, 'palin_bullet', 'peltola_bullet')],
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>The reduced support causes Palin to lose in the first round</p>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>And then Peltola loses in the final round!</p>
            <br/>
            <p>This is known as a Monotonicity Paradox</p>
            <p>Monotonicity Paradoxes are when gaining support for a winning candidate can cause them to lose, and RCV is the only modern voting method that can have these problems</p>
        </>,
        runoffStage: 'begichVsPeltola',
    }),
    new SimTransition({
        visible: [],
        explainer: <>
            <h1>Claim #5: "Alaska was a very rare edge case"</h1>
        </>,
        voterMovements: [new VoterMovement(7, 'peltola_bullet', 'palin_bullet')],
    }),
    new SimTransition({
        visible: ['us_failures'],
        explainer: <>
            <p>Yes and No. It's true that out of the 500+ RCV elections in the US, we've only seen these failures 4 times</p>
            <p>However this is a biased sample. RCV operates well when there's only 2 competitive elections and the US is largely still a 2 party system.</p>
            <p>So most of our elections don't have a competitive 3rd candidate</p>
        </>,
    }),
    new SimTransition({
        visible: ['us_failures', 'expected_failures'],
        explainer: <>
            <p>Research simulating RCV elections finds that competitive elections will have failures at least 15% of the time (or possibly as high as 50%) <a href="https://www.researchgate.net/publication/258164743_Frequency_of_monotonicity_failure_under_Instant_Runoff_Voting_Estimates_based_on_a_spatial_model_of_elections">link</a></p>
            <p>and this is pretty devastating when you consider the damage that each of these failures does</p>
        </>,
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        visible: [],
        explainer: <>
            <p>After the failure in Alaska, do you think Republicans will ever feel safe running multiple candidates again?</p>
            <p>On top of that, the failure in Alaska caused a state-wide repeal campaign in North Dakota against both RCV and Approval</p>
            <img src="/alaska-rcv/images/fargoQuote.png" style={{width:'70%'}}/>
            <p><a target="_blank" href="https://bismarcktribune.com/news/state-and-regional/govt-and-politics/north-dakota-lawmakers-ban-approval-voting-system-used-in-fargo/article_7f463c8e-cf47-11ed-86f6-974992b1a2bf.html">link</a></p>
            <p>The bill was eventually vetoed but it was VERY close</p>
            <p>So here we see RCV failures impacting the progress of other voting methods as well</p>
        </>,
        runoffStage: 'default',
    }),
    //new ElectionSelector({

    //}),
    //...(new ElectorSelector()).makeTransitions(),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Another example happened in Burlington Vermont in 2009</p>
            <p>In this case the failure lead to RCV being repealed a year later</p>
        </>,
        runoffStage: 'firstRound',
        electionName: 'burlington-2009',
        voterMovements: [
            // reset
            new VoterMovement(12, 'begich_bullet', 'home'),
            new VoterMovement(29, 'begich_then_palin', 'home'),
            new VoterMovement(36, 'palin_then_begich', 'home'),
            new VoterMovement(23, 'palin_bullet', 'home'),
            new VoterMovement(4, 'palin_then_peltola', 'home'),
            new VoterMovement(5, 'peltola_then_palin', 'home'),
            new VoterMovement(25, 'peltola_bullet', 'home'),
            new VoterMovement(50, 'peltola_then_begich', 'home'),
            new VoterMovement(16, 'begich_then_peltola', 'home'),
            // burlington
            new VoterMovement(10, 'home', 'begich_bullet'),
            new VoterMovement(18, 'home', 'begich_then_palin'),
            new VoterMovement(34, 'home', 'palin_then_begich'),
            new VoterMovement(29, 'home', 'palin_bullet'),
            new VoterMovement(11, 'home', 'palin_then_peltola'),
            new VoterMovement(9, 'home', 'peltola_then_palin'),
            new VoterMovement(13, 'home', 'peltola_bullet'),
            new VoterMovement(46, 'home', 'peltola_then_begich'),
            new VoterMovement(30, 'home', 'begich_then_peltola'),
        ],
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        electionName: 'burlington-2009',
        explainer: <>
            <p>RCV needs to stop overselling it's claims and we need to start considering other voting methods</p>
            <p>Here's a list of all the claims we've discussed. All are either false or misleading</p>
            <ol>
                <li>RCV guarantees a majority winner - FALSE</li>
                <li>RCV virtually guarantees a condorcet winner - FALSE</li>
                <li>RCV solves the spoiler effect - FALSE</li>
                <li>It's safe to rank your first choice - FALSE</li>
                <li>Alaska is a rare situation - NOT WHEN YOU LOOK AT THE BIG PICTURE</li>
            </ol>
            <p>RCV has the most investment, but when it fails it hurts the movement as a whole</p>
            <p>Instead we should look closer to alternatives such as Approval or STAR Voting</p> 
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [],
        electionName: 'burlington-2009', // keeping burlington for the fade animation
        explainer: <>
            <p>This animation was based on paper by Adam Graham-Squire and David McCune<a target="_blank" href="https://arxiv.org/pdf/2209.04764.pdf">link</a><br/>It's only 5 pages long, definitely worth a read!</p>
			<br/>
            <p>Here's another paper by Jeanne N. Clelland simulating the Alaska election with other voting methods <a target="_blank" href="https://arxiv.org/pdf/2303.00108.pdf">link</a></p>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: ['star_vs_rcv_embed'],
        explainer: <>
            <p>Click the video to learn more about STAR!</p>
        </>,
        runoffStage: 'firstRound',
    }),
    // end
    new SimTransition({
        explainer: <div className='explainerBottomPadding'/>
    }),
];