import GameObject from "./GameObject"
import Vector from "./Vector";

class Voter extends GameObject{
    constructor(r, angle) {
        super(r, angle, 2, 1)
    }

    update(){
        super.update();
        let grav = .08;
        let toCenter = new Vector(0).subtract(this.pos);
        this.vel = this.vel.add(toCenter.scaleTo(grav));
    }
}

export default Voter
