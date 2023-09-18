import GameObject from "./GameObject";

class Candidate extends GameObject{
    constructor(r, angle, candidateName, burlingtonName){
        super('Candidate', r, angle, 15, -1);
        this.candidateName = candidateName;
        this.burlingtonName = burlingtonName;
        this.imageName = this.candidateName;
        this.customClass = candidateName;
    }
    
    update(simState){
        this.imageName = simState.burlington? this.burlingtonName : this.candidateName;
    }

    getStyle(containerSize) {
        return {
            ...super.getStyle(containerSize),
            backgroundImage: `url(\"images/${this.imageName}.jpg\")`,
            border: `${Math.round(0.006 * containerSize)}px solid var(--${this.candidateName})`,
        };
    }
}

export default Candidate;