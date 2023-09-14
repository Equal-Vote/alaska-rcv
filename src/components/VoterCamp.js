import GameObject from "./GameObject"
import Vector from "./Vector";

class VoterCamp extends GameObject{
    constructor(r, angle) {
        super(r, angle, 3.5, -1)
        this.members = [];
        this.size.x = this.size.y*2;
        this.directMembers = [];
    }

    refreshMembers(){
        this.members = this.members.filter(o => o.camp == this);
        this.directMembers = this.directMembers.filter(o => o.camp == this);
    }

    update(){
        //let target = 5 + this.members.length / 10;
        //let t = .1;
        //this.size = this.size*(1-t) + target*t;
        if(this.directMembers.length >= 12 || this.directMembers.length == this.members.length){
            this.directMembers.forEach(o => {
                o.vel = new Vector(0);
                o.phyMass = -2
            });
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
