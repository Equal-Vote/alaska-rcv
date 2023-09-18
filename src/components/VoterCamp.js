import GameObject from "./GameObject"
import Vector from "./Vector";

class VoterCamp extends GameObject{
    constructor(r, angle) {
        super('VoterCamp', r, angle, 3.5, -1)
        this.pieThresh = 100*(((360 - angle) + 90)%360) / 360;
        this.startR = r;
        this.members = [];
        this.size.x = this.size.y*2;
        this.directMembers = [];

        this.voterColor = 'var(--voterGray)';
    }

    refreshMembers(){
        this.members = this.members.filter(o => o.camp == this);
        this.directMembers = this.directMembers.filter(o => o.camp == this);
    }

    update(simState){
        if(this.directMembers.length >= 12 || this.directMembers.length == this.members.length){
            this.directMembers.forEach(o => {
                o.vel = new Vector(0);
                o.phyMass = -2
            });
        }

        this.voterColor = 'var(--voterGray)';
        if(this.startR > 5){
            let colors = simState.pie.allPieColors[simState.runoffStage];
            if(simState.pie.points[5] < this.pieThresh || this.pieThresh < simState.pie.points[0]) this.voterColor = colors[0];
            if(simState.pie.points[1] < this.pieThresh && this.pieThresh < simState.pie.points[2]) this.voterColor = colors[1];
            if(simState.pie.points[3] < this.pieThresh && this.pieThresh < simState.pie.points[4]) this.voterColor = colors[2];
        }
    }

    asComponent(simState, containerSize) {
        return <div className={this.getClassNames(simState)} style={this.getStyle(containerSize)}>
            {this.members.length > 0 &&
                <p>{this.members.length}</p>
            }
        </div>;
    }

}

export default VoterCamp
