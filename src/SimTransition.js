export class SimTransition {
    constructor({ visible = [], focused = [], explainer = <></>, voterMovement = undefined, explainerDelaySeconds=0, sticky = false }) {
        this.visible = visible;
        this.focused = focused;
        this.voterMovement = voterMovement;

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
        if (this.voterMovement != undefined) {
            this.voterMovement.apply(simState);
        }
        simState.explainerStart++;
        simState.explainerEnd++;
    }

    revert(simState) {
        simState.explainerStart--;
        simState.explainerEnd--;
        if (this.voterMovement != undefined) {
            this.voterMovement.revert(simState);
        }
    }
}
