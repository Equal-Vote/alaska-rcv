import GameObject from "./GameObject";

class Pie extends GameObject{
    constructor(size){
        super(0, 0, size);
    }

    getStyle(containerSize){
        return {
            ...super.getStyle(containerSize),
            borderWidth: `${Math.round(0.004 * containerSize)}px`,
            backgroundImage: 'conic-gradient(var(--begich) 0, var(--begich) 16%, var(--palin) 0, var(--palin) 50%, var(--peltola) 0, var(--peltola) 83%, var(--begich) 0, var(--begich) 100%)'
        }
    }
}

export default Pie;