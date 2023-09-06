import { useEffect, useRef, useState } from "react";
import Voter from "./Voter";

const Simulation = () => {
    let objects = useRef([]);
    let animID = useRef(null);
    let [bool, setBool] = useState(false);
    let simRef = useRef(null);

    const initSim = () => {
        for(let i = 0; i < 360; i += 22.5){
            objects.current.push(new Voter(30+-1+2*Math.random(), i));
        }
    }

    const gameLoop = (timestamp) => {
        let objs = objects.current;
        // init
        if(objs.length == 0){
            initSim();
        }

        // update
        objs.forEach(o => o.update());

        // collisions
        // TODO: figure out cleaner way to iterate over all pair
        // TODO: we might do more passes to get more accurate results, but this is fine for now
        let phy_objs = objs.filter(o => o.phy_mass != -1);
        for(var i = 0; i < phy_objs.length; i++){
            for(var j = i+1; j < phy_objs.length; j++){
                objs[i].tryCollision(objs[j]);
            }
        }

        // move
        objs.forEach(o => o.applyVelocity());

        // refresh
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
