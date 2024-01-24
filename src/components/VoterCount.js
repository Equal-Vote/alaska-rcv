import GameObject from "./GameObject";

const camps = [
    'centerBullet',
    'centerThenRight',
    'rightThenCenter',
    'rightBullet',
    'rightThenLeft',
    'leftThenRight',
    'leftBullet',
    'leftThenCenter',
    'centerThenLeft',
];

class VoterCount extends GameObject{
    constructor(r, angle, candidateIndex){
        super('VoterCount', r, angle, 30, undefined);
        this.candidateIndex = candidateIndex;
        this.candidateColor = 'var(--pieGray)';
        this.count = 0;
    }

    getStyle(containerSize){
        return {
            ...super.getStyle(containerSize),
            fontSize: `${Math.round(0.05 * containerSize)}px`,
            //color: 'black',
            color: this.candidateColor, 
        }
    }

    isVisible(simState){
        return simState.pie.isVisible(simState) && simState.runoffStage != 'default' && simState.pie.allPieColors[simState.runoffStage][this.candidateIndex] != -1;
    }

    update(simState){
        this.candidateColor = `var(--${simState.candidateNames[simState.electionName][this.candidateIndex].toLowerCase()})`

        let targetCount = camps.reduce((prev, camp) => prev + (simState[camp].currentCandidateIndex(simState) == this.candidateIndex) * simState[camp].members.length, 0);
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