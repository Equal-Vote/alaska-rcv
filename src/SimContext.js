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
import Video from './components/Video';

export const SimContext = createContext({});


export function SimContextProvider({children}){
    // this was genetated programatically, and then copied from the log and fed into a single line formatter
    let isMobile = (window.innerWidth < 900);
    const campMappings = (isMobile)?
        ["centerThenRight","leftThenCenter","leftBullet","rightThenCenter","rightBullet","centerThenRight","rightBullet","leftThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","leftThenCenter","rightBullet","leftThenCenter","centerThenRight","rightThenCenter","leftBullet","leftThenCenter","centerThenRight","rightBullet","rightThenCenter","centerThenRight","leftThenCenter","leftBullet","rightBullet","leftThenCenter","centerThenRight","centerThenRight","centerThenRight","centerThenRight","rightThenCenter","leftBullet","leftThenCenter","centerBullet","rightThenCenter","centerThenRight","centerThenRight","rightThenCenter","centerThenRight","centerThenRight","rightThenCenter","centerThenRight","rightThenCenter","centerThenLeft","centerThenRight","leftThenRight","centerThenLeft","centerThenRight","centerThenRight","rightThenLeft","leftThenCenter","rightThenCenter","leftBullet","leftBullet","leftBullet","centerBullet","rightThenCenter","leftThenCenter","centerThenRight","leftThenRight","leftThenRight","leftBullet","rightThenCenter","leftBullet","rightBullet","centerBullet","rightThenCenter","leftThenCenter","rightThenCenter","leftThenCenter","centerThenRight","centerThenLeft","leftBullet","rightThenCenter","leftThenCenter","centerThenRight","rightThenCenter","centerThenLeft","leftThenCenter","rightBullet","leftThenCenter","leftThenCenter","rightThenLeft","leftThenCenter","centerThenLeft","leftBullet","leftThenCenter","leftThenCenter","leftBullet","rightThenLeft","rightThenCenter","leftThenCenter","rightBullet","leftBullet","leftBullet","centerThenLeft","leftBullet","centerThenRight","leftThenCenter","leftThenCenter","centerThenLeft","leftBullet","centerThenLeft","leftThenRight","leftBullet","rightBullet","leftThenCenter","centerThenLeft","centerThenLeft","rightBullet","centerThenLeft","leftThenCenter","rightThenLeft","rightThenCenter","centerBullet","leftThenCenter","leftBullet","leftThenCenter","centerBullet","leftThenCenter","centerThenLeft","leftThenCenter","leftThenCenter","centerBullet","centerBullet","rightThenCenter","rightBullet","centerThenLeft","leftThenCenter","leftThenCenter","leftBullet","leftThenRight","rightThenCenter","centerBullet","leftThenCenter","centerThenLeft","centerBullet","leftBullet","leftBullet","rightBullet","rightThenCenter","centerBullet","rightBullet","rightThenCenter","centerThenLeft","rightBullet","leftThenCenter","leftBullet","leftThenCenter","rightThenCenter","leftThenCenter","leftThenCenter","leftBullet","rightBullet","rightThenCenter","leftThenCenter","rightBullet","rightBullet","leftThenCenter","rightBullet","rightThenCenter","centerThenRight","centerBullet","rightBullet","rightBullet","centerThenRight","leftThenCenter","rightBullet","centerBullet","centerThenRight","rightThenCenter","leftBullet","leftThenCenter","centerThenRight","centerThenRight","leftThenCenter","rightThenCenter","centerThenRight","rightThenCenter","rightBullet","rightThenCenter","leftThenCenter","centerThenRight","leftThenCenter","leftThenCenter","leftBullet","rightThenCenter","leftThenCenter","leftThenCenter","rightBullet","rightThenCenter","centerThenRight","rightThenCenter","leftThenCenter","leftThenCenter","leftThenCenter","centerThenLeft","rightThenCenter","leftThenCenter","rightThenCenter"]
    :
        ["rightThenCenter","leftThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","leftThenCenter","leftThenCenter","rightThenCenter","centerThenRight","rightThenCenter","centerThenLeft","centerThenRight","centerThenRight","centerThenRight","centerThenRight","centerThenRight","centerThenRight","rightThenCenter","centerThenRight","centerThenRight","leftThenCenter","centerThenRight","centerThenRight","centerThenRight","centerThenRight","centerThenRight","leftThenCenter","leftThenCenter","centerThenRight","centerThenRight","rightBullet","centerThenRight","centerThenRight","centerThenRight","centerThenRight","centerThenRight","centerThenRight","leftThenCenter","centerThenRight","leftThenCenter","leftThenCenter","centerThenRight","centerThenRight","centerThenLeft","centerThenRight","centerBullet","leftThenCenter","centerBullet","centerBullet","centerBullet","centerBullet","centerBullet","centerBullet","centerBullet","centerThenRight","centerBullet","leftThenCenter","leftThenCenter","leftThenCenter","leftThenCenter","rightThenCenter","centerThenLeft","leftThenCenter","centerThenLeft","centerBullet","centerBullet","leftThenCenter","leftThenCenter","centerThenRight","leftThenCenter","leftThenCenter","centerThenLeft","centerThenLeft","centerThenLeft","centerThenLeft","centerThenLeft","leftThenCenter","leftThenCenter","leftThenCenter","leftThenCenter","leftThenCenter","centerThenLeft","centerThenLeft","centerThenLeft","centerThenLeft","centerThenLeft","leftThenCenter","leftThenCenter","leftThenCenter","leftThenCenter","centerThenLeft","leftThenCenter","centerThenLeft","leftThenCenter","leftBullet","leftThenCenter","leftThenCenter","leftThenCenter","leftThenCenter","leftThenCenter","leftThenCenter","leftThenCenter","leftBullet","leftThenCenter","leftBullet","leftBullet","leftBullet","leftThenCenter","leftBullet","leftBullet","leftThenCenter","leftBullet","leftBullet","leftThenCenter","leftBullet","leftBullet","leftBullet","leftThenRight","leftThenRight","leftBullet","leftThenRight","leftBullet","leftBullet","leftBullet","leftThenRight","leftThenRight","rightBullet","leftThenCenter","leftBullet","leftThenCenter","leftThenCenter","leftBullet","rightThenLeft","leftBullet","leftThenCenter","rightThenLeft","rightThenCenter","leftBullet","leftBullet","rightThenCenter","rightBullet","leftBullet","rightBullet","leftBullet","leftThenCenter","rightThenLeft","leftBullet","leftThenCenter","leftBullet","rightBullet","rightBullet","rightBullet","leftThenCenter","rightBullet","rightBullet","rightBullet","rightBullet","rightBullet","rightThenLeft","rightThenCenter","rightBullet","rightBullet","rightBullet","rightThenCenter","rightBullet","rightBullet","rightThenCenter","rightThenCenter","rightBullet","rightBullet","rightThenCenter","rightThenCenter","rightBullet","rightBullet","rightThenCenter","rightThenCenter","leftThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","centerBullet","rightThenCenter","rightBullet","rightThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","rightThenCenter","centerThenRight","rightBullet","leftThenCenter","rightThenCenter"]
    let [refreshBool, setRefreshBool] = useState(false);
    let simState = useRef(initSimContext()).current;
    let simIndex = useRef(0);


    function initSimContext(){
        let countRadius = 14;
        let voterRadius = 28;
        let candidateRadius = 43;
        let candidateNames = {
            '<pick an election>': ['Begich', 'Palin', 'Peltola'], // HACK: this doesn't matter but it stops a crash
            'alaska-special-2022': ['Begich', 'Palin', 'Peltola'],
            'alaska-general-2022': ['Begich', 'Palin', 'Peltola'],
            'burlington-2009': ['Montroll', 'Wright', 'Kiss'],
            'minneapolis-2021': ['Gordon', 'Arab', 'Worlobah'],
            'pierce-2008': ['Goings', 'Bunney', 'McCarthy'],
            'san-francisco-2020': ['Nguyen', 'Engardio', 'Melgar'],
            'alameda-2022': ['Manigo', 'Resnick', 'Hutchinson'],
            'moab-2021': ['Wojciechowski', 'Kovash', 'Taylor'],
            'nyc-2021': ['Wiley', 'Garcia', 'Adams'],
            'aspen-2009': ['Johnson', 'Behrendt', 'Torre'],
        };

        let ctx = {
            // embed (must be on top so that it's interactable)
            star_vs_rcv_embed: new VideoEmbed(80, 'https://www.youtube.com/embed/Nu4eTUafuSc?si=W5a3y5rQ4ZJ50CmS', 25, 90),
            approval_embed: new VideoEmbed(80, 'https://www.youtube.com/embed/m8VXIIaC9Zw?si=cTyOSt1pMmkCQAtv', 25, 270),
            // images
            alaska: new ImageObject(0, 0, 70, 'alaska.png'),
            center_beats_right: new ImageObject(0, 0, 100, 'centerBeatsRight.png'),
            right_beats_center: new ImageObject(0, 0, 100, 'rightBeatsCenter.png'),
            center_beats_left: new ImageObject(0, 0, 100, 'centerBeatsLeft.png'),
            left_beats_center: new ImageObject(0, 0, 100, 'leftBeatsCenter.png'),
            left_beats_right: new ImageObject(0, 0, 100, 'leftBeatsRight.png'),
            right_beats_left: new ImageObject(0, 0, 100, 'rightBeatsLeft.png'),
            usFailures: new ImageObject(25, 90, 60, 'usRCVFailures.png', 'contain'),
            expectedFailures: new ImageObject(25, 270, 60, 'expectedRCVFailures.png', 'contain'),
            australia: new ImageObject(0, 0, 100, 'australia.png', 'contain'),
            australia_house: new ImageObject(0, 0, 100, 'australiaHouse.jpg', 'contain'),
            usa_1: new ImageObject(0, 0, 100, 'usa1.png', 'contain'),
            usa_2: new ImageObject(0, 0, 100, 'usa2.png', 'contain'),
            usa_3: new ImageObject(0, 0, 100, 'usa3.png', 'contain'),
            star_ballot: new ImageObject(0, 0, 100, 'starBallot.png', 'contain'),
            approval_ballot: new ImageObject(0, 0, 100, 'approvalBallot.png', 'contain'),
            ranked_ballot: new ImageObject(0, 0, 100, 'rankedBallot.png', 'contain'),
            // videos
            choose_one: new ImageObject(0, 0, 70, 'chooseOneBallot2.png', 'contain'),//new Video(100, 'chooseOne.mkv'),
            spoiler_2000: new Video(100, 'spoiler2000.mp4', 1),
            all_elections_1: new Video(100, 'allElections1.mp4'),
            all_elections_2: new Video(100, 'allElections2.mp4'),
            parties: new Video(100, 'parties.mp4'),
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
            centerBullet: new VoterCamp(voterRadius, 90, 0, 0),
            centerThenRight: new VoterCamp(voterRadius, 60, 0, 1),
            rightThenCenter: new VoterCamp(voterRadius, 0, 1, 0),
            rightBullet: new VoterCamp(voterRadius, 330, 1, 1),
            rightThenLeft: new VoterCamp(voterRadius, 300, 1, 2),
            leftThenRight: new VoterCamp(voterRadius, 240, 2, 1),
            leftBullet: new VoterCamp(voterRadius, 210, 2, 2),
            leftThenCenter: new VoterCamp(voterRadius, 180, 2, 0),
            centerThenLeft: new VoterCamp(voterRadius, 120, 0, 2),
        };

        let objects = [];
        
        Object.entries(ctx).forEach(([_, o]) => {
            objects.push(o);
        });
        let r = 5;
        let isMobile = (window.innerWidth < 900);
        for(var i = 0; i < 200; i++){
            r = (1466021743 + r * i) % 10;
            objects.push(new Voter(i, (isMobile? 20 : 80)+r, (i/200)*360+.3, ctx[campMappings[i]]));
        }
        ctx.objects = objects;
        let params = new URLSearchParams(window.location.search)
        ctx = {...ctx,
            startTime: Date.now(),
            activeFrames: 0,
            threeSecondsPassed: false,
            objects,
            visible: [],
            focused: [],
            exhaustedCamp: undefined,
            runoffStage: 'default',
            runoffTimeout: undefined,
            electionName: params.get('onlySelector') ? (params.get('selectorElection') ?? 'burlington-2009') : 'alaska-special-2022',
            selectorElection: params.get('selectorElection') ?? 'burlington-2009',
            selectorFailure: params.get('selectorFailure') ?? 'pick a failure type',
            candidateNames
        };

        // super hacky way of fixing the bug where the candidates are fading out in the beginning
        setTimeout(() => {
            ctx.threeSecondsPassed = true
        }, 3000)

        if(ctx.electionName == 'pick an election') ctx.electionName = '<pick an election>';
        if(ctx.selectorElection == 'pick an election') ctx.selectorElection = '<pick an election>';
        if(ctx.selectorFailure == 'pick a failure type') ctx.selectorFailure = '<pick a failure type>';

        // must be after the { ... } since that breaks the reference

        ctx.transitions = transitions(ctx, setRefreshBool, () => {
            updateSimIndex(i => i, true);
        });
        ctx.transitions.forEach((t, i) => {
            if(i == 0) return;
            if(ctx.transitions[i-1].videoStopTime == 999999 || ctx.transitions[i-1].videoStopTime > t.videoStopTime){
                t.videoStartTime = 0;
            }else{
                t.videoStartTime = ctx.transitions[i-1].videoStopTime;
            }
        });

        ctx.allExplainers = ctx.transitions.map(t => {return t.explainer; });

        ctx.visibleObjects = function(){
            return this.objects.filter(o => o.isVisible(this));
        }

        ctx.transitions[0].apply(ctx);

        setTimeout(() => {
            let camps = new Array(200);
            simState.objects.filter(o => o.className == 'Voter').forEach(v => camps[v.index] = v.campName(simState));
            //console.log(camps);
        }, 20000);

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