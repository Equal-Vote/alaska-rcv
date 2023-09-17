export class SimTransition {
    constructor({ visible = [], focused = [], explainer = <></>, voterMovements = [], runoffStage='default'}) {
        this.visible = visible;
        this.focused = focused;
        this.voterMovements = voterMovements;

        this.explainer = explainer;
        this.runoffStage = runoffStage;
    }

    moveVoters(simState){
        this.voterMovements.forEach(m => m.apply(simState));
    }

    apply(simState) {
        simState.visible = this.visible;
        simState.focused = this.focused;
        simState.runoffStage = this.runoffStage;
    }

    revertMove(simState){
        this.voterMovements.forEach(m => m.revert(simState));
    }
}
