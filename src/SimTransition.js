export class SimTransition {
    constructor({ visible = [], focused = [], explainer = <></>, voterMovement = undefined, explainerDelaySeconds=0, sticky = false }) {
        this.visible = visible;
        this.focused = focused;
        this.voterMovement = voterMovement;

        this.explainer = explainer;
        this.explainerDelaySeconds = explainerDelaySeconds;
        this.sticky = sticky;
    }

    apply(simState) {
        simState.visible = this.visible;
        simState.focused = this.focused;
        if (this.voterMovement != undefined) {
            this.voterMovement.apply(simState);
        }
        simState.explainerEnd++;
        if (!this.sticky) simState.explainerStart = simState.explainerEnd - 1;
    }

    revert(simState) {
        this.voterMovement.revert(simState);
    }
}
