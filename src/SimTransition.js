import Candidate from "./components/Candidate";
import Pie from "./components/Pie";
import VoterCount from "./components/VoterCount";

export class SimTransition {
    constructor({ visible = [], focused = [], explainer = <></>, voterMovements = [], runoffStage='default', resetVoters=false, exhaustedCamp=undefined, videoStopTime=999999}) {
        this.visible = visible;
        if(visible == 'undefined') this.visible = undefined;

        this.focused = focused;
        this.voterMovements = voterMovements;
        this.exhaustedCamp = exhaustedCamp;
        this.videoStartTime = 0;
        this.videoStopTime = videoStopTime;

        this.explainer = explainer;
        this.runoffStage = runoffStage;
        if(runoffStage == 'undefined') this.runoffStage = undefined;

        this.electionTag = undefined;
        this.election = undefined;
        this.id = Math.round(Math.random()*10000);
    }

    moveVoters(simState){
        this.voterMovements.forEach(m => m.apply(simState));
    }

    setElection(election){
        this.electionTag = election?.tag;
        this.election = election;
        return this;
    }

    apply(simState) {
        if(this.visible != undefined) simState.visible = this.visible;
        simState.focused = this.focused;
        simState.exhaustedCamp = this.exhaustedCamp;
        simState.videoStartTime = this.videoStartTime;
        simState.videoStopTime = this.videoStopTime;
        if(this.election != undefined){
            simState.election = this.election;
        }
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
