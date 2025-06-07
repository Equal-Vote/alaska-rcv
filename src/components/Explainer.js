import { useContext, useEffect, useRef} from "react";
import { SimContext } from "../SimContext";

const Explainer = ({setNavTop}) => {
    const {simState, updateSimIndex, refreshBool} = useContext(SimContext);
    const explainerRefs = useRef([]);
    const containerRef = useRef(null);
    const upScrollStartY = useRef(undefined);

    let explainers = simState.allExplainers.map((explainer, i) => {
        if(i == 0 || i == simState.allExplainers.length-1) return <div key={i}>{explainer}</div>;

        return <div className="explainerItem" ref={el => explainerRefs.current[i] = el} key={`explainer-${i}`}>
            <div className="explainerInner">{explainer}</div>
        </div>
    })

    let prevScrollY = 0;
    let refreshExplainers = (event) => {
        let rect = containerRef.current.getBoundingClientRect();
        let mid = (rect.top + rect.bottom) / 2;

        let focusedElem = explainerRefs.current.reduce((prev, e, i) => {
            const getDiff = (el) => mid - el.getBoundingClientRect().top 
            if(getDiff(e) < 0) return prev;
            if(getDiff(e) < getDiff(prev)) return e;
            return prev;
        });

        explainerRefs.current.forEach((e,i) => {
            e.classList.remove('explainerFocused');
            e.classList.remove('explainerUnfocused');
            e.classList.add((e == focusedElem)? 'explainerFocused' : 'explainerUnfocused');
        })

        updateSimIndex(explainerRefs.current.indexOf(focusedElem));


        upScrollStartY.current ??= containerRef.current.scrollTop;
        if(containerRef.current.scrollTop > prevScrollY){
            upScrollStartY.current = containerRef.current.scrollTop;
        }
        // Update nav
        setNavTop(v => {
            // when scrolling down use 0
            if(containerRef.current.scrollTop > prevScrollY){
                return -1;
            }
            
            if(upScrollStartY.current - containerRef.current.scrollTop > 300 || containerRef.current.scrollTop == 0){
                return 0;
            }

            return v;
        });
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
            {explainers}
        </div>
    )
}

export default Explainer
