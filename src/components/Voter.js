import GameObject from "./GameObject"
import Vector from "./Vector";

class Voter extends GameObject{
    constructor(r, angle, camp) {
        super(r, angle, 2, 1)
        this.camp = camp;
    }

    update(){
        super.update();
        let grav = .08;
        let toCamp = this.camp.pos.subtract(this.pos);
        //if(toCamp.magnitude() < 18) return;
        this.vel = this.vel.add(toCamp.scaleTo(grav));
    }
}

export default Voter
