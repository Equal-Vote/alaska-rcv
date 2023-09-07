import { useEffect, useRef, useState, useCallback } from "react";
import Voter from "./Voter";
import VoterCamp from "./VoterCamp";

const Simulation = () => {
    let [bool, setBool] = useState(false);
    let stateIndex = useRef(0);
    let objects = useRef([]);
    let camps = useRef({});
    let animID = useRef(null);
    let simRef = useRef(null);
    const handleKeyPress = useCallback((event) => {
        if(event.key != 'a') return;
        switch(++stateIndex.current){
        case 1: moveVoters(12, 'home', 'begich_bullet'); break;  
        case 2: moveVoters(29, 'home', 'begich_then_palin'); break;  
        case 3: moveVoters(36, 'home', 'palin_then_begich'); break;  
        case 4: moveVoters(23, 'home', 'palin_bullet'); break;  
        case 5: moveVoters( 4, 'home', 'palin_then_peltola'); break;  
        case 6: moveVoters( 5, 'home', 'peltola_then_palin'); break;  
        case 7: moveVoters(25, 'home', 'peltola_bullet'); break;  
        case 8: moveVoters(50, 'home', 'peltola_then_begich'); break;  
        case 9: moveVoters(16, 'home', 'begich_then_peltola'); break;  
        }
        //if(stateIndex.current % 2 == 0){
        //}else{

        //}
    }, []);

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);

        // remove the event listener
        return () => {
        document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    const initSim = () => {
        let voter_radius = 30;
        let candidate_radius = 40;
        camps.current = {
            home: new VoterCamp(0, 0),
            begich_bullet: new VoterCamp(voter_radius, 90),
            begich_then_palin: new VoterCamp(voter_radius, 60),
            palin_then_begich: new VoterCamp(voter_radius, 0),
            palin_bullet: new VoterCamp(voter_radius, 330),
            palin_then_peltola: new VoterCamp(voter_radius, 300),
            peltola_then_palin: new VoterCamp(voter_radius, 240),
            peltola_bullet: new VoterCamp(voter_radius, 210),
            peltola_then_begich: new VoterCamp(voter_radius, 180),
            begich_then_peltola: new VoterCamp(voter_radius, 120),
        }
        
        //objects.current.push(new VoterCamp(1,0));

        Object.entries(camps.current).forEach(([_, o]) => {
            objects.current.push(o);
        });
        for(var i = 0; i < 200; i++){
            objects.current.push(new Voter(80+Math.random()*10, (i/200)*360, camps.current.home));
        }
        //let n = 3;
        //for(var i = 0; i < n; i++){
        //    objects.current.push(new Voter(.001, i*(360/n), camps.current.home));
        //}
    }

    const moveVoters = (n, from, to) => {
        objects.current
            .filter(o => o instanceof Voter)
            .filter(o => o.camp == camps.current[from])
            .sort((l, r) => {
                let dist = (o) => o.pos.subtract(camps.current[ to ].pos).magnitude();
                return dist(l) - dist(r);
            })
            .filter( (_, i) => i < n)
            .forEach( o => o.camp = camps.current[to]
        );

        camps.current[from].refreshMembers();
    }

    const gameLoop = (timestamp) => {
        let objs = objects.current;
        // init
        if(objs.length == 0){
            initSim();
        }

        // update
        objs.forEach(o => o.update());

        // move
        objs.forEach(o => o.applyVelocity());

        // collisions
        // TODO: figure out cthener way to iterate over all pair
        // TODO: we might do more passes to get more accurate results, but this is fine for now
        let any_collision = true;
        let k = 0;
        let max_steps = 20;
        while(any_collision && k < max_steps){
            any_collision = false;
            let phy_objs = objs.filter(o => o.phy_mass != -1);
            for(var i = 0; i < phy_objs.length; i++){
                for(var j = i+1; j < phy_objs.length; j++){
                    any_collision = phy_objs[i].tryCollision(phy_objs[j]) || any_collision;
                }
            }
            k++;
        }

        // this is an attempt to detect unnecessary rotations
        //if(k == max_steps){
        //    objs.forEach(o => o.revertPos());
        //}


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
