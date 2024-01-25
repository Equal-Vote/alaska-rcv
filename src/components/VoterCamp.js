import GameObject from "./GameObject"
import Vector from "./Vector";

class VoterCamp extends GameObject{
    constructor(r, angle, primaryColorIndex, secondaryColorIndex) {
        super('VoterCamp', r, angle, 3.5, -1)
        this.startPos = this.pos.clone();
        if(angle == 90){
            this.exhaustedPos = this.startPos.add(new Vector(1.1*r, angle-50, true));
        }else{
            this.exhaustedPos = this.startPos.add(new Vector(0, 30));
        }
        this.pieThresh = 100*(((360 - angle) + 90)%360) / 360;
        this.startR = r;
        this.angle = angle;
        this.members = [];
        this.size.x = this.size.y*2;
        this.directMembers = [];

        this.primaryColorIndex = primaryColorIndex;
        this.secondaryColorIndex = secondaryColorIndex;
        this.primaryColor = 'var(--voterGray)';
        this.secondaryColor = 'var(--voterGray)';
    }

    refreshMembers(){
        this.members = this.members.filter(o => o.camp == this);
        this.directMembers = this.directMembers.filter(o => o.camp == this);
        console.log('refresh', this.angle, this.members.length, this.directMembers.length)
    }

    // copied fro Pie.js
    indexToColor(simState, index){
        if(index == -1) return 'var(--pieGray)';
        return `var(--${simState.candidateNames[simState.electionName][index].toLowerCase()})`;
    }

    directMembersLocked(){
        return this.directMembers.length >= 13 || this.directMembers.length == this.members.length
    }

    update(simState){
        if(this.directMembersLocked()){
            this.directMembers.forEach(o => {
                o.vel = new Vector(0);
                o.phyMass = -2;
            });
        }

        // move to exhausted position
        let prevPos = this.pos.clone();
        let exhausted = simState.exhaustedCamp != undefined && simState[simState.exhaustedCamp] == this;
        this.pos = this.pos.lerpTo(exhausted? this.exhaustedPos : this.startPos, .07);
        let diff = this.pos.subtract(prevPos);
        this.members.forEach(mem => mem.pos = mem.pos.add(diff))

        // re-calculate color
        //if(exhausted){
        //    this.primaryColor = 'var(--voterGray)';
        //    this.secondaryColor = '#000000';
        //}else
        if(this.startR < 5){
            this.primaryColor = 'var(--voterGray)';
            this.secondaryColor = '#000000';
        }else{
            this.primaryColor = this.indexToColor(simState, this.primaryColorIndex);
            if(this.primaryColorIndex == this.secondaryColorIndex){
                this.secondaryColor = '#000000';
            }else{
                this.secondaryColor = this.indexToColor(simState, this.secondaryColorIndex);
            }
        }
        if(this.startR > 5){
            //let colors = simState.pie.allPieColors['firstRound'];
            //if(simState.pie.points[5] < this.pieThresh || this.pieThresh < simState.pie.points[0]) this.voterColor = this.indexToColor(simState, colors[0]);
            //if(simState.pie.points[1] < this.pieThresh && this.pieThresh < simState.pie.points[2]) this.voterColor = this.indexToColor(simState, colors[1]);
            //if(simState.pie.points[3] < this.pieThresh && this.pieThresh < simState.pie.points[4]) this.voterColor = this.indexToColor(simState, colors[2]);
        }
    }

    currentCandidateIndex(simState){
        let colors = simState.pie.allPieColors['firstRound'];
        if(simState.pie.points[5] < this.pieThresh || this.pieThresh < simState.pie.points[0]) return colors[0];
        if(simState.pie.points[1] < this.pieThresh && this.pieThresh < simState.pie.points[2]) return colors[1];
        if(simState.pie.points[3] < this.pieThresh && this.pieThresh < simState.pie.points[4]) return colors[2];
        return -1;
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
