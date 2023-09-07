
export class Vector {
    constructor(x, y, radial=false) {
        if(!radial){
            this.x = x;
            this.y = y ?? x;
        }else{
            this.x = x * Math.cos(Math.PI * y / 180);
            this.y = x * -Math.sin(Math.PI * y / 180);
        }
    }

    scale(f) {
        return new Vector(this.x * f, this.y * f);
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    asTranslate() {
        return `translate(${this.x}px, ${this.y}px)`;
    }

    dist2(v){
        // squared distance
        return (this.x-v.x)*(this.x-v.x) + (this.y-v.y)*(this.y-v.y);
    }

    subtract(v){
        return new Vector(this.x-v.x, this.y-v.y);
    }

    magnitude(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    scaleTo(new_mag){
        let m = this.magnitude();
        if(m == 0) return new Vector(0);
        return this.scale(new_mag / m);
    }

}


export default Vector