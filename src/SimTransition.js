export class SimTransition {
    constructor({ visible = [], focused = [], explainer = <></>, voterMovements = [], explainerDelaySeconds=0, sticky = false }) {
        this.visible = visible;
        this.focused = focused;
        this.voterMovements = voterMovements;

        this.explainer = explainer;
        this.explainerDelaySeconds = explainerDelaySeconds;
        this.sticky = sticky;
    }

    applyState(simState){
        simState.visible = this.visible;
        simState.focused = this.focused;
    }

    apply(simState) {
        simState.visible = this.visible;
        simState.focused = this.focused;
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
