import GameObject from "./GameObject";

const piePoints = {
    'default': [0, 33, 33, 66, 66, 100],
    'firstRound': [16, 16, 50, 50, 83, 83],
    'begichVsPalin': [16,   16, 62,   62, 70,   70],
    'begichVsPeltola': [29,   29, 37,   37, 83,   83],
    'palinVsPeltola': [4,   4, 50,   50, 96,   96],
}

const pieColors = {
    'default': ['var(--begich)', 'var(--palin)', 'var(--peltola)'],
    'firstRound': ['var(--begich)', 'var(--palin)', 'var(--peltola)'],
    'begichVsPalin': ['var(--begich)', 'var(--palin)', 'var(--pieGray)'],
    'begichVsPeltola': ['var(--begich)', 'var(--pieGray)', 'var(--peltola)'],
    'palinVsPeltola': ['var(--pieGray)', 'var(--palin)', 'var(--peltola)'],
}

class Pie extends GameObject{
    constructor(size){
        super(0, 0, size);
        this.conicPairs = [];
        this.points = [...piePoints['default']];
        this.colors = [...pieColors['default']];
        //conicColors = Array(3).fill('var(--pieGray)');
    }

    update(simState){
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

        this.colors = pieColors[simState.runoffStage];

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