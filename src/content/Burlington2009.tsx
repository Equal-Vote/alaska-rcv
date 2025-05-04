import {ElectionDetails, TransitionGetter} from '../Transitions';
import { electionInfo, upwardMonotonicity } from '../TransitionTemplates';
import { VoterMovement } from '../VoterMovement';


export default {
    tag: 'burlington-2009',
    title: 'Burlington 2009 Mayor Election',
    candidateNames: ['Montroll', 'Wright', 'Kiss'],
    dimensions: [
        'spoiler',
        'condorcet',
        'majority',
        'upward_mono',
        'compromise',
        'repeal',
        'star_conversion',
    ],
    camps: [0, 10, 18, 34, 29, 11, 9, 13, 46, 30],
    ratio: 44.1,
    sourceTitle: 'An Examination of Ranked-Choice Voting in the United States, 2004–2022',
    sourceURL: 'https://arxiv.org/abs/2301.12075',
    extraContext: <></>
} satisfies ElectionDetails;

//export default (): TransitionGetter[] => {
//    return [
//        electionInfo(election),
//        spoiler('burlington-2009', candidateNames),
//        //upwardMonotonicity('burlington-2009', [
//        //    new VoterMovement(11, 'rightBullet', 'leftBullet'),
//        //    new VoterMovement(7, 'rightThenLeft', 'leftThenRight')
//        //], candidateNames)
//    ];
//    //...condorcet(ELECTIONS.burlington_2009),
//    //...majorityFailure({
//    //    electionTag: ELECTIONS.burlington_2009,
//    //    winnerVoteCount: 98,
//    //    bulletVoteCount: 10
//    //}),
//    //...compromise(ELECTIONS.burlington_2009, new VoterMovement(9, 'rightThenCenter', 'centerThenRight')),
//    //...electionNote(ELECTIONS.burlington_2009, FAILURE.repeal,
//    //    <p><a href="https://alaskapolicyforum.org/2020/10/failed-experiment-rcv/#_ftn46:~:text=choice%20voting%20system.-,Burlington%2C%20Vermont,-The%20City%20of">Burlington repealed RCV</a>
//    //            after having used it in 2 mayoral elections in 2006 and 2009
//    //    </p>
//    //),
//    //...starConversion(ELECTIONS.burlington_2009),
//}