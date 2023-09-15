import Voter from './components/Voter';
import VoterCamp from './components/VoterCamp';
import ImageObject from './components/ImageObject';
import {createContext, useRef, useCallback, useEffect, useState} from 'react';
import { transitions } from './Transitions';
import Candidate from './components/Candidate';

export const SimContext = createContext({});

export function SimContextProvider({children}){
    let simState = useRef(initSimContext()).current;
    let [simIndex, setSimIndex] = useState(0);

    function initSimContext(){
        let voter_radius = 30;
        let candidate_radius = 43;
        let ctx = {
            // images
            choose_one: new ImageObject(0, 0, 70, 'images/chooseOneBallot.png'),
            alaska: new ImageObject(0, 0, 70, 'images/alaska.png'),
            // candidates
            begich: new Candidate(candidate_radius, 90, 'begich'),
            palin: new Candidate(candidate_radius, 330, 'palin'),
            peltola: new Candidate(candidate_radius, 210, 'peltola'),
            // camps
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

        ctx.allExplainers = transitions.map(t => {return {explainer: t.explainer, delay: t.explainerDelaySeconds}});

        ctx = {...ctx, objects, visible: [], focused: [], explainerStart: -1, explainerEnd: 0}

        ctx.visibleObjects = function(){
            return this.objects.filter(o => o.isVisible(this));
        }

        transitions[0].apply(ctx);

        return ctx;
    }

    const handleKeyPress = useCallback((event) => {
        if(event.key == 'a'){
            setSimIndex((simIndex) => {
                if(simIndex == transitions.length-1) return simIndex;
                transitions[simIndex+1].apply(simState)
                return simIndex+1;
            });
        }
        if(event.key == 'z'){
            setSimIndex((simIndex) => {
                if(simIndex == 0) return simIndex;
                transitions[simIndex].revert(simState);
                transitions[simIndex-1].applyState(simState);
                return simIndex-1;
            });
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

    return <SimContext.Provider value={{simState, simIndex}}>{children}</SimContext.Provider>;
}