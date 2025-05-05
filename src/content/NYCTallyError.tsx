//const nycTallyError = () => {
//    let def = {
//        electionName: ELECTIONS.nyc_2021,
//        electionTag: ELECTIONS.nyc_2021,
//        failureTag: FAILURE.tally,
//    }
//    const [election.names.center, election.names.right, election.names.left] = simState.candidateNames[ELECTIONS.nyc_2021];
//
//
//    return [
//        new SimTransition({
//            ...def,
//            explainer: 
//            <>
//                <p>
//                    In this election, over 135,000 official looking test ballots were run through the system, added to the
//                    official preliminary results tally, and reported to the public. The error was discovered by a candidate
//                    who had done extensive exit polling and who called the preliminary results into question after finding
//                    that the official results were inconsistent with his campaign's internal data.
//                    <a href='https://www.nytimes.com/2021/06/29/nyregion/adams-garcia-wiley-mayor-ranked-choice.html'>NYC had to issue an apology and do a recount.</a>.
//                </p>,
//                <p>(unfortunately we don't have the data to show the effect in the simulation)</p>
//                <p>To be clear, this was the first election to use RCV in NYC. Running test ballots through voting software is
//                    standard practice for system testing, but these ballots should have been deleted before the official
//                    tabulation began and using real ballots filled out for real candidates for this kind of testing is not
//                    consistent with best practices.</p>
//                <p>While this error wasn't specific to RCV, it still highlights the fact that RCV's complexity makes
//                    it less transparent, harder to audit, and harder to detect errors that may occur. Unlike other
//                    methods, with RCV all ballots have to be centralized in one location in order to determine the
//                    elimination order and the vote transfers, which in turn means that early returns can't be fully
//                    processed. Under Choose One, Approval, and STAR Voting, any subset of ballots can be tallied
//                    separately and then added together later. This makes it much easier to tally ballots in the
//                    first place, and makes it easier for election officials to check their work as they go.
//                </p>
//                <p>
//                    The test ballots being included in the official count is only half the problem, the other half is that the
//                    election board was unable to discover the issue themselves before releasing the results.
//                </p>
//            </>,
//            visible: [Candidate, Voter, VoterCamp, Pie],
//            runoffStage: 'firstRound',
//        }),
//    ]
//}