import GameObject from "./GameObject";
import Vector from "./Vector";
import VoterCamp from "./VoterCamp";

const startMass = 1;
const startGrav = .08;

class Voter extends GameObject{

    constructor(r, angle, camp) {
        //let maxROffset = 100;
        //r += maxROffset * (1 - (Math.min(Math.abs(angle-90), Math.abs(360 - Math.abs(angle-90))) / 180));
        super('Voter', r, angle, 1.7, startMass);
        this.finalCamp = camp;
        this.camp = undefined;
        this.startPos = this.pos.clone();
        this.grav = startGrav;
        this.prevCamp = undefined;
    }

    update(){
        if(this.prevCamp != this.camp){
            this.prevCamp = this.camp;
        }
        super.update();
        if(this.camp != undefined && (!this.isMember() || (!this.isDirectMember() && !this.camp.directMembersLocked()))){
            // slowly inject chaos if we're stuck
            this.phyMass *= 1.01;
            this.grav *= 1.01;
        }else{
            this.grav = startGrav; 
            if(!this.isDirectMember()) this.phyMass = startMass;
        }
        if(this.camp == undefined){
            this.resetToStartPos();
            this.vel = new Vector(0);
        }else{
            let toCamp = this.camp.pos.subtract(this.pos);
            if(this.grav > .16){
                toCamp = toCamp.add(new Vector(Math.random(), Math.random()).scale(this.grav * .25))
            }
            var m = 1.5;
            if(this.vel.magnitude() > m) this.vel = this.vel.scaleTo(m); // moving before grav so chaos still works
            this.vel = this.vel.add(toCamp.scaleTo(this.grav));
        }
    }

    resetToStartPos(){
        this.pos = this.startPos.clone();
        if(this.finalCamp == undefined) return;
        let offset = [
            'rightBullet',
            'rightThenLeft',
            'rightThenCenter',
            'leftThenRight',
            'leftThenCenter',
            'leftBullet',
            'centerThenRight',
            'centerThenLeft',
            'centerBullet',
        ].indexOf(this.finalCamp.getSimKey());
        console.log(this.finalCamp.getSimKey(), offset);
        this.pos = this.pos.add(this.pos.scaleTo(offset*20));
    }

    clockAngle(){
        return ((-this.startPos.angle())+90+360)%360; // sorting clockwise from the top
    }

    getStyle(containerSize){
        let exhausted = this.isMember() && this.pos.magnitude() > 43;
        return {
            ...super.getStyle(containerSize),
            background: this.finalCamp != undefined && !exhausted ? this.finalCamp.primaryColor : 'var(--voterGray)',
            border: `${Math.round(0.002 * containerSize)}px solid ${this.finalCamp != undefined && !exhausted ? this.finalCamp.secondaryColor : 'black'}`,
        }
    }

    isMember(){
        return this.camp != undefined && this.camp.members.includes(this);
    }

    isDirectMember(){
        return this.camp != undefined && this.camp.directMembers.includes(this);
    }

    isFocused(simState){
        return !this.isMember() || this.camp.isFocused(simState);
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
