import Voter from './components/Voter';
import VoterCamp from './components/VoterCamp';
import ImageObject from './components/ImageObject';
import {createContext, useRef, useCallback, useEffect, useState} from 'react';
import transitions from './Transitions';
import Candidate from './components/Candidate';
import Pie from './components/Pie';
import VoterCount from './components/VoterCount';
import DarkenLayer from './components/DarkenLayer';
import VideoEmbed from './components/VideoEmbed';

export const SimContext = createContext({});

export function SimContextProvider({children}){
    let [refreshBool, setRefreshBool] = useState(false);
    let simState = useRef(initSimContext()).current;
    let simIndex = useRef(0);

    function initSimContext(){
        let countRadius = 14;
        let voterRadius = 28;
        let candidateRadius = 43;
        let candidateNames = {
            'alaska-2022': ['begich', 'palin', 'peltola'],
            'burlington-2009': ['montroll', 'wright', 'kiss'],
        };
        let ctx = {
            // embed (must be on top so that it's interactable)
            star_vs_rcv_embed: new VideoEmbed(100, 'https://www.youtube.com/embed/Nu4eTUafuSc?si=W5a3y5rQ4ZJ50CmS'),
            // images
            choose_one: new ImageObject(0, 0, 70, 'chooseOneBallot.png'),
            alaska: new ImageObject(0, 0, 70, 'alaska.png'),
            begich_beats_palin: new ImageObject(0, 0, 100, 'begichBeatsPalin.png'),
            begich_beats_peltola: new ImageObject(0, 0, 100, 'begichBeatsPeltola.png'),
            peltola_beats_palin: new ImageObject(0, 0, 100, 'peltolaBeatsPalin.png'),
            us_failures: new ImageObject(25, 90, 60, 'usRCVFailures.png', 'contain'),
            expected_failures: new ImageObject(25, 270, 60, 'expectedRCVFailures.png', 'contain'),
            // darken layer
            darken: new DarkenLayer(),
            // voter ring
            pie: new Pie(candidateRadius*2),
            // candidates
            begich: new Candidate(candidateRadius, 90, 0),
            palin: new Candidate(candidateRadius, 330, 1),
            peltola: new Candidate(candidateRadius, 210, 2),
            // counts
            begich_count: new VoterCount(countRadius, 90, 0),
            palin_count: new VoterCount(countRadius, 330, 1),
            peltola_count: new VoterCount(countRadius, 210, 2),
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
            objects.push(new Voter(80+Math.random()*10, (i/200)*360+.3, undefined));
        }
        ctx.objects = objects;



        ctx = {...ctx, objects, visible: [], focused: [], runoffStage: 'default', electionName: 'alaska-2022',
        selectorElection:'burlington-2009', selectorFailure:'condorcet', candidateNames}

        // must be after the { ... } since that breaks the reference
        ctx.transitions = transitions(ctx, setRefreshBool);

        ctx.allExplainers = ctx.transitions.map(t => {return t.explainer; });

        ctx.visibleObjects = function(){
            return this.objects.filter(o => o.isVisible(this));
        }

        ctx.transitions[0].apply(ctx);

        return ctx;
    }

    const updateSimIndex = (nextIndex) => {
        let i = simIndex.current;

        if(typeof nextIndex !== 'number') nextIndex = nextIndex(i);
        if(nextIndex < 0) nextIndex = 0;
        if(nextIndex > simState.transitions.length-1) nextIndex = simState.transitions.length-1;
        while(i != nextIndex){
            if(i < nextIndex){
                simState.transitions[i+1].apply(simState)
                if(simState.transitions[i+1].voterMovements.length > 0){
                    let copiedIndex = i+1;
                    simState.transitions[copiedIndex].moveVoters(simState)
                }
                i++;
            }
            if(i > nextIndex){
                if(simState.transitions[i].voterMovements.length > 0){
                    let copiedIndex = i;
                    simState.transitions[copiedIndex].revertMove(simState)
                }
                simState.transitions[i-1].apply(simState);
                i--;
            }
        }

        simIndex.current = i;
    }

    const simIndexIsVisible = (index) => {
        let t = simState.transitions[index];
        return ( 
            (t.electionTag == undefined || simState.selectorElection == t.electionTag)// &&
            //(t.electionFailure == undefined || simState.electionFailure == t.electionFailure)
        );
    }

    const refreshFromIndex = (index) => {

    }

    const getElectionSelectorRange = (index) => {

    }

    const handleKeyPress = useCallback((event) => {
        // I'll worry about keyboard support later
        //if(event.key == 'a'){
        //    updateSimIndex(i => i+1);
        //}
        //if(event.key == 'z'){
        //    updateSimIndex(i => i-1);
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

    return <SimContext.Provider value={{simState, updateSimIndex, simIndexIsVisible, getElectionSelectorRange, refreshFromIndex, refreshBool}}>{children}</SimContext.Provider>;
}