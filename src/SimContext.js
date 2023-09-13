import Voter from './components/Voter';
import VoterCamp from './components/VoterCamp';
import {createContext, useRef, useCallback, useEffect} from 'react';

function initSimContext(){
    let voter_radius = 30;
    let candidate_radius = 40;
    let ctx = {
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

    let objects = [];
    
    Object.entries(ctx).forEach(([_, o]) => {
        objects.push(o);
    });
    for(var i = 0; i < 200; i++){
        objects.push(new Voter(80+Math.random()*10, (i/200)*360, ctx.home));
    }
    ctx.objects = objects;
    ctx = {...ctx, objects, visible: [], focused: [], explainers: []}
    return ctx;
}

export const SimContext = createContext({});

export function SimContextProvider({children}){
    let simState = useRef(initSimContext());
    let simIndex = useRef(0);

    const handleKeyPress = useCallback((event) => {
        if(event.key != 'a') return;

        const moveVoters = (n, from, to) => {
            simState.current.objects
                .filter(o => o instanceof Voter)
                .filter(o => o.camp == simState.current[from])
                .sort((l, r) => {
                    let dist = (o) => o.pos.subtract(simState.current[ to ].pos).magnitude();
                    return dist(l) - dist(r);
                })
                .filter( (_, i) => i < n)
                .forEach( o => {
                    o.camp = simState.current[to];
                    o.phyMass = 1;
                });

            simState.current[from].refreshMembers();
        }

        switch(++simIndex.current){
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
    }, []);

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return <SimContext.Provider value={simState.current}>{children}</SimContext.Provider>;
}