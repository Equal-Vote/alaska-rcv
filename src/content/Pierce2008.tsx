import {ElectionDetails} from '../Transitions';
import { VoterMovement } from '../VoterMovement';

export default {
    tag: 'pierce-2008',
    title: 'Pierce County WA 2008 County Executive Election',
    sourceTitle: 'An Examination of Ranked-Choice Voting in the United States, 2004–2022',
    sourceURL: 'https://arxiv.org/abs/2301.12075',
    ratio: 1441.6,
    camps: [0, 14, 9, 19, 44, 19, 9, 14, 41, 31],
    extraContext: <>
        <p>Despite picking this correct winner, the Lesser-Evil Failure is still concerning because it shows that the result isn't stable,
            and could potentially be vulnerable to strategic voting.</p>
    </>,
    names: {
        left: 'McCarthy',
        center: 'Goings',
        right: 'Bunney',
    },
    dimensions: [
        'condorcet_success',
        'compromise',
        'majority',
        'repeal',
        'star-conversion',
    ],
    compromiseMovement: new VoterMovement(11, 'rightThenCenter', 'centerThenRight'),
    compromiseRunoffStage: 'center_vs_right',
    repealDetails: <>
        <p>RCV was only used for one election cycle, here's a quote from Elections Direcector Nick Handy:</p>
        <p><i>"Just three years ago, Pierce County voters enthusiastically embraced this new idea as a replacement for the then highly unpopular Pick-a-Party primary.”   Pierce County did a terrific job implementing ranked choice voting, but voters flat out did not like it.
            The rapid rejection of this election model that has been popular in San Francisco, but few other places, was expected, but no one really anticipated how fast the cradle to grave cycle would run.  The voters wanted it. The voters got and tried it.  The voters did not like it.
            And the voters emphatically rejected it.  All in a very quick three years."</i> <a href="https://blogs.sos.wa.gov/FromOurCorner/index.php/2009/11/pierce-voters-nix-ranked-choice-voting/">source</a></p>
    </>,
    centerBeatsRight: true,
} satisfies ElectionDetails;
