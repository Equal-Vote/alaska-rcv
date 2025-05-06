import {ElectionDetails} from '../Transitions';
import { VoterMovement } from '../VoterMovement';

export default {
    tag: 'alaska-special-2022',
    title: 'Alaska 2022 US Representative Special Election',
    names: {
        left: 'Peltola',
        center: 'Begich',
        right: 'Palin',
    },
    dimensions: [
        'condorcet',
        'spoiler',
        'majority',
        'upward_mono',
        'compromise',
        'no_show',
        'star_conversion',
        'rank_the_red',
    ],
    camps: [0, 12, 29, 36, 23, 4, 5, 25, 50, 16],
    ratio: 942.9,
    sourceTitle: 'A Mathematical Analysis of the 2022 Alaska Special Election for US House',
    sourceURL: 'https://arxiv.org/abs/2209.04764',
    upwardMonoMovements: [new VoterMovement(7, 'rightBullet', 'leftBullet')],
    compromiseMovement: new VoterMovement(6, 'rightThenCenter', 'centerThenRight'),
    noShowMovement: new VoterMovement(7, 'rightThenCenter', 'home'),
} satisfies ElectionDetails;