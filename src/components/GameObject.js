import { Vector } from "./Vector";
import Voter from "./Voter";

export class GameObject {
    constructor(r, angle, size, phy_mass=-1) {
        this.pos = new Vector(r, angle, true);
        this.vel = new Vector(0);
        this.size = size;
        this.phy_mass = phy_mass;
        this.prev_pos = this.pos.clone();
    }

    getStyle(containerSize) {
        return {
            border: `${Math.round(0.002 * containerSize)}px solid gray`,
            width: `${this.size}%`,
            height: `${this.size}%`,
            transform: new Vector(0.5).add(new Vector(-0.5 * this.size / 100)).add(this.pos.scale(1/100)).scale(containerSize).asTranslate(),
        };
    }

    asComponent(containerSize) {
        return <div className='object' style={this.getStyle(containerSize)} />;
    }

    update(){
        this.vel = this.vel.scale(.9); // friction
    }
    
    onCollide(other){}

    applyVelocity(){
        this.prev_pos = this.pos.clone();
        this.pos = this.pos.add(this.vel);
    }

    revertPos(){
        this.pos = this.prev_pos.clone();
    }

    tryCollision(other){
        let diff = this.pos.subtract(other.pos);
        let thresh = (this.size + other.size) / 2;
        if(diff.magnitude() > thresh) return false;

        let overlap = diff.scaleTo(thresh - diff.magnitude())

        let t = this.phy_mass / (this.phy_mass + other.phy_mass);
        this.pos = this.pos.add(overlap.scale(1-t));
        other.pos = other.pos.add(overlap.scale(-t));

        other.onCollide(this);
        this.onCollide(other);

        return true;
    }
}

export default GameObject