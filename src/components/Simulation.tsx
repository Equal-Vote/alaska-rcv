// @ts-nocheck
import { useContext, useEffect, useRef, useState } from "react";
import { SimContext } from '../SimContext';
import Nav from "./Nav";
import Voter from "./Voter";
import { Box } from "@mui/material";
import GameObject from "./GameObject";

const Simulation = () => {
    let [bool, setBool] = useState(false);
    let animID = useRef(null);
    let simRef = useRef(null);

    const {simState} = useContext(SimContext);

    const gameLoop = (timestamp) => {
        let objs = simState.objects;

        // update
        objs.forEach(o => o.update(simState));

        // only do these steps if voters are visible

        let allObjsAreMember = objs.reduce((prev, obj) => prev && (obj.className != 'Voter' || obj.isMember()), true)
        if(allObjsAreMember) simState.activeFrames--;
        let isMobile = (window.innerWidth < 900);
        if(!isMobile || (simState.visible.includes(Voter) && simState.activeFrames > 0)){
            // collisions
            // TODO: figure out cthener way to iterate over all pair
            // TODO: we might do more passes to get more accurate results, but this is fine for now
            let anyCollision = true;
            let k = 0;
            let max_steps = 15;
            let awakeObjects = objs.filter(o => o.phyMass != undefined && o.awake);
            let asleepObjects = objs.filter(o => o.phyMass != undefined && !o.awake);

            // move
            awakeObjects.forEach(o => o.applyVelocity());

            let ii = 0;
            while(anyCollision && k < max_steps){
                anyCollision = false;
                for(var i = 0; i < awakeObjects.length; i++){
                    for(var j = i+1; j < awakeObjects.length; j++){
                        ii++;
                        anyCollision = awakeObjects[i].tryCollision(awakeObjects[j]) || anyCollision;
                    }
                }

                for(var i = 0; i < awakeObjects.length; i++){
                    for(var j = 0; j < asleepObjects.length; j++){
                        ii++;
                        anyCollision = awakeObjects[i].tryCollision(asleepObjects[j]) || anyCollision;
                    }
                }

                k++;
            }
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
        <div className="simPanel">
            <div ref={simRef} className='simulation'>
                {simState.objects.map((o, i) => <Box key={i}>{o.asComponent(
                    simState, simRef.current == null ? 800 : simRef.current.clientHeight
                )}</Box>)}
            </div>
        </div>
    )
}

export default Simulation
