import GameObject from "./GameObject"
import VoterCamp from "./VoterCamp"

class Voter extends GameObject{
    constructor(r, angle, camp) {
        //let startMass = 1;
        super(r, angle, 2, 1)
        this.camp = camp;
    }

    update(){
        super.update();
        let grav = .08;
        let toCamp = this.camp.pos.subtract(this.pos);
        //if(toCamp.magnitude() < 5) return;
        this.vel = this.vel.add(toCamp.scaleTo(grav));
        //if(!this.isMember()) this.phyMass = this.startMass;
    }

    isMember(){
        return this.camp.members.includes(this);
    }

    onCollide(other){
        if(other==this.camp && !this.isMember()){
            //this.phyMass = 99999999;
            other.members.push(this);
        }

        if(this.isMember()){
            if(other instanceof Voter && !other.isMember() && this.camp == other.camp){
                this.camp.members.push(other);
            }
        }
    }
}

export default Voter
