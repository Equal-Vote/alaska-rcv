import { useContext, useEffect, useRef, useState } from "react";
import { SimContext } from '../SimContext';

const Simulation = () => {
    let [bool, setBool] = useState(false);
    let animID = useRef(null);
    let simRef = useRef(null);

    const {simState} = useContext(SimContext);

    const gameLoop = (timestamp) => {
        let objs = simState.visibleObjects();

        // update
        objs.forEach(o => o.update(simState));

        // move
        objs.forEach(o => o.applyVelocity());

        // collisions
        // TODO: figure out cthener way to iterate over all pair
        // TODO: we might do more passes to get more accurate results, but this is fine for now
        let anyCollision = true;
        let k = 0;
        let max_steps = 15;
        while(anyCollision && k < max_steps){
            anyCollision = false;
            let phyObjs = objs.filter(o => o.phyMass != undefined);
            for(var i = 0; i < phyObjs.length; i++){
                for(var j = i+1; j < phyObjs.length; j++){
                    anyCollision = phyObjs[i].tryCollision(phyObjs[j]) || anyCollision;
                }
            }
            k++;
        }

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
            {simState.objects.map(o => o.asComponent(simState, simRef.current == null ? 800 : simRef.current.clientHeight))}
        </div>
    )
}

export default Simulation
