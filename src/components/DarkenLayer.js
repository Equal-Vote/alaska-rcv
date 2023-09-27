import GameObject from "./GameObject";

class DarkenLayer extends GameObject{
    constructor(){
        super('DarkenLayer', 0, 0, 100, undefined);
        this.size.y = this.size.x*1.01; // needs to be slightly taller to fully cover begich
    }

    isFocused(){ return undefined; }

    isVisible(simState){ return simState.focused.length > 0; }
}

export default DarkenLayer;