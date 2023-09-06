import { Vector } from "./Vector";

export class GameObject {
    constructor(r, angle, size, phy_mass=-1) {
        this.pos = new Vector(
            r * Math.cos(Math.PI * angle / 180),
            r * Math.sin(Math.PI * angle / 180)
        );
        this.vel = new Vector(0);
        this.normal = new Vector(0);
        this.size = size;
        this.phy_mass = phy_mass;
    }

    getStyle(containerSize) {
        return {
            border: `${Math.round(0.006 * containerSize)}px solid gray`,
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
    
    onCollide(){}

    applyVelocity(){
        this.pos = this.pos.add(this.vel);
        this.pos = this.pos.add(this.normal);
    }

    tryCollision(other){
        let diff = this.pos.subtract(other.pos);
        let thresh = (this.size + other.size) / 2;
        if(diff.magnitude() > thresh) return;

        let overlap = diff.scaleTo(thresh).scale(.04);

        let t = this.phy_mass / (this.phy_mass + other.phy_mass);
        this.vel = this.vel.add(overlap.scale(1-t));
        other.vel = other.vel.add(overlap.scale(-t));
    }
}

export default GameObject