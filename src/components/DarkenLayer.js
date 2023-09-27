import GameObject from "./GameObject";

class DarkenLayer extends GameObject{
    constructor(){
        super('DarkenLayer', 0, 0, 105, undefined);
    }

    isFocused(){ return undefined; }

    isVisible(simState){ return simState.focused.length > 0; }
}

export default DarkenLayer;