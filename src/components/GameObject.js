import { Vector } from "./Vector";
import Voter from "./Voter";

export class GameObject {
    constructor(r, angle, size, phy_mass=-1) {
        this.pos = new Vector(r, angle, true);
        this.vel = new Vector(0);
        //this.normal = new Vector(0);
        this.size = size;
        this.phy_mass = phy_mass;
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
        //this.normal = new Vector(0);
        this.vel = this.vel.scale(.9); // friction
    }
    
    onCollide(other){}

    applyVelocity(){
        this.pos = this.pos.add(this.vel);
        //this.pos = this.pos.add(this.normal);
    }

    tryCollision(other){
        let diff = this.pos.add(this.vel).subtract(other.pos.add(other.vel));
        //let diff = this.pos.add(this.vel.add(this.normal)).subtract(other.pos.add(other.vel.add(other.normal)));
        //let diff = this.pos.subtract(other.pos);
        let thresh = (this.size + other.size) / 2;
        if(diff.magnitude() > thresh) return;

        let overlap = diff.scale(.1);
        //if(overlap.magnitude() < .05) overlap.scaleTo(.05);

        let t = this.phy_mass / (this.phy_mass + other.phy_mass);
        this.vel = this.vel.add(overlap.scale(1-t));
        other.vel = other.vel.add(overlap.scale(-t));

        other.onCollide(this);
        this.onCollide(other);
    }
}

export default GameObject