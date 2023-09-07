import GameObject from "./GameObject"
import Vector from "./Vector";

class Voter extends GameObject{
    constructor(r, angle, resize=true) {
        super(r, angle, 5, 10000000)
        this.members = [];
        this.resize = resize;
    }

    refreshMembers(){
        this.members = this.members.filter(o => o.camp == this);
    }

    //update(){
    //    let target = 5 + this.members.length / 10;
    //    let t = .1;
    //    this.size = this.size*(1-t) + target*t;
    //}
}

export default Voter
