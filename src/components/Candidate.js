import GameObject from "./GameObject";
import Vector from "./Vector";

class Candidate extends GameObject{
    constructor(r, angle, candidateIndex){
        super('Candidate', r, angle, 15, -1);
        this.candidateIndex = candidateIndex;
        this.customClass = `candidate${candidateIndex}`;
        this.startCustomClass = this.customClass;
        this.candidateName = 'placeholder';
    }
    
    asComponent(simState, containerSize) {
        return <div className={this.getClassNames(simState)} style={{
            width: `${this.size.x}%`,
            height: `${this.size.y}%`,
            transform: new Vector(50)
                .add(this.pos)
                .add(this.size.scale(-.5))
                .scale(containerSize / 100)
                .asTranslate(),
        }}>
            <div className='CandidateInner' style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(\"images/${this.candidateName}.jpg\")`,
                border: `${Math.round(0.006 * containerSize)}px solid var(--${this.candidateName})`,
            }}/>
        </div>;
    }

    update(simState){
        this.candidateName = simState.candidateNames[simState.electionName][this.candidateIndex].toLowerCase();
    }

    win(){
        this.customClass = `${this.startCustomClass} winner`;
        setTimeout(() => {
            this.customClass = this.startCustomClass;
        }, 2000);
    }
}

export default Candidate;