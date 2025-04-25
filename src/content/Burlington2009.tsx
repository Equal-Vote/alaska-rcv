import {TransitionGetter} from '../Transitions';
import { electionInfo, spoiler, upwardMonotonicity } from '../TransitionTemplates';
import { VoterMovement } from '../VoterMovement';



const candidateNames = ['Montroll', 'Wright', 'Kiss'];

export default (): TransitionGetter[] => {
    return [
        electionInfo('burlington-2009', 44.1),
        spoiler('burlington-2009', candidateNames),
        upwardMonotonicity('burlington-2009', [
            new VoterMovement(11, 'rightBullet', 'leftBullet'),
            new VoterMovement(7, 'rightThenLeft', 'leftThenRight')
        ], candidateNames)
    ];
    //...condorcet(ELECTIONS.burlington_2009),
    //...majorityFailure({
    //    electionTag: ELECTIONS.burlington_2009,
    //    winnerVoteCount: 98,
    //    bulletVoteCount: 10
    //}),
    //...compromise(ELECTIONS.burlington_2009, new VoterMovement(9, 'rightThenCenter', 'centerThenRight')),
    //...electionNote(ELECTIONS.burlington_2009, FAILURE.repeal,
    //    <p><a href="https://alaskapolicyforum.org/2020/10/failed-experiment-rcv/#_ftn46:~:text=choice%20voting%20system.-,Burlington%2C%20Vermont,-The%20City%20of">Burlington repealed RCV</a>
    //            after having used it in 2 mayoral elections in 2006 and 2009
    //    </p>
    //),
    //...starConversion(ELECTIONS.burlington_2009),
}