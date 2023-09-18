import GameObject from "./GameObject";
import Vector from "./Vector";
import VoterCamp from "./VoterCamp";

const startMass = 1;
const startGrav = .08;

class Voter extends GameObject{

    constructor(r, angle, camp) {
        super('Voter', r, angle, 1.7, startMass);
        this.camp = camp;
        this.startPos = this.pos.clone();
        this.grav = startGrav;
    }

    update(){
        super.update();
        if(this.camp != undefined && !this.isMember()){
            this.phyMass *= 1.01;
            this.grav *= 1.01;
        }else{
            this.grav = startGrav; 
            if(!this.isDirectMember()) this.phyMass = startMass;
        }
        if(this.camp == undefined){
            this.pos = this.startPos.clone();
            this.vel = new Vector(0);
        }else{
            let toCamp = this.camp.pos.subtract(this.pos);
            if(this.grav > .1){
                console.log(this.grav)
            }
            if(this.grav > .16){
                toCamp = toCamp.add(new Vector(Math.random(), Math.random()).scale(this.grav * .25))
            }
            this.vel = this.vel.add(toCamp.scaleTo(this.grav));
        }
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

    isDirectMember(){
        return this.camp != undefined && this.camp.directMembers.includes(this);
    }

    isFocused(simState){
        return this.isMember() && this.camp.isFocused(simState);
    }

    onCollide(other){
        if(other==this.camp){
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
