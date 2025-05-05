//const alamedaTallyError = () => {
//    let def = {
//        electionName: ELECTIONS.alameda_2022,
//        electionTag: ELECTIONS.alameda_2022,
//        failureTag: FAILURE.tally,
//    }
//    const [election.names.center, election.names.right, election.names.left] = simState.candidateNames[ELECTIONS.alameda_2022];
//    return [
//        new SimTransition({
//            ...def,
//            explainer: 
//            <>
//                <p>
//                    A bug in the software caused votes to not transfer correctly.
//                    In one race this caused the candidates to be eliminated in the wrong order and the election was incorrectly
//                    called for Resnick instead of Hutchinson. The issue was discovered 50 days later after the election
//                    had been certified. Resnick took office initially, but the matter was eventually resolved in court.
//                </p>
//                <p>
//                    The bug was specifically related to ballots that either skipped their first ranking or that specified a write-in for their first ranking.
//                    These votes should have transferred to the next choice ranked.
//                </p>
//            </>,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            runoffStage: 'firstRound',
//        }),
//        new SimTransition({
//            ...def,
//            explainer: <p>
//                    We can simulate how the ballots were counted by removing 1 of the Hutchinson voters from the tally.
//            </p>,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            runoffStage: 'firstRound',
//            voterMovements: [
//                new VoterMovement(1, 'leftBullet', 'home')
//            ]
//        }),
//        new SimTransition({
//            ...def,
//            explainer: <p>
//                This causes Hutchinson to be eliminated first (by a fraction of a vote), and then Resnick won in the final round.
//            </p>,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            runoffStage: 'center_vs_right',
//        }),
//        new SimTransition({
//            ...def,
//            explainer: <p>
//                But if we start over...
//            </p>,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            runoffStage: 'firstRound',
//        }),
//        new SimTransition({
//            ...def,
//            explainer: <p>
//                and include all the ballots in the count...
//            </p>,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            runoffStage: 'firstRound',
//            voterMovements: [
//                new VoterMovement(1, 'home', 'leftBullet')
//            ]
//        }),
//        new SimTransition({
//            ...def,
//            explainer: <>
//                <p>then Manigo get's elimated in the first round, and Hutchinson is now the winner.</p>
//                <p>The other concerning thing is that this bug existed for all of the elections in Alameda County. This just happened to be the only election that was close enough for the result to change.</p>
//            </>,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            runoffStage: 'right_vs_left',
//        }),
//        new SimTransition({
//            ...def,
//            explainer: 
//            <>
//                <p>To be clear, this bug was likely caused by human error and there was no evidence of election interference.</p>
//                <p>However, this still tells us a few things about RCV:
//                <ol>
//                    <li><u>RCV is Complicated</u>:
//                    Most ballot data will never be counted, and determining which data to count in what order is inherently complex.
//                    There are a lot of edge cases to consider so it's easy to miss an important detail when implementing the algorithm, and errors made are harder to catch.</li>
//                    <li><u>RCV is Unstable</u>: If the first choice tallies are close, then minor adjustments to the vote can change the elimination order and have a major impact to the result
//                        (Most other voting methods, including Approval and STAR Voting, count all ballot data given to ensure that popular candidates aren't eliminated prematurely).</li>
//                    <li><u>RCV is hard to audit</u>: Unlike other methods, with RCV all ballots have to be centralized
//                    in one location in order to determine the elimination order and the vote transfers, which in turn
//                    means that early returns can't be fully processed. Under Choose One, Approval, and STAR Voting, any
//                    subset of ballots can be tallied separately and then added together later. This makes it much easier
//                    to tally ballots in the first place, and makes it easier for election officials to check their work
//                    as they go. The fact that the RCV software bug existed was only half the problem, the other half is
//                    that it took over a month to realize that an error had even occurred and months to correct the issue
//                    and then seat the correct candidate.</li>
//                </ol>
//                </p>
//            </>,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            runoffStage: 'right_vs_left',
//        }),
//    ]
//}