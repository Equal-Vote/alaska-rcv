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
        if(this.candidateName == 'placeholder') return <div/>
        let img = require(`../assets/${this.candidateName.toLowerCase()}.jpg`);
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
                backgroundImage: `url(${img})`,
                border: `${Math.round(0.006 * containerSize)}px solid var(--${this.candidateName.toLowerCase()})`,
            }}>
                <h3 style={{
                    width: '100%',
                    margin: `${Math.round(0.002 * containerSize)}px`,
                    fontSize: `${Math.round(0.02 * containerSize)}px`,
                    textAlign: 'center',
                    marginTop: `${Math.round(.125 * containerSize)}px`,
                    backgroundColor: `var(--${this.candidateName.toLowerCase()})`,
                    color: 'black',
                }}>{this.candidateName}</h3>
            </div>
            
        </div>;
    }

    update(simState){
        this.candidateName = simState.candidateNames[simState.electionName][this.candidateIndex];
    }

    win(){
        this.customClass = `${this.startCustomClass} winner`;
        setTimeout(() => {
            this.customClass = this.startCustomClass;
        }, 2000);
    }
}

export default Candidate;