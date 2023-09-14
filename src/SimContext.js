import Voter from './components/Voter';
import VoterCamp from './components/VoterCamp';
import {createContext, useRef, useCallback, useEffect, useState} from 'react';

class VoterMovement{
    constructor(count, from, to){
        this.count = count;
        this.from = from;
        this.to = to;
    }

    move(n, from, to, simState){
        simState.objects
            .filter(o => o instanceof Voter)
            .filter(o => o.camp == simState[from])
            .sort((l, r) => {
                let dist = (o) => o.pos.subtract(simState[ to ].pos).magnitude();
                return dist(l) - dist(r);
            })
            .filter( (_, i) => i < n)
            .forEach( o => {
                o.camp = simState[to];
                o.phyMass = 1;
            });

        simState[from].refreshMembers();
    }

    apply(simState){
        this.move(this.count, this.from, this.to, simState);
    }

    revert(simState){
        this.move(this.count, this.to, this.from, simState);
    }
}

class SimTransition{
    constructor({visible=[], focused=[], explainer=<></>, voterMovement=undefined, sticky=false}){
        this.visible = visible;
        this.focused = focused;
        this.voterMovement = voterMovement;

        this.explainer = explainer;
        this.sticky = sticky;
    }

    apply(simState){
        simState.visible = this.visible;
        simState.focused = this.focused;
        if(this.voterMovement != undefined){
            this.voterMovement.apply(simState);
        }
        simState.explainerEnd++;
        if(!this.sticky) simState.explainerStart = simState.explainerEnd-1;
    }

    revert(simState){
        this.voterMovement.revert(simState);
    }
}

const transitions = [
    // moving voters
    new SimTransition({
        explainer: <h1>Begich Bullet Voters</h1>,
        voterMovement: new VoterMovement(12, 'home', 'begich_bullet')
    }),
    new SimTransition({
        explainer: <h1>Begich Then Palin Voters</h1>,
        voterMovement: new VoterMovement(29, 'home', 'begich_then_palin'),
    }),
    new SimTransition({
        explainer: <h1>Palin Then Begich Voters</h1>,
        voterMovement: new VoterMovement(36, 'home', 'palin_then_begich'),
    }),
    new SimTransition({
        explainer: <h1>Palin Bullet</h1>,
        voterMovement: new VoterMovement(23, 'home', 'palin_bullet'),
    }),
    new SimTransition({
        explainer: <h1>Palin Then Peltola</h1>,
        voterMovement: new VoterMovement( 4, 'home', 'palin_then_peltola'),
    }),
    new SimTransition({
        explainer: <h1>Peltola Then Palin</h1>,
        voterMovement: new VoterMovement( 5, 'home', 'peltola_then_palin'),
    }),
    new SimTransition({
        explainer: <h1>Peltola Bullet</h1>,
        voterMovement: new VoterMovement(25, 'home', 'peltola_bullet'),
    }),
    new SimTransition({
        explainer: <h1>Peltola Then Begich</h1>,
        voterMovement: new VoterMovement(50, 'home', 'peltola_then_begich'),
    }),
    new SimTransition({
        explainer: <h1>Begich Then Peltola</h1>,
        voterMovement: new VoterMovement(16, 'home', 'begich_then_peltola'),
    }),
];

export const SimContext = createContext({});

export function SimContextProvider({children}){
    let simState = useRef(initSimContext()).current;
    let [simIndex, setSimIndex] = useState(0);

    function initSimContext(){
        let voter_radius = 30;
        //let candidate_radius = 40;
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
        };

        let objects = [];
        
        Object.entries(ctx).forEach(([_, o]) => {
            objects.push(o);
        });
        for(var i = 0; i < 200; i++){
            objects.push(new Voter(80+Math.random()*10, (i/200)*360, ctx.home));
        }
        ctx.objects = objects;

        ctx.allExplainers = transitions.map(t => t.explainer);

        ctx = {...ctx, objects, visible: [], focused: [], explainerStart: -1, explainerEnd: 0}

        return ctx;
    }

    const handleKeyPress = useCallback((event) => {
        if(event.key != 'a') return;

        // this was a hacky way to make sure we're using the correct simIndex
        setSimIndex((simIndex) => {
            transitions[simIndex].apply(simState)
            return simIndex+1
        });
    }, []);

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return <SimContext.Provider value={{simState, simIndex}}>{children}</SimContext.Provider>;
}