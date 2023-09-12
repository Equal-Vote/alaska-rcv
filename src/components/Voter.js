import GameObject from "./GameObject"
import Vector from "./Vector";
import VoterCamp from "./VoterCamp"

const startMass = 1;

class Voter extends GameObject{

    constructor(r, angle, camp) {
        super(r, angle, 2, startMass);
        this.camp = camp;
    }

    update(){
        super.update();
        let grav = .08;
        let toCamp = this.camp.pos.subtract(this.pos);
        this.vel = this.vel.add(toCamp.scaleTo(grav));
        //if(!this.isMember()) this.phyMass = this.startMass;

        // more extreme friction once we're touching the thing
        //if(this.phyMass < 0) this.vel = this.vel.scale(.95);
    }

    isMember(){
        return this.camp.members.includes(this);
    }

    onCollide(other){
        if(other==this.camp){
            //this.phyMass = -2;
            if(!this.camp.directMembers.includes(this)){
                other.directMembers.push(this);
            }
            if(!this.isMember()){
                other.members.push(this);
            }
        }

        if(this.isMember()){
            if(other instanceof Voter && !other.isMember() && this.camp == other.camp){
                this.camp.members.push(other);
            }
        }
    }

    asComponent(containerSize) {
        // ${(this.phyMass < 0)? 'stable' : ''}
        return <div className={`object ${this.constructor.name}`} style={this.getStyle(containerSize)} />;
    }
}

export default Voter
