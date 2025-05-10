import {ElectionDetails} from '../Transitions';
import { LEFT_BULLET, LEFT_THEN_RIGHT, RIGHT_BULLET, RIGHT_THEN_LEFT } from '../TransitionTemplates';
import { VoterMovement } from '../VoterMovement';


export default {
    tag: 'burlington-2009',
    title: 'Burlington 2009 Mayor Election',
    names: {
        left: 'Kiss',
        center: 'Montroll',
        right: 'Wright',
    },
    dimensions: [
        'spoiler',
        'condorcet',
        'majority',
        'upward-mono',
        'compromise',
        'repeal',
        'star-conversion',
    ],
    camps: [0, 10, 18, 34, 29, 11, 9, 13, 46, 30],
    ratio: 44.1,
    sourceTitle: 'An Examination of Ranked-Choice Voting in the United States, 2004–2022',
    sourceURL: 'https://arxiv.org/abs/2301.12075',
    extraContext: <>
    </>,
    upwardMonoMovements: [
        new VoterMovement(11, 'rightBullet', 'leftBullet'),
        new VoterMovement(7, 'rightThenLeft', 'leftThenRight')
    ],
    compromiseMovement: new VoterMovement(9, 'rightThenCenter', 'centerThenRight'),
    repealDetails: 
        <p><a href="https://alaskapolicyforum.org/2020/10/failed-experiment-rcv/#_ftn46:~:text=choice%20voting%20system.-,Burlington%2C%20Vermont,-The%20City%20of">
            Burlington repealed RCV</a> after having used it in 2 mayoral elections in 2006 and 2009
        </p>
} satisfies ElectionDetails;
