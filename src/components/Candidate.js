import GameObject from "./GameObject";

class Candidate extends GameObject{
    constructor(r, angle, candidateName){
        super(r, angle, 15, -1);
        this.candidateName = candidateName;
        this.customClass = candidateName;
    }
    
    getStyle(containerSize) {
        return {
            ...super.getStyle(containerSize),
            backgroundImage: `url(\"images/${this.candidateName}.jpg\")`,
            border: `${Math.round(0.006 * containerSize)}px solid var(--${this.candidateName})`,
        };
    }
}

export default Candidate;