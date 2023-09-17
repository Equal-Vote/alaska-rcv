export class SimTransition {
    constructor({ visible = [], focused = [], explainer = <></>, voterMovements = [], runoffStage='default'}) {
        this.visible = visible;
        this.focused = focused;
        this.voterMovements = voterMovements;

        this.explainer = explainer;
        this.runoffStage = runoffStage;
    }

    applyState(simState){
        simState.visible = this.visible;
        simState.focused = this.focused;
        simState.runoffStage = this.runoffStage;
    }

    apply(simState) {
        simState.visible = this.visible;
        simState.focused = this.focused;
        simState.runoffStage = this.runoffStage;
        this.voterMovements.forEach(m => m.apply(simState));
        simState.explainerStart++;
        simState.explainerEnd++;
    }

    revert(simState) {
        simState.explainerStart--;
        simState.explainerEnd--;
        this.voterMovements.forEach(m => m.revert(simState));
    }
}
