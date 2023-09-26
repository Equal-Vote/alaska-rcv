import GameObject from "./GameObject";

class Candidate extends GameObject{
    constructor(r, angle, candidateIndex){
        super('Candidate', r, angle, 15, -1);
        this.candidateIndex = candidateIndex;
        this.customClass = `candidate${candidateIndex}`;
        this.candidateName = 'begich';
    }
    
    update(simState){
        this.candidateName = simState.candidateNames[simState.electionName][this.candidateIndex];
    }

    getStyle(containerSize) {
        return {
            ...super.getStyle(containerSize),
            backgroundImage: `url(\"alaska-rcv/images/${this.candidateName}.jpg\")`,
            border: `${Math.round(0.006 * containerSize)}px solid var(--${this.candidateName})`,
        };
    }
}

export default Candidate;