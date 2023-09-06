import { useEffect, useRef, useState } from "react";
import Voter from "./Voter";
import VoterCamp from "./VoterCamp";

const Simulation = () => {
    let objects = useRef([]);
    let camps = useRef({});
    let animID = useRef(null);
    let [bool, setBool] = useState(false);
    let simRef = useRef(null);
    let moveTriggered = useRef(false);

    const initSim = () => {
        let voter_radius = 30;
        let candidate_radius = 40;
        camps.current = {
            home: new VoterCamp(0, 0),
            beigich_bullet: new VoterCamp(30, 90),
            beigich_lean_palin: new VoterCamp(30, 60),
            palin_lean_beigich: new VoterCamp(30, 0),
            palin_bullet: new VoterCamp(30, 330),
            palin_lean_peltola: new VoterCamp(30, 300),
            peltola_lean_palin: new VoterCamp(30, 240),
            peltola_bullet: new VoterCamp(30, 210),
            peltola_lean_beigich: new VoterCamp(30, 180),
            beigich_lean_peltola: new VoterCamp(30, 120),
        }
        for(var i = 0; i < 200; i++){
            objects.current.push(new Voter(80+10*Math.random(), (i/200)*360, camps.current.home));
        }
    }

    const moveVoters = (n, from, to) => {

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
