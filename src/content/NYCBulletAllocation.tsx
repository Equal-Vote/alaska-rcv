//const nycBulletAllocation = () => {
//    let def = {
//        electionName: ELECTIONS.nyc_2021,
//        electionTag: ELECTIONS.nyc_2021,
//        failureTag: FAILURE.bullet-allocation,
//    }
//    const [election.names.center, election.names.right, election.names.left] = simState.candidateNames[def.electionTag];
//
//    return [
//        bulletVoteDefinition(def),
//        new SimTransition({
//            ...def,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            explainer: <>
//                <p>Eric Adams is the correct winner based on the ballot data we have, however if we assume that some of the
//                    Wiley bullet voters would have actually preferred Garcia over Adams then we get a different result. </p>
//                <p>Considering that this was the first RCV election held in New York City, it's understandable that the voter
//                    behavior might not have been ideal. There's a learning curve before voters adapt to any new system, especially
//                    when the incentives in the new system aren't transparent. In RCV, voters may still need to consider strategically
//                    ranking the frontrunner they prefer 1st, but they should always rank as many candidates as possible. </p>
//            </>,
//            runoffStage: 'firstRound'
//        }),
//        new SimTransition({
//            ...def,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            explainer: <>
//                <p>Let's assume that 4 of the Wiley bullet voter's second choice picks were actually aligned with the second choice picks of the other Wiley voters (3 for Garcia, and 1 for Adams).</p>
//            </>,
//            voterMovements: [
//                new VoterMovement(1, 'centerBullet', 'centerThenLeft'),
//                new VoterMovement(3, 'centerBullet', 'centerThenRight')
//            ],
//            runoffStage: 'firstRound'
//        }),
//        new SimTransition({
//            ...def,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            explainer: <>
//                <p>Wiley would still be eliminated in the first round, but the voters that transferred to Garcia would have been enough to give Garcia the win.</p>
//                <p>This shows that Wiley and Garcia may have split the vote in this election. If Wiley hadn't run, and only a few of those who bullet voted came out for Garcia then the results would have been different.</p>
//                <p>But again, Eric Adams was the correct winner based on the data we have. There is no way to prove how bullet voters would have chosen to rank the rest of their ballot.</p>
//                <p>Here's some more links to learn more</p>
//                <ul>
//                    <li><a href="https://electionconfidence.org/2024/01/11/ranked-choice-voting-hurts-minorities-study/">A paper exploring the trends of bullet voting and ballot exhaustion among minority voters in the NYC election</a></li>
//                    <li><a href="https://medium.com/3streams/assessing-the-promises-of-ranked-choice-voting-in-new-york-city-d46748d5e6af">An article reviewing the general performance of RCV in NYC</a></li>
//                    <li><a href="https://x.com/DCInbox/status/1447916713857613826?s=20">Public matching funds made it harder to measure RCVs performance in isolation</a></li>
//                </ul>
//            </>,
//            runoffStage: 'right_vs_left'
//        }),
//    ]
//}