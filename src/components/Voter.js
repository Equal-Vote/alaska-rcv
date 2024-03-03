import GameObject from "./GameObject";
import Vector from "./Vector";
import VoterCamp from "./VoterCamp";

const startMass = 1;
const startGrav = (window.innerWidth < 900)? .3 : .08;

class Voter extends GameObject{

    constructor(i, r, angle, camp) {
        //let maxROffset = 100;
        //r += maxROffset * (1 - (Math.min(Math.abs(angle-90), Math.abs(360 - Math.abs(angle-90))) / 180));
        super('Voter', r, angle, 1.7, startMass);
        this.index = i;
        this.finalCamp = camp;
        this.camp = undefined;
        this.startPos = this.pos.clone();
        this.grav = startGrav;
        this.prevCamp = undefined;
        this.awake = true;
        this.prevPos = undefined;
    }

    campName(simState){
        if(this.camp == undefined) return '';

        if(this.camp == simState.centerBullet) return 'centerBullet';
        if(this.camp == simState.centerThenRight) return 'centerThenRight';
        if(this.camp == simState.rightThenCenter) return 'rightThenCenter';
        if(this.camp == simState.rightBullet) return 'rightBullet';
        if(this.camp == simState.rightThenLeft) return 'rightThenLeft';
        if(this.camp == simState.leftThenRight) return 'leftThenRight';
        if(this.camp == simState.leftBullet) return 'leftBullet';
        if(this.camp == simState.leftThenCenter) return 'leftThenCenter';
        if(this.camp == simState.centerThenLeft) return 'centerThenLeft';
        if(this.camp == simState.home) return 'home';

        return 'none';
    }

    update(simState){
        if(this.prevCamp != this.camp){
            this.prevCamp = this.camp;
        }
        super.update();

        if(simState.activeFrames <= 0) return;

        //this.awake = simState.visible.includes(Voter) && (!this.isMember() || this.vel.magnitude() > .1);
        //this.awake = !this.isMember() || this.prevPos.subtract(this.pos).magnitude() > .1;
        //console.log(this.isMember(), this.camp != undefined, this.camp != undefined && this.camp.members.includes(this));

        //if(!this.awake){
        //    if(!this.isDirectMember()) this.phyMass = 5*startMass;
        //    return;
        //}

        this.prevPos = this.pos.clone();

        // randomly leave membership to make sure we can be reassigned (handles edge cases where membership was incorrect)
        if(Date.now() - simState.startTime > 3 * 60 * 1000 && (Math.random() * 60 * 5) < 1 ){ // once every 5 seconds(ish)
            if(this.camp != undefined && !this.isDirectMember()){
                this.camp.members.splice(this.camp.members.indexOf(this), 1);
            }
        }

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
            if(this.grav > startGrav * 2 && this.camp.getSimKey() != 'home' && this.camp != undefined){
                toCamp = toCamp.add(new Vector(Math.random(), Math.random()).scale(this.grav * .25))
            }
            //var m = 1.5;
            //if(this.vel.magnitude() > m) this.vel = this.vel.scaleTo(m); // moving before grav so chaos still works
            this.vel = this.vel.add(toCamp.scaleTo(this.grav));
        }
    }

    resetToStartPos(){
        this.pos = this.startPos.clone();
    }

    getStyle(containerSize){
        let exhausted = this.isMember() && this.pos.magnitude() > 43;
        let pri, sec;
        if(this.finalCamp != undefined && !exhausted){
            pri = this.finalCamp.primaryColor;
            sec = this.finalCamp.secondaryColor;
        }else{
            pri = 'var(--voterGray)';
            sec = 'black';
        }

        let isMobile = (window.innerWidth < 900);
        return {
            ...super.getStyle(containerSize),
            background: pri,
            border: `${Math.max(1, Math.round(0.002 * containerSize))}px solid ${sec}`
        }
    }

    //isVisible(simState){
    //    return super.isVisible(simState) && this.pos.magnitude() < 70;
    //}

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
