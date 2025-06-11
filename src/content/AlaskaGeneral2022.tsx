import {ElectionDetails} from '../Transitions';

export default {
    tag: 'alaska22general',
    title: 'Alaska 2022 US Representative General Election',
    ratio: 1318.4,
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
    camps: [0, 11, 33, 32, 17, 3, 6, 50, 42, 6],
    names: {
        left: 'Peltola',
        center: 'Begich',
        right: 'Palin',
    },
    dimensions: [
        'condorcet_success',
        'star-conversion',
    ],
    centerBeatsRight: true,
} satisfies ElectionDetails;