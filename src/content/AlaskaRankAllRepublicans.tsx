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
import { bulletVoteDefinition } from '../TransitionTemplates';

export default () => [
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>After the 2022 special election there has been <a href="https://thehill.com/opinion/campaign/3650562-alaska-republicans-should-rank-the-red-to-win-in-november/">a movement to encourage republican voters to "Rank all Republicans" or "Rank the Red"</a>. </p>
            <p>This speaks to one of the positives of RCV in that candidates are encouraged to form coalitions rather than strictly limit themselves to negative campaigning, but is it enough to overcome RCV's fundamental flaws?</p>
            <p>It turns out that "Rank all Republicans" would likely be an effective strategy for electing a Republican, however even with the improved voter education RCV will still fail to select winners that best represent the people.</p>
        </>,
        runoffStage: 'default'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>
            There are two halves to this message.
            <ol>
                <li>It hopes to encourage voters who bullet voted to instead rank another Republican for their second ranking.</li>
                <li>It hopes that the more unifying message can encourage the Republicans who voted Peltola second to switch their second choice to the other Republican.</li>
            </ol>
            Let's dig into the bullet voters first.
        </p>,
        runoffStage: 'default'
    }),
    bulletVoteDefinition(),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>There were voters who bullet voted for Begich, as well as voters who bullet voted for Palin.</p>
            <p>However Palin voters never got their second choices counted since she was one of the finalists.</p>
        </>,
        focused: ['centerBullet', 'rightBullet'],
        runoffStage: 'default'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>So we'll just focus on the Begich Bullet voters.</p>,
        focused: ['centerBullet'],
        runoffStage: 'default'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>What would happen if they had all selected Palin as their second choice?</p>,
        focused: ['centerBullet', 'centerThenRight'],
        voterMovements: [
            new VoterMovement(12, 'centerBullet', 'centerThenRight'),
        ],
        runoffStage: 'default'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>The added Palin support would allow her to easily win in the final runoff round.</p>,
        runoffStage: 'right_vs_left'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>But this isn't realistic, if we assume that the Begich bullet voters had similar feelings to the Begich voters that did express a second choice...</p>
        </>,
        voterMovements: [
        ],
        runoffStage: 'right_vs_left'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Then we'd expect roughly one third of them to have ranked Peltola second.</p>
            <p>This essentially brings the final runoff round to a tie.</p>
        </>,
        voterMovements: [
            new VoterMovement(4, 'centerThenRight', 'centerBullet'),
            new VoterMovement(4, 'centerBullet', 'centerThenLeft'),
        ],
        runoffStage: 'right_vs_left'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>So far we've also been assuming that the bullet voters had opinions about the other candidates, in reality some of the bullet voters
                were probably voters who genuinely only liked Begich.</p>
        </>,
        runoffStage: 'right_vs_left'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Here's what it would look like if just a quarter of the original bullet voters were genuine.</p>
            <p>So in reality the bullet voters alone likely wouldn't be enough to swing the election to Palin.</p>
        </>,
        voterMovements: [
            new VoterMovement(1, 'centerThenLeft', 'centerBullet'),
            new VoterMovement(2, 'centerThenRight', 'centerBullet'),
        ],
        runoffStage: 'right_vs_left'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Let's reset and look at the other half of the "Rank all Republicans" message. Would a more unifying message be enough to move some of the Republicans who voted Peltola second?</p>
            <p>Perhaps these were votes against Palin rather than specifically for Peltola, and an olive branch from Palin would be enough to swing them.
                Unfortunately the RCV ballot isn't expressive enough for us to guage how strong the Peltola support is
                so it's hard to say how effective this would be
                (<a href="https://rcvchangedalaska.com/alaska22/star-conversion">
                        but a STAR Voting ballot could help with this
                </a>).
            </p>
        </>,
        focused: ['centerThenLeft'],
        voterMovements: [
            new VoterMovement(3, 'centerThenLeft', 'centerBullet'),
            new VoterMovement(6, 'centerThenRight', 'centerBullet'),
        ],
        runoffStage: 'default'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>
            It wouldn't take very many to swing the election. Let's say just a quarter of 
            the "Begich first, Peltola second" voters were convinced to switch their second choice to Palin...
        </p>,
        voterMovements: [
            new VoterMovement(4, 'centerThenLeft', 'centerThenRight'),
        ],
        runoffStage: 'default'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <>
            <p>Then the win would swing back to Palin.</p>
        </>,
        runoffStage: 'right_vs_left'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>So "Rank all Republicans" could indeed help to get a Republican elected, and it shows how RCV can serve to incentivise positive campaigns,
            but the improved voter education still wouldn't be enough to solve the fundamental problems with RCV.</p>,
        runoffStage: 'right_vs_left'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>Even if we go to the most extreme case and assume that all republican voters "Ranked all Republicans", then RCV would still fail to elect the most representative winner.</p>,
        voterMovements: [
            new VoterMovement(12, 'centerThenLeft', 'centerThenRight'),
            new VoterMovement(12, 'centerBullet', 'centerThenRight'),
            new VoterMovement(4, 'rightThenLeft', 'rightThenCenter'),
            new VoterMovement(23, 'rightBullet', 'rightThenCenter'),
        ],
        runoffStage: 'right_vs_left'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>Begich would still win in a head to head against both Palin...</p>,
        runoffStage: 'center_vs_right'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>and Peltola.</p>,
        runoffStage: 'center_vs_left'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>But he'd also be the first to be eliminated during the tabulation</p>,
        runoffStage: 'firstRound'
    }),
    new SimTransition({
        visible: [Candidate, Voter, VoterCamp, Pie],
        explainer: <p>This illustrates how RCV tends to swing between 2 polarized extremes (just like Choose-One), and hurts the consensus candidates that best represent the population. </p>,
        runoffStage: 'right_vs_left'
    }),
]
