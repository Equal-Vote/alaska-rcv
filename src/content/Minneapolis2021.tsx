import {ElectionDetails} from '../Transitions';
import { VoterMovement } from '../VoterMovement';

export default {
    tag: 'minneapolis-2021',
    title: 'Minneapolis 2021 Ward 2 City Council Electionn',
    names: {
        left: 'Worlobah',
        center: 'Gordon',
        right: 'Arab',
    },
    dimensions: [
        'spoiler',
        'cycle',
        'majority',
        'compromise',
        'upward_mono',
        'downward_mono',
        'star_conversion'
    ],
    camps: [0, 19, 18, 20, 35, 17, 25, 11, 29, 26],
    ratio: 44.5,
    sourceTitle: 'Ranked Choice Voting And the Center Squeeze in the Alaska 2022 Special Election: How Might Other Voting Methods Compare?',
    sourceURL: 'https://arxiv.org/abs/2303.00108',
    extraContext: <>
        <p>This election was essentially a repeat of the special election 6 months prior, and it was interesting to see how the votes changed.</p>
        <p>Voting theorists wondered if the results from the previous election would cause voters to be more strategic in the general, but this wasn't the case.</p>
        <p>Instead voters shifted left across the board and Peltola was the true Condorcet Winner this time.</p>
        <p>There are 2 primary explanations for this <ul>
            <li>The general election had much more voters, and voters in general elections tend to be more left leaning.</li>
            <li>Sarah Palin had the most name recognition going into the special election, and this likely created an electability bias in her favor.
                Going into the general Peltola was the incumbant, so this shifted the electability bias to her. This implies that one unrepresentative
                outcome can create a domino effect and give the that candidate an edge in future elections.
            </li>
        </ul></p>
    </>,
    compromiseMovement: new VoterMovement(8, 'rightThenCenter', 'centerThenRight'),
    upwardMonoMovements: [new VoterMovement(11, 'rightThenLeft', 'leftThenRight')],
    downwardMonoMovement: new VoterMovement(2, 'rightThenCenter', 'centerThenRight'),
} satisfies ElectionDetails;
//...electionNote(ELECTIONS.minneapolis_2021, FAILURE.spoiler,
    //<p>Note that the existence of a condorcet cycle implies that there will be a spoiler candidate regardless of which winner is chosen.</p>
//),