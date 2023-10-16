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
import { VoterMovement } from './VoterMovement';

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
            'alaska-special-2022': ['Begich', 'Palin', 'Peltola'],
            'alaska-general-2022': ['Begich', 'Palin', 'Peltola'],
            'burlington-2009': ['Montroll', 'Wright', 'Kiss'],
            'minneapolis-2021': ['Gordon', 'Arab', 'Worlobah'],
            'pierce-2008': ['Goings', 'Bunney', 'McCarthy'],
            'san-francisco-2020': ['Nguyen', 'Engardio', 'Melgar'],
            'alameda-2022': ['Manigo', 'Resnick', 'Hutchinson'],
            'moab-2021': ['Wojciechowski', 'Kovash', 'Taylor'],
        };

        let ctx = {
            // embed (must be on top so that it's interactable)
            star_vs_rcv_embed: new VideoEmbed(80, 'https://www.youtube.com/embed/Nu4eTUafuSc?si=W5a3y5rQ4ZJ50CmS', 25, 90),
            approval_embed: new VideoEmbed(80, 'https://www.youtube.com/embed/m8VXIIaC9Zw?si=cTyOSt1pMmkCQAtv', 25, 270),
            // images
            choose_one: new ImageObject(0, 0, 70, 'chooseOneBallot.png'),
            alaska: new ImageObject(0, 0, 70, 'alaska.png'),
            center_beats_right: new ImageObject(0, 0, 100, 'centerBeatsRight.png'),
            right_beats_center: new ImageObject(0, 0, 100, 'rightBeatsCenter.png'),
            center_beats_left: new ImageObject(0, 0, 100, 'centerBeatsLeft.png'),
            left_beats_center: new ImageObject(0, 0, 100, 'leftBeatsCenter.png'),
            left_beats_right: new ImageObject(0, 0, 100, 'leftBeatsRight.png'),
            right_beats_left: new ImageObject(0, 0, 100, 'rightBeatsLeft.png'),
            usFailures: new ImageObject(25, 90, 60, 'usRCVFailures.png', 'contain'),
            expectedFailures: new ImageObject(25, 270, 60, 'expectedRCVFailures.png', 'contain'),
            // darken layer
            darken: new DarkenLayer(),
            // voter ring
            pie: new Pie(candidateRadius*2),
            // candidates
            centerCandidate: new Candidate(candidateRadius, 90, 0),
            rightCandidate: new Candidate(candidateRadius, 330, 1),
            leftCandidate: new Candidate(candidateRadius, 210, 2),
            // counts
            centerCount: new VoterCount(countRadius, 90, 0),
            rightCount: new VoterCount(countRadius, 330, 1),
            leftCount: new VoterCount(countRadius, 210, 2),
            // camps
            home: new VoterCamp(0, 0),
            centerBullet: new VoterCamp(voterRadius, 90),
            centerThenRight: new VoterCamp(voterRadius, 60),
            rightThenCenter: new VoterCamp(voterRadius, 0),
            rightBullet: new VoterCamp(voterRadius, 330),
            rightThenLeft: new VoterCamp(voterRadius, 300),
            leftThenRight: new VoterCamp(voterRadius, 240),
            leftBullet: new VoterCamp(voterRadius, 210),
            leftThenCenter: new VoterCamp(voterRadius, 180),
            centerThenLeft: new VoterCamp(voterRadius, 120),
        };

        let objects = [];
        
        Object.entries(ctx).forEach(([_, o]) => {
            objects.push(o);
        });
        for(var i = 0; i < 200; i++){
            objects.push(new Voter(80+Math.random()*10, (i/200)*360+.3, undefined));
        }
        ctx.objects = objects;
        let params = new URLSearchParams(window.location.search)
        ctx = {...ctx,
            objects,
            visible: [],
            focused: [],
            runoffStage: 'default',
            electionName: params.get('onlySelector') ? (params.get('selectorElection') ?? 'burlington-2009') : 'alaska-special-2022',
            selectorElection: params.get('selectorElection') ?? 'burlington-2009',
            selectorFailure: params.get('selectorFailure') ?? '<pick a failure type>',
            candidateNames
        }

        // must be after the { ... } since that breaks the reference

        ctx.transitions = transitions(ctx, setRefreshBool, () => {
            updateSimIndex(i => i, true);
        });

        ctx.allExplainers = ctx.transitions.map(t => {return t.explainer; });

        ctx.visibleObjects = function(){
            return this.objects.filter(o => o.isVisible(this));
        }

        ctx.transitions[0].apply(ctx);

        return ctx;
    }

    const updateSimIndex = (nextIndex, fullReset=false) => {
        let i = simIndex.current;

        if(typeof nextIndex !== 'number') nextIndex = nextIndex(i);
        if(nextIndex < 0) nextIndex = 0;
        if(nextIndex > simState.transitions.length-1) nextIndex = simState.transitions.length-1;

        // To be safe I starting from the beginning everytime
        if(fullReset){
            // we're not resetting to undefined because we trust that this is called in a scenario where we don't need it
            //new VoterMovement(200, 'anywhere', undefined).apply(simState);
            i = 0; 
        }

        let prevI = i;
        while(i != nextIndex){
            if(i < nextIndex){
                i++;
                if(!simIndexIsVisible(i)) continue;
                simState.transitions[i].apply(simState)
                simState.transitions[i].moveVoters(simState)
                prevI = i;
            }
            if(i > nextIndex){
                i--;
                if(!simIndexIsVisible(i)) continue;
                simState.transitions[prevI].revertMove(simState)
                simState.transitions[i].apply(simState);
                prevI = i;
            }
        }

        simIndex.current = i;
    }


    const simIndexIsVisible = (index) => {
        let t = simState.transitions[index];
        return ( 
            (t.electionTag == undefined || simState.selectorElection == t.electionTag) &&
            (t.failureTag == undefined || simState.selectorFailure == t.failureTag)
        );
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

    return <SimContext.Provider value={{simState, updateSimIndex, simIndexIsVisible, refreshBool}}>{children}</SimContext.Provider>;
}