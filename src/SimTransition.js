export class SimTransition {
    constructor({ visible = [], focused = [], explainer = <></>, voterMovements = [], runoffStage='default', electionName='alaska-2022'}) {
        this.visible = visible;
        this.focused = focused;
        this.voterMovements = voterMovements;

        this.explainer = explainer;
        this.runoffStage = runoffStage;
        this.electionName = electionName;

        this.explainerVisible = true;
        this.isInSelector = false;
    }

    moveVoters(simState){
        this.voterMovements.forEach(m => m.apply(simState));
    }

    apply(simState) {
        simState.visible = this.visible;
        simState.focused = this.focused;
        simState.runoffStage = this.runoffStage;
        simState.electionName = this.electionName;
    }

    revertMove(simState){
        this.voterMovements.toReversed().forEach(m => m.revert(simState));
    }
}
