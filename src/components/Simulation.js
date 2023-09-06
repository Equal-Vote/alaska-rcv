import { useEffect, useRef, useState } from "react";

class GameObject {
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        console.log(x, y, size);
    }

    getStyle(){
        return {
            width: `${this.size}px`,
            height: `${this.size}px`,
            transform: `translate(${this.x}px, ${this.y}px)`
        }
    } 

    asComponent(){
        return <div className='object' style={this.getStyle()}/>
    }
}

const Simulation = () => {
    let objects = useRef([]);
    let animID = useRef(null);
    let [bool, setBool] = useState(false);

    const gameLoop = (timestamp) => {
        console.log(timestamp, objects.current);
        if(objects.current.length == 0){
            for(let i = 0; i < 10; i++){
                objects.current.push(new GameObject(
                    Math.random()*500,
                    Math.random()*500,
                    10+Math.random()*60,
                ))
            }
        }else{
            objects.current.forEach(o => o.x += 5);
        }

        setBool(bool => !bool);
        animID.current = requestAnimationFrame(gameLoop);
    }

    useEffect(() => {
        animID.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animID.current);
    }, [])

    return (
        <div className='simulation'>
            {objects.current.map(o => o.asComponent())}
        </div>
    )
}

export default Simulation
