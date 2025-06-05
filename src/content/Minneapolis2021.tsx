import {ElectionDetails} from '../Transitions';
import { VoterMovement } from '../VoterMovement';

export default {
    tag: 'minneapolis-2021',
    title: 'Minneapolis 2021 Ward 2 City Council Election',
    extraBullets: <li>Note that the existence of a condorcet cycle implies that there will be a spoiler candidate regardless of which winner is chosen.</li>,
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
        'upward-mono',
        'downward-mono',
        'star-conversion'
    ],
    camps: [0, 19, 18, 20, 35, 17, 25, 11, 29, 26],
    ratio: 44.5,
    sourceTitle: 'An Examination of Ranked-Choice Voting in the United States, 2004–2022',
    sourceURL: 'https://arxiv.org/abs/2301.12075',
    compromiseMovement: new VoterMovement(8, 'rightThenCenter', 'centerThenRight'),
    upwardMonoMovements: [new VoterMovement(11, 'rightThenLeft', 'leftThenRight')],
    downwardMonoMovement: new VoterMovement(2, 'rightThenCenter', 'centerThenRight'),
} satisfies ElectionDetails;