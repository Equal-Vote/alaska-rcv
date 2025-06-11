import {ElectionDetails} from '../Transitions';
import { VoterMovement } from '../VoterMovement';

export default {
    tag: 'moab21',
    title: 'Moab 2021 City Council Election',
    ratio: 8.7,
    sourceTitle: 'Analysis of the 2021 Instant Run-Off Elections in Utah',
    sourceURL: 'https://vixra.org/abs/2208.0166',
    extraBullets: <li>
        Moab was actually a multi winner election where they ran RCV multiple times to pick the winners.
        The first round failed to elect the Condorcet Winner, but they were still elected in the second round so the error didn't have any impact.
    </li>,
    camps: [0, 3, 41, 50, 1, 4, 13, 38, 41, 10],
    names: {
        left: 'Taylor',
        center: 'Wojciechowski',
        right: 'Kovash',
    },
    dimensions: [
        'spoiler',
        'condorcet',
        'majority',
        'upward-mono', 
        'no-show',
        'repeal',
        'star-conversion'
    ],
    upwardMonoMovements: [new VoterMovement(3, 'rightThenLeft', 'leftThenRight')],
    noShowMovement: new VoterMovement(3, 'rightThenCenter', 'home'),
    repealDetails: <p>
        Moab used RCV under Utah's pilot program for testing the system. In 2021, 23 cities signed up, but then only 12 of those cities stayed, and moab was one of the ones that opted
        out <a href="https://www.moabtimes.com/articles/city-returns-to-traditional-election-method/">source1</a> <a href="https://kslnewsradio.com/2003994/draper-city-bows-out-of-ranked-choice-voting-as-pilot-program-proceeds/">source2</a>
    </p>
} satisfies ElectionDetails;