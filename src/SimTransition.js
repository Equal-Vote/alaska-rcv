import Candidate from "./components/Candidate";

export class SimTransition {
    constructor({ visible = [], focused = [], explainer = <></>, voterMovements = [], runoffStage='default', electionName='alaska-special-2022', electionTag=undefined, failureTag=undefined, resetVoters=false}) {
        this.visible = visible;
        if(visible == 'undefined') this.visible = undefined;

        this.focused = focused;
        this.voterMovements = voterMovements;

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
        if(this.runoffStage != undefined) simState.runoffStage = this.runoffStage;
        if(this.electionName != undefined) simState.electionName = this.electionName;
    }

    revertMove(simState){
        this.voterMovements.toReversed().forEach(m => m.revert(simState));
    }
}
