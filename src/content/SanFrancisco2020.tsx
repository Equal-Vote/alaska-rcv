import {ElectionDetails} from '../Transitions';
import { VoterMovement } from '../VoterMovement';

//...electionNote(ELECTIONS.san_francisco_2020, FAILURE.downward-mono,
    //<p>(It shows as a tie here because they only won by a fraction of a vote).</p>
//),
export default {
    tag: 'san-francisco20',
    title: 'San Francisco 2020 District 7 Board of Supervisors Election',
    extraContext: 
        <p>Despite picking this correct winner, the Downward Monotonicity Pathology is still concerning because it shows that the result isn't stable,
            and could potentially be vulnerable to strategic voting.</p>,
    names: {
        left: 'Melgar',
        center: 'Nguyen',
        right: 'Engardio',
    },
    dimensions: [
        'condorcet_success',
        'downward-mono',
        'star-conversion'
    ],
    camps: [0, 9, 12, 18, 31, 29, 22, 10, 31, 38],
    ratio: 178.1,
    sourceTitle: 'An Examination of Ranked-Choice Voting in the United States, 2004–2022',
    sourceURL: 'https://arxiv.org/abs/2301.12075',
    downwardMonoMovement: new VoterMovement(5, 'rightThenCenter', 'centerThenRight'),
    centerBeatsRight: false,
} satisfies ElectionDetails;