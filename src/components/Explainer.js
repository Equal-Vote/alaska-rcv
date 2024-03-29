import { useContext, useEffect, useRef} from "react";
import { SimContext } from "../SimContext";

const Explainer = ({setNavTop}) => {
    const {simState, updateSimIndex, simIndexIsVisible, refreshBool} = useContext(SimContext);
    const explainerRefs = useRef([]);
    const containerRef = useRef(null);

    let explainers = simState.allExplainers.map((explainer, i) => {
        if(!simIndexIsVisible(i)) return undefined;
        if(i == 0 || i == simState.allExplainers.length-1) return <>{explainer}</>;

        return <div className="explainerItem" ref={el => explainerRefs.current[i] = el} key={`explainer-${i}`}>
            <div className="explainerInner">{explainer}</div>
        </div>
    }).filter(explainer => explainer != undefined);

    let selectorRange = simState.transitions.reduce((range, t, i) => {
        if(t.electionTag != undefined || t.failureTag != undefined){
            if(range.start == undefined) range.start = i;
            if(simIndexIsVisible(i)) range.size++; // I can't set end directly since explainers is only a subset of simState.transitions
        }
        return range;
    }, {start: undefined, size: 0})
    selectorRange.end = selectorRange.start + selectorRange.size
    selectorRange.start--; // include the selector panel


    let prevScrollY = 0;
    let refreshExplainers = (event) => {
        let rect = containerRef.current.getBoundingClientRect();
        let mid = (rect.top + rect.bottom) / 2;

        let focusedElem = explainerRefs.current.reduce((prev, e, i) => {
            if(!simIndexIsVisible(i)) return prev;
            const getDiff = (el) => mid - el.getBoundingClientRect().top 
            if(getDiff(e) < 0) return prev;
            if(getDiff(e) < getDiff(prev)) return e;
            return prev;
        });

        explainerRefs.current.forEach((e,i) => {
            if(!simIndexIsVisible(i)) return;
            e.classList.remove('explainerFocused');
            e.classList.remove('explainerUnfocused');
            e.classList.add((e == focusedElem)? 'explainerFocused' : 'explainerUnfocused');
        })

        updateSimIndex(explainerRefs.current.indexOf(focusedElem));

        // Update nav
        setNavTop(v => Math.max(-100, Math.min(0, v-(containerRef.current.scrollTop - prevScrollY))));
        prevScrollY = containerRef.current.scrollTop;
    }


    // I couldn't get global scroll to feel good,so I'm disabling it for now
    //let onGlobalScroll = (event) => {
    //    if(containerRef.current.matches(':hover')) return;

    //    containerRef.current.scrollTop += Math.sign(event.deltaY);

    //    refreshExplainers();
    //}

    useEffect(() => {

        explainerRefs.current.forEach((e, i) => {
            e.classList.remove('explainerFocused');
            e.classList.remove('explainerUnfocused');
            e.classList.add((i == 1)? 'explainerFocused' : 'explainerUnfocused');
        })
        updateSimIndex(1);

        //document.addEventListener('wheel', onGlobalScroll);
        
        //return () => document.removeEventListener('wheel', onGlobalScroll);
    }, [])

    return (
        <div className="explainer" ref={containerRef} onScroll={refreshExplainers}>
            {explainers.slice(0, selectorRange.start)}
            <div className='selectorContainer'>
                {explainers.slice(selectorRange.start, selectorRange.end)}
            </div>
            {explainers.slice(selectorRange.end)}
        </div>
    )
}

export default Explainer
