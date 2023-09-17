import { SimTransition } from './SimTransition';
import { VoterMovement } from './VoterMovement';
import Candidate from './components/Candidate';
import Voter from './components/Voter';
import VoterCamp from './components/VoterCamp';
import Pie from './components/Pie';

export const transitions = [
    new SimTransition({
        visible: ['choose_one'],
        explainer: <h1>For decades, we've been cursed with a voting method where it's not safe to pick your favorite</h1>,
    }),
    new SimTransition({
        visible: ['alaska'],
        explainer: <h1>But in 2022, Alaska made a change and adopted Ranked Choice Voting</h1>,
        explainerDelaySeconds: .5,
    }),
    new SimTransition({
        visible: ['alaska'],
        explainer: <h1>Let's see how the first election went</h1>,
        explainerDelaySeconds: .5,
    }),
    new SimTransition({
        visible: [Candidate],
        explainer: <><h1>RCV was supposed to allow more candidates to run</h1><h1>so we had Begich (R), Palin (R), and Peltola (D) all competing for the seat</h1></>,
        explainerDelaySeconds: .5,
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp],
        explainer: <h1>We'll simplify the voters and pretend there were only 200 of them</h1>,
    }),
    // moving voters
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>12 voters ranked begich first without ranking other candidates</h1>
            <img src="/images/begichBullet.png" style={{width: '75%'}}/>
            <h2>We'll put them next to Begich</h2>
        </>,
        voterMovements: [new VoterMovement(12, 'home', 'begich_bullet')]
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>Only ranking a single candidate is called Bullet Voting</h1>
            <h1>Bullet Voting is a poor strategy under RCV, but it's still fairly common</h1>
            <p>more on that later...</p>
        </>,
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
        explainer: <h1>For the first round of RCV, we count the first choice votes for each candidate</h1>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <h1>Begich has the least 1st choice votes, so he get's elimiated</h1>,
        runoffStage: 'firstRound',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <h1>Then the begich voters were transferred to their second choice, the vote was recounted, and Peltola won!</h1>,
        runoffStage: 'palinVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <><h1>But did RCV pick the best winner?</h1><h2> This election exposed many of RCV's false claims. Let's take a closer look...</h2></>,
        runoffStage: 'palinVsPeltola',
    }),
    // Majority Winner
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>Claim #1</h1>
            <h1>RCV guarantees a majority winner</h1>
            <h2>This clearly wasn't true because neither candidate reached 100 votes</h2>
        </>,
        runoffStage: 'palinVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>But then why did outlets report a majority for peltola?</h1>
            <img src="/images/cnnResults.png" style={{width: '90%'}}/>
            <p><a href="https://www.cnn.com/election/2022/results/alaska/special-election/us-house-district-1-final">link</a></p>
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
            <h1>RCV virtually guarantees a condorcet winner</h1>
            <h2>Wrong again, Peltola wasn't the condorcet winner in this election!</h2>
        </>,
        runoffStage: 'palinVsPeltola',
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <h1>But what's a condorcet winner?</h1>
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
        visible: [Candidate, 'condorcet'],
        explainer: <>
            <h1>So Begich is the actual condorcet winner!</h1>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    new SimTransition({
        visible: [Candidate, 'condorcet'],
        explainer: <>
            <h1>Additionally, Palin lost all her head-to-head matchups</h1>
            <h2>That makes her the Condorcet Loser for this election</h2>
        </>,
        runoffStage: 'begichVsPalin',
    }),
    // spoiler effect
];

