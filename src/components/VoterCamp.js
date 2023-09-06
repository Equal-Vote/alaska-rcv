import GameObject from "./GameObject"
import Vector from "./Vector";

class Voter extends GameObject{
    constructor(r, angle) {
        super(r, angle, 2, -1)
    }
}

export default Voter
