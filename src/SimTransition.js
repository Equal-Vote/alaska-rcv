import Candidate from "./components/Candidate";
import Pie from "./components/Pie";
import VoterCount from "./components/VoterCount";

export class SimTransition {
    constructor({ visible = [], focused = [], explainer = <></>, voterMovements = [], runoffStage='default', electionName='alaska-special-2022', electionTag=undefined, failureTag=undefined, resetVoters=false, exhaustedCamp=undefined, videoStopTime=999999}) {
        this.visible = visible;
        if(visible == 'undefined') this.visible = undefined;

        this.focused = focused;
        this.voterMovements = voterMovements;
        this.exhaustedCamp = exhaustedCamp;
        this.videoStopTime = videoStopTime;

        this.explainer = explainer;
        this.runoffStage = runoffStage;
        if(runoffStage == 'undefined') this.runoffStage = undefined;
        this.electionName = electionName;
        // I can't pass electionName undefined without the default kicking in, so I pass it as a string
        if(visible != undefined && (!visible.includes(Candidate) || electionName == 'undefined')) this.electionName = undefined;

        this.electionTag = electionTag;
        this.failureTag = failureTag;
    }

    moveVoters(simState){
        this.voterMovements.forEach(m => m.apply(simState));
    }

    apply(simState) {
        if(this.visible != undefined) simState.visible = this.visible;
        simState.focused = this.focused;
        simState.exhaustedCamp = this.exhaustedCamp;
        simState.videoStopTime = this.videoStopTime;
        if(this.runoffStage != undefined){
            if(simState.runoffTimeout != undefined){
                clearTimeout(simState.runoffTimeout)
            }
            if(this.runoffStage.includes('vs') && this.runoffStage != simState.runoffStage && simState.visible.includes(Pie)){
                simState.runoffTimeout = setTimeout(() => {
                   // get biggest voter camp 
                   let counts = simState.objects
                    .filter(obj => obj instanceof VoterCount)
                    .sort((l, r) => l.count - r.count)

                    if(counts[2].count == counts[1].count) return;

                   // set corresponding Candidate to be the winner
                    let winnerIndex = counts[2].candidateIndex;
                   simState.objects
                    .filter(obj => obj instanceof Candidate)
                    .filter(candidate => candidate.candidateIndex == winnerIndex)[0].win();
                }, 400);
            }
            simState.runoffStage = this.runoffStage;
        }
        if(this.electionName != undefined) simState.electionName = this.electionName;
    }

    revertMove(simState){
        this.voterMovements.toReversed().forEach(m => m.revert(simState));
    }
}
