import {ElectionDetails} from '../Transitions';
import { VoterMovement } from '../VoterMovement';

export default {
    tag: 'aspen-2009',
    title: 'Aspen 2009 Council Election',
    ratio: 11.1,
    sourceTitle: 'RangeVoting.org',
    sourceURL: 'https://rangevoting.org/Aspen09.html',
    extraBullets: <>
        <li>Dataset: <a href='https://www.preflib.org/dataset/00016'>Preflib</a></li>
        <li>NOTE: This was a 2 seat election using a heavily modified version of STV (it's misleading to even call it STV, read the details <a href='https://rangevoting.org/cc.ord.003-09sec.pdf'>here</a>).
            The first seat was given to Derek Johnson (not to be confused with Jack Johnson), and the Monotonicity occured when determining the second seat.
            The computation for the second seat is identical to standard IRV.
        </li>
    </>,
    names: {
        left: 'Torre',
        center: 'Johnson',
        right: 'Behrendt',
    },
    camps: [0, 11, 19, 15, 22, 37, 24, 19, 23, 30],
    dimensions: [
        'condorcet_success',
        'majority',
        'downward-mono',
        'repeal',
        'star-conversion'
    ],
    centerBeatsRight: false,
    downwardMonoMovement: new VoterMovement(7, 'rightBullet', 'centerBullet'),
    repealDetails: <p> Aspen did not enjoy their experience with IRV and repealed it shortly after this election, <a href='https://rangevoting.org/Aspen09.html'>view details</a></p>
} satisfies ElectionDetails;