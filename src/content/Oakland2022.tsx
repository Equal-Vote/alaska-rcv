import {ElectionDetails} from '../Transitions';
import { VoterMovement } from '../VoterMovement';
import AlamedaCountyError from './AlamedaCountyError';

//...electionNote(ELECTIONS.alameda_2022, FAILURE.spoiler, <>
    //<p>Note that the Hutchinson vs Manigo head-to-head appears to be tied but this is because Manigo wins by a fraction of a simulated vote</p>
//</>),
//...alamedaTallyError(),
//...electionNote(ELECTIONS.alameda_2022, FAILURE.cycle,
    //<p>Note that the Hutchinson vs Manigo head-to-head appears to be tied but this is because Manigo wins by a fraction of a simulated vote</p>
//),
export default {
    tag: 'oakland-2022',
    title: 'Oakland 2022 School Director Election',
    extraBullets: <li>Note that the existence of a condorcet cycle implies that there will be a spoiler candidate regardless of which winner is chosen.</li>,
    names: {
        left: 'Hutchinson',
        center: 'Manigo',
        right: 'Resnick',
    },
    dimensions: [
        'spoiler',
        'cycle', 
        'tally',
        'majority',
        'downward-mono',
        'upward-mono',
        'compromise',
        'star-conversion',
        'tally',
    ],
    customDimensions: {
        'bettervoting': 'https://bettervoting.com/bpqkqm/results',
        'tally': AlamedaCountyError,
    },
    camps: [0, 14, 16, 24, 28, 23, 18, 18, 27, 32],
    ratio: 132.1,
    sourceTitle: 'Ranked Choice Bedlam in a 2022 Oakland School Director Election',
    sourceURL: 'https://arxiv.org/abs/2303.05985',
    upwardMonoMovements: [new VoterMovement(16, 'rightThenLeft', 'leftThenRight')],
    downwardMonoMovement: new VoterMovement(1, 'rightThenCenter', 'centerThenRight'),
    compromiseMovement: new VoterMovement(13, 'rightThenCenter', 'centerThenRight')
} satisfies ElectionDetails;