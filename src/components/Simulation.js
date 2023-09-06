import { useEffect, useRef, useState } from "react";

class Vector{
    constructor(x, y=undefined){
        this.x = x;
        this.y = y ?? x;
    }

    scale(f){
        return new Vector(this.x * f, this.y * f);
    }

    add(v){
        return new Vector(this.x + v.x, this.y + v.y);
    }

    asTranslate(){
        return `translate(${this.x}px, ${this.y}px)`;
    }
}

class GameObject {
    constructor(r, angle, size){
        this.x = r * Math.cos(Math.PI*angle/180);
        this.y = r * Math.sin(Math.PI*angle/180);
        this.size = size;
    }

    getStyle(containerSize){
        return {
            width: `${this.size}%`,
            height: `${this.size}%`,
            transform: new Vector(.5).add(new Vector(-.5 * this.size / 100)).add(new Vector(this.x /100, this.y /100)).scale(containerSize).asTranslate(),
        }
    } 

    asComponent(containerSize){
        return <div className='object' style={this.getStyle(containerSize)}/>
    }
}

const Simulation = () => {
    let objects = useRef([]);
    let animID = useRef(null);
    let [bool, setBool] = useState(false);
    let simRef = useRef(null);

    const gameLoop = (timestamp) => {
        if(objects.current.length == 0){
            for(let i = 0; i < 360; i += 22.5){
                objects.current.push(new GameObject(30, i, 10));
            }
        }else{
            // objects.current.forEach(o => o.x += 5);
        }

        setBool(bool => !bool);
        animID.current = requestAnimationFrame(gameLoop);
    }

    useEffect(() => {
        animID.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animID.current);
    }, [])

    return (
        <div ref={simRef} className='simulation'>
            {objects.current.map(o => o.asComponent(simRef.current.clientHeight))}
        </div>
    )
}

export default Simulation
