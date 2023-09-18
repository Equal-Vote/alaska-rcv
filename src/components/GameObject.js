import { toHaveDisplayValue } from "@testing-library/jest-dom/matchers";
import { Vector } from "./Vector";

export class GameObject {
    constructor(className, r, angle, size, phyMass=undefined, customClass='') {
        // undefined means don't do physics, negative means static
        this.pos = new Vector(r, angle, true);
        this.vel = new Vector(0);
        this.size = new Vector(size);
        this.phyMass = phyMass;
        this.simKey = undefined;
        this.customClass = customClass;
        this.prevFocused = true;
        this.className = className;
    }

    getStyle(containerSize) {
        return {
            borderWidth: `${Math.round(0.002 * containerSize)}px`,
            fontSize: `${Math.round(0.03 * containerSize)}px`,
            width: `${this.size.x}%`,
            height: `${this.size.y}%`,
            transform: new Vector(50)
                .add(this.pos)
                .add(this.size.scale(-.5))
                .scale(containerSize / 100)
                .asTranslate(),
        };
    }

    getClassNames(simState){
        let classes = [
            'object',
            this.className,
            // constructor.name <- I can't use this one since github pages breaks it after deployment
            this.customClass,
        ];
        if(this.isVisible(simState) != undefined) classes.push(this.isVisible(simState)? 'objectVisible': 'objectInvisible')
        if(this.isFocused(simState) != undefined) classes.push(this.isFocused(simState)? 'objectFocused': 'objectUnfocused')
        return classes.join(' ');
    }

    asComponent(simState, containerSize) {
        return <div className={this.getClassNames(simState)} style={this.getStyle(containerSize)} />;
    }

    getSimKey(simState){
        if(this.simKey != undefined) return this.simKey;
        let arr = Object.entries(simState).filter(([k, v]) => v == this);
        if(arr.length == 0){
            this.simKey = '';
        }else{
            this.simKey = arr[0][0];
        }
        return this.simKey;
    }

    update(simState){
        this.vel = this.vel.scale(.9); // friction
    }

    canCollidWith(other){ return true; }

    isFocused(simState){
        let _isFocused = () => {
            if(simState.focused.includes(this.constructor)) return true;
            let key = this.getSimKey(simState);
            if(key == '') return false;
            return simState.focused.includes(key);
        }

        if(simState.focused.length > 0) this.prevFocused = _isFocused();

        // prevFocused is a hack to ensure the z-index does't immediately change when transitioning
        return this.prevFocused;
    }

    isVisible(simState){
        if(simState.visible.includes(this.constructor)) return true;
        let key = this.getSimKey(simState);
        if(key == '') return false;
        return simState.visible.includes(key);
    }
    
    onCollide(other){}

    applyVelocity(){
        this.pos = this.pos.add(this.vel);
    }

    radius(){
        return this.size.x / 2;
    }

    tryCollision(other){
        if(!this.canCollidWith(other) || ! other.canCollidWith(this)) return;

        let diff = this.pos.subtract(other.pos);
        
        // normalize
        diff = diff.scale(this.size.add(other.size).scale(.5).invert());

        let thresh = 1;

        if(diff.magnitude() > thresh) return false;

        let overlap = diff.scaleTo(thresh - diff.magnitude())
        overlap = overlap.scale(this.size.add(other.size).scale(.5));

        let t = 0;
        if(this.phyMass > 0 && other.phyMass > 0 ){
            t = this.phyMass / (this.phyMass + other.phyMass);
        }else if(this.phyMass > 0){
            t = 0;
        }else if(other.phyMass > 0){
            t = 1;
        }else if(this.phyMass == other.phyMass){
            t = .5;
        }else{
            t = (this.phyMass > other.phyMass)? 1 : 0;
        }

        this.pos = this.pos.add(overlap.scale(1-t));
        other.pos = other.pos.add(overlap.scale(-t));

        other.onCollide(this);
        this.onCollide(other);

        return true;
    }
}

export default GameObject
