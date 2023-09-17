import GameObject from "./GameObject";
import VoterCamp from "./VoterCamp";

const startMass = 1;

class Voter extends GameObject{

    constructor(r, angle, camp) {
        super(r, angle, 1.7, startMass);
        this.camp = camp;
    }

    update(){
        super.update();
        let grav = .08;
        let toCamp = this.camp.pos.subtract(this.pos);
        this.vel = this.vel.add(toCamp.scaleTo(grav));
    }

    getStyle(containerSize){
        return {
            ...super.getStyle(containerSize),
            background: this.isMember() ? this.camp.voterColor : 'var(--voterGray)',
            border: `${Math.round(0.002 * containerSize)}px solid black`,
        }
    }

    isMember(){
        return this.camp != undefined && this.camp.members.includes(this);
    }

    isFocused(simState){ return this.isMember() && this.camp.isFocused(simState); }

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

    canCollidWith(other){
        return !(other instanceof VoterCamp && other != this.camp);
    }
}

export default Voter
