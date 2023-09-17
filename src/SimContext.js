import Voter from './components/Voter';
import VoterCamp from './components/VoterCamp';
import ImageObject from './components/ImageObject';
import {createContext, useRef, useCallback, useEffect, useState} from 'react';
import { transitions } from './Transitions';
import Candidate from './components/Candidate';
import Pie from './components/Pie';
import VoterCount from './components/VoterCount';
import DarkenLayer from './components/DarkenLayer';

export const SimContext = createContext({});

export function SimContextProvider({children}){
    let simState = useRef(initSimContext()).current;
    let [simIndex, setSimIndex] = useState(0);

    function initSimContext(){
        let countRadius = 14;
        let voterRadius = 28;
        let candidateRadius = 43;
        let ctx = {
            // images
            choose_one: new ImageObject(0, 0, 70, 'images/chooseOneBallot.png'),
            alaska: new ImageObject(0, 0, 70, 'images/alaska.png'),
            condorcet: new ImageObject(0, 0, 100, 'images/condorcet.png'),
            // darken layer
            darken: new DarkenLayer(),
            // voter ring
            pie: new Pie(candidateRadius*2),
            // candidates
            begich: new Candidate(candidateRadius, 90, 'begich'),
            palin: new Candidate(candidateRadius, 330, 'palin'),
            peltola: new Candidate(candidateRadius, 210, 'peltola'),
            // counts
            begich_count: new VoterCount(countRadius, 90, 'begich', 0),
            palin_count: new VoterCount(countRadius, 330, 'palin', 1),
            peltola_count: new VoterCount(countRadius, 210, 'peltola', 2),
            // camps
            home: new VoterCamp(0, 0),
            begich_bullet: new VoterCamp(voterRadius, 90),
            begich_then_palin: new VoterCamp(voterRadius, 60),
            palin_then_begich: new VoterCamp(voterRadius, 0),
            palin_bullet: new VoterCamp(voterRadius, 330),
            palin_then_peltola: new VoterCamp(voterRadius, 300),
            peltola_then_palin: new VoterCamp(voterRadius, 240),
            peltola_bullet: new VoterCamp(voterRadius, 210),
            peltola_then_begich: new VoterCamp(voterRadius, 180),
            begich_then_peltola: new VoterCamp(voterRadius, 120),
        };

        let objects = [];
        
        Object.entries(ctx).forEach(([_, o]) => {
            objects.push(o);
        });
        for(var i = 0; i < 200; i++){
            objects.push(new Voter(80+Math.random()*10, (i/200)*360+.3, ctx.home));
        }
        ctx.objects = objects;

        ctx.allExplainers = transitions.map(t => {return t.explainer; });

        ctx = {...ctx, objects, visible: [], focused: [], runoffStage: 'default', explainerStart: -1, explainerEnd: 0}

        ctx.visibleObjects = function(){
            return this.objects.filter(o => o.isVisible(this));
        }

        transitions[0].apply(ctx);

        return ctx;
    }

    const updateSimIndex = (nextIndex) => {
        setSimIndex((simIndex) => {
            if(typeof nextIndex !== 'number') nextIndex = nextIndex(simIndex);
            if(nextIndex < 0) nextIndex = 0;
            if(nextIndex > transitions.length-1) nextIndex = transitions.length-1;
            while(simIndex != nextIndex){
                if(simIndex < nextIndex){
                    transitions[simIndex+1].apply(simState)
                    simIndex++;
                }
                if(simIndex > nextIndex){
                    transitions[simIndex].revert(simState);
                    transitions[simIndex-1].applyState(simState);
                    simIndex--;
                }
            }
            return nextIndex;
        })
    }

    const handleKeyPress = useCallback((event) => {
        if(event.key == 'a'){
            updateSimIndex(i => i+1);
        }
        if(event.key == 'z'){
            updateSimIndex(i => i-1);
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

    return <SimContext.Provider value={{simState, simIndex, updateSimIndex}}>{children}</SimContext.Provider>;
}