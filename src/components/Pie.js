import GameObject from "./GameObject";

const piePoints = {
    'default': [0, 33, 33, 66, 66, 100],
    'firstRound': [16, 16, 50, 50, 83, 83],
    'center_vs_right': [16,   16, 62,   62, 70,   70],
    'center_vs_left': [29,   29, 37,   37, 83,   83],
    'right_vs_left': [4,   4, 50,   50, 96,   96],
}

class Pie extends GameObject{
    constructor(size){
        super('Pie', 0, 0, size);
        this.conicPairs = [];
        this.allPieColors = {
            'default': [0, 1, 2],
            'firstRound': [0, 1, 2],
            'center_vs_right': [0, 1, -1],
            'center_vs_left': [0, -1, 2],
            'right_vs_left': [-1, 1, 2],
        }
        this.points = [...piePoints['default']];
        this.colors = [...this.allPieColors['default']];
        this.prevRunoffStage = 'default';
        this.curRunoffStage = 'default';
        this.colorMix = 1;
    }

    indexToColor(simState, index){
        if(index == -1) return 'var(--pieGray)';
        return `var(--${simState.candidateNames[simState.electionName][index]})`;
    }

    update(simState){
        if(this.curRunoffStage != simState.runoffStage){
            this.colorMix = 0;
            this.prevRunoffStage = this.curRunoffStage;
            this.curRunoffStage = simState.runoffStage;
        }

        let t = .2;
        this.points = this.points.map((p, i) => {
            let diff = piePoints[simState.runoffStage][i]-p
            let minDelta = .5;
            let easeNext = (p*(1-t)) + (piePoints[simState.runoffStage][i]*t);
            if(Math.abs(p-easeNext) > 1){
                return easeNext;
            }else if(Math.abs(diff) >= minDelta){
                return p + minDelta*Math.sign(diff);
            }else{
                return p + diff;
            }
        });

        this.colorMix = this.colorMix*(1-t) + 1*t;
        this.colors = this.colors.map((c, i) =>{
            let prevColor = this.indexToColor(simState, this.allPieColors[this.prevRunoffStage][i]);
            let nextColor = this.indexToColor(simState, this.allPieColors[simState.runoffStage][i]);
            return `color-mix(in lch, ${prevColor}, ${nextColor} ${Math.round(this.colorMix*100)}%)`
        })

        this.conicPairs = [];
        for(let i = 0; i < 3; i++){
            this.conicPairs.push([this.colors[i], this.points[i*2]]);
            this.conicPairs.push(['var(--pieGray)', this.points[i*2+1]]);
        }

        this.conicPairs.push([this.colors[0], 100])
    }

    getStyle(containerSize){
        return {
            ...super.getStyle(containerSize),
            backgroundImage: 'conic-gradient('+this.conicPairs.map(([color, point], i) => `${color} 0, ${color} ${point}%`).join(',')+')'
        }
    }
}

export default Pie;