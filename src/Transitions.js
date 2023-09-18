import { SimTransition } from './SimTransition';
import { VoterMovement } from './VoterMovement';
import Candidate from './components/Candidate';
import Voter from './components/Voter';
import VoterCamp from './components/VoterCamp';
import Pie from './components/Pie';

export const transitions = [
    // start
    new SimTransition({
        explainer: <div style={{height: '40vh'}}/>
    }),
    // intro
    new SimTransition({
        visible: ['choose_one'],
        explainer: <h1>For decades, we've been cursed with a voting method where it's not safe to pick your favorite</h1>,
    }),
    new SimTransition({
        visible: ['alaska'],
        explainer: <>
            <h1>But in 2022, Alaska made a change and adopted Ranked Choice Voting</h1>
            <h1>Let's see how the first election went</h1>
        </>,
    }),
    new SimTransition({
        visible: [Candidate],
        explainer: <><h1>RCV was supposed to allow more candidates to run</h1><h1>so we had Begich (R), Palin (R), and Peltola (D) all competing for the seat</h1></>,
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp],
        explainer: <h1>We'll simplify the voters and pretend there were only 200 of them</h1>,
        voterMovements: [new VoterMovement(200, undefined, 'home')]
    }),
    // moving voters
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>12 voters ranked begich first without ranking other candidates</h1>
            <img src="/images/begichBullet.png" style={{width: '75%'}}/>
            <h2>We'll put them next to Begich</h2>
            <br/>
            <h2>Only ranking a single candidate is called Bullet Voting</h2>
            <h2>Bullet Voting is a poor strategy under RCV, but it's still fairly common</h2>
            <p>more on that later...</p>
        </>,
        voterMovements: [new VoterMovement(12, 'home', 'begich_bullet')]
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>There were also 16 begich voters that ranked Peltola second, and 29 that ranked Palin second</h1>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <img src="/images/begichThenPeltola.png" style={{width: '40%'}}/>
                <img src="/images/begichThenPalin.png" style={{width: '40%'}}/>
            </div>
            <h2>We'll put them close to Begich, but also leaning toward their second choice</h2>
        </>,
        voterMovements: [
            new VoterMovement(16, 'home', 'begich_then_peltola'),
            new VoterMovement(29, 'home', 'begich_then_palin'),
        ],
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <h1>And then we'll distribute the rest of the votes accordingly</h1>,
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
            <h1>For the first round of RCV, we count the first choice votes for each candidate</h1>
            <h2>Begich has the least 1st choice votes, so he get's elimiated</h2>
        </>,
        runoffStage: 'firstRound',
    }),
    // Majority Winner
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>Then the begich voters were transferred to their second choice, the vote was recounted, and Peltola won!</h1>,
            <br/>
            <h2>But did RCV pick the best winner?</h2>
            <h2>This election exposed many of RCV's false claims. Let's take a closer look...</h2>
            <br/>
            <h1>Claim #1</h1>
            <h1>"RCV guarantees a majority winner"</h1>
            <h2>This clearly wasn't true because neither candidate reached 100 votes</h2>
            <br/>
            <h2>But then why did outlets report a majority for peltola?</h2>
            <img src="/images/cnnResults.png" style={{width: '90%'}}/>
            <p><a href="https://www.cnn.com/election/2022/results/alaska/special-election/us-house-district-1-final">link</a></p>
        </>,
        runoffStage: 'palinVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        focused: ['begich_bullet', 'begich'],
        explainer: <>
            <h2>This was only possible by hiding the 12 begich bullet votes</h2>
            <h2>The majority is an illusion! In reality it's impossible for a voting method to guarantee a majority</h2>
        </>,
        runoffStage: 'palinVsPeltola',
    }),
    // Condorcet
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>Claim #2</h1>
            <h1>"RCV virtually guarantees a condorcet winner"</h1>
            <h2>Wrong again, Peltola wasn't the condorcet winner in this election!</h2>
            <br/>
            <h2>But what's a condorcet winner?</h2>
            <h2>That's candidate who can beat any of the other candidates head-to-head</h2>
            <h2>We know that Peltola beats Palin head-to-head but what about the other matchups?</h2>
        </>,
        runoffStage: 'palinVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>Begich beat's Peltola head-to-head</h1>
        </>,
        runoffStage: 'begichVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>And Begich beat's Palin head-to-head</h1>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    new SimTransition({
        visible: [Candidate, 'begich_beats_palin', 'begich_beats_peltola', 'peltola_beats_palin'],
        focused: ['begich', 'begich_beats_palin', 'begich_beats_peltola'],
        explainer: <>,
            <h1>So Begich is the actual condorcet winner!</h1>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    new SimTransition({
        visible: [Candidate, 'begich_beats_palin', 'begich_beats_peltola', 'peltola_beats_palin'],
        focused: ['palin', 'begich_beats_palin', 'peltola_beats_palin'],
        explainer: <>
            <h1>Additionally, Palin lost all her head-to-head matchups</h1>
            <h2>That makes her the Condorcet Loser for this election</h2>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    new SimTransition({
        visible: [Candidate, 'begich_beats_palin', 'begich_beats_peltola', 'peltola_beats_palin'],
        focused: ['palin', 'begich_beats_palin', 'peltola_beats_palin'],
        explainer: <>
            <h1>Additionally, Palin lost all her head-to-head matchups</h1>
            <h2>That makes her the Condorcet Loser for this election</h2>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    // spoiler effect
    new SimTransition({
        visible: [Candidate, 'begich_beats_palin', 'begich_beats_peltola', 'peltola_beats_palin'],
        explainer: <>
            <h1>Claim #3</h1>
            <h1>RCV solves the spoiler effect</h1>
            <h2>Nope! RCV solves the spoiler effect for some cases, but the spoiler effect can still occur when once you have 3+ competitive candidates</h2>
            <br/>
            <h2>But what is the spoiler effect? This is when removing a losing candidate causes the winner to change</h2>
            <h2>Most famously under choose-one voting, removing Nader from 2000 presidential election would have caused the winner to change from Bush to Gore</h2>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    // center squeeze
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>Here we see that removing Palin would cause the winner to change from Peltola to Begich</h1>
            <h2>Hence Palin was actually the spoiler candidate in this election</h2>
            <br/>
            <h1>In this case the spoiler effect happened because of Center Squeeze</h1>
            <h2>With 2 candidates, the concensus candidate closer to the center of popular opinion will always win</h2>
            <img src="/images/centerSqueeze1.png" style={{width: '50%', margin: 'auto'}}/>
            <h2>But if you add more candidates, it could reduce the 1st choice rankings for the center candidate and cause them to be elimiated early</h2>
            <img src="/images/centerSqueeze2.png" style={{width: '50%', margin: 'auto'}}/>
            <h2>So Center Squeeze happens when first choice votes go to more extreme candidates, and cause the concensus candidate to lose</h2>
        </>,
        runoffStage: 'begichVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        focused: ['peltola_then_palin', 'palin_then_peltola'],
        explainer: <>
            <h2>In this case Palin and Peltola were the extreme candidates</h2>
            <h2>We can tell because very few Palin voters gave Peltola their second rank, and vice versa</h2>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        focused: ['peltola_then_begich', 'palin_then_begich'],
        explainer: <>
            <h2>And we can tell Begich was the consensus candidate because the majority of Peltola and Palin voters gave Begich their second rank</h2>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        focused: ['palin_then_begich'],
        explainer: <>
            <h2>This election was particularly rough for the "Palin then Begich" voters because supporing Palin gave them their worst choice, and their vote never transferred to Begich</h2>
            <h2>They may as well have been using choose-one voting because RCV never counted their down ballot rankings</h2>
            <h2>Which leads us to the next claim...</h2>
        </>,
        runoffStage: 'firstRound',
    }),
    // monotonicity
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>Claim #4</h1>
            <h1>"It's safe to rank your favorite candidate first"</h1>
            <h2>Not only would it have beter for Palin supporters to support Begich, even staying home would have given them a better outcome</h2>
        </>,
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h2>Let's take 7 of the "Palin then Begich" voters and pretend they stayed home</h2>
        </>,
        voterMovements: [new VoterMovement(7, 'palin_then_begich', 'home')],
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h2>After counting the votes we see that Palin gets eliminated first instead of Begich</h2>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h2>Then after that Begich wins in the runoff</h2>
            <h2>Thus these voters could have created a better result from them selves by not showing up, that's called the No Show Paradox</h2>
        </>,
        runoffStage: 'begichVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h2>Let's reset</h2>
            <h2>This election has a similar paradox, where Peltola could gain more suppoers and then lose the election as a result</h2>
        </>,
        voterMovements: [new VoterMovement(7, 'home', 'palin_then_begich')],
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h2>We'll pretend that 7 of the Palin bullet voters chose to support Peltola instead</h2>
        </>,
        voterMovements: [new VoterMovement(7, 'palin_bullet', 'peltola_bullet')],
        runoffStage: 'default',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h2>The reduced support causes Palin to lose in the first round</h2>
        </>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h2>And then Peltola loses in the final round!</h2>
            <br/>
            <h2>This is known as a Monotonicity Paradox</h2>
            <h2>Monotonicity Paradoxes are when gaining support for a winning candidate can cause them to lose, and RCV is the only modern voting method that can have these problems</h2>
        </>,
        runoffStage: 'begichVsPeltola',
    }),
    new SimTransition({
        visible: [],
        explainer: <>
            <h1>Claim #5</h1>
            <h1>"Alaska was very rare an edge case"</h1>
            <h2>Yes and No. It's true that out of the 500+ RCV elections in the US, we've only seen these failures 3 times</h2>
            <h2>However this is a biased sample. RCV operates well when there's only 2 competitive elections and the US is largely still a 2 party system most of our elections don't have a competitive 3rd candidate</h2>
        </>,
    }),
    new SimTransition({
        visible: ['us_failures'],
        explainer: <>
            <h2>Yes and No. It's true that out of the 500+ RCV elections in the US, we've only seen these failures 3 times</h2>
            <h2>However this is a biased sample. RCV operates well when there's only 2 competitive elections and the US is largely still a 2 party system most of our elections don't have a competitive 3rd candidate</h2>
        </>,
    }),
    new SimTransition({
        visible: ['us_failures', 'expected_failures'],
        explainer: <>
            <h2>Research imulating RCV elections finds that competitive elections will have failures 15% of the time</h2>
            <h2>and this is pretty devastating when you consider the damage that each of these failures does</h2>
        </>,
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        visible: [],
        explainer: <>
            <h2>After the failure in Alaska, do you think Republicans will ever feel safe running multiple candidates again?</h2>
            <h2>On top of that, the failure in Alaska caused a state-wide repeal campaign in North Dakota against</h2>
            <img src="fargoQuote.png"/>
            <p><a href="https://bismarcktribune.com/news/state-and-regional/govt-and-politics/north-dakota-lawmakers-ban-approval-voting-system-used-in-fargo/article_7f463c8e-cf47-11ed-86f6-974992b1a2bf.html">link</a></p>
            <p>The bill was eventually veto'd but it was VERY close</p>
            <h2>That would have banned Approval Voting as well. So here we see RCV failures impacting the progress of other voting methods as well</h2>
        </>,
        runoffStage: 'default',
    }),
    // end
    new SimTransition({
        explainer: <div style={{height: '40vh'}}/>
    }),
];

