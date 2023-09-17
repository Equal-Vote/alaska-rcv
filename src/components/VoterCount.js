import GameObject from "./GameObject";

const camps = [
    'begich_bullet',
    'begich_then_palin',
    'palin_then_begich',
    'palin_bullet',
    'palin_then_peltola',
    'peltola_then_palin',
    'peltola_bullet',
    'peltola_then_begich',
    'begich_then_peltola',
];

class VoterCount extends GameObject{
    constructor(r, angle, candidate, candidateIndex){
        super(r, angle, 30, undefined);
        this.candidate = candidate;
        this.candidateIndex = candidateIndex;
        this.candidateColor = `var(--${this.candidate})`
        this.count = 0;
    }

    getStyle(containerSize){
        return {
            ...super.getStyle(containerSize),
            fontSize: `${Math.round(0.05 * containerSize)}px`,
        }
    }

    isVisible(simState){
        return simState.pie.isVisible(simState) && simState.runoffStage != 'default' && simState.pie.colors[this.candidateIndex] != 'var(--pieGray)';
    }

    update(simState){
        let targetCount = camps.reduce((prev, camp) => prev + (simState[camp].voterColor == this.candidateColor) * simState[camp].members.length, 0);
        let t = .4;
        if(Math.abs(this.count-targetCount) <= 1){
            this.count = targetCount;
        }else{
            this.count = Math.round(this.count*(1-t) + targetCount*t);
        }
    }

    asComponent(simState, containerSize){
        return <div className={this.getClassNames(simState)} style={this.getStyle(containerSize)}>
            <h1>{this.count}</h1>
        </div>;
    }
}

export default VoterCount;