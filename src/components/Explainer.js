import { useContext, useEffect, useRef} from "react";
import { SimContext } from "../SimContext";

const Explainer = () => {
    const {simState, updateSimIndex} = useContext(SimContext);
    const explainerRefs = useRef([]);

    let explainers = simState.allExplainers.map((explainer, i) => {
        return <div className="explainerItem" ref={el => explainerRefs.current[i] = el} key={`explainer-${i}`}><div className="explainerInner">{explainer}</div></div>
    })

    let onScroll = (event) => {
        let mid = (event.target.getBoundingClientRect().top + event.target.getBoundingClientRect().bottom) / 2;

        let focusedElem = explainerRefs.current.reduce((prev, e, i) => {
            if(i == explainerRefs.current.length-1) return prev;
            const getDiff = (el) => mid - el.getBoundingClientRect().top 
            if(getDiff(e) < 0) return prev;
            if(getDiff(e) < getDiff(prev)) return e;
            return prev;
        });

        explainerRefs.current.forEach(e => {
            e.classList.remove('explainerFocused');
            e.classList.remove('explainerUnfocused');
            e.classList.add((e == focusedElem)? 'explainerFocused' : 'explainerUnfocused');
        })

        updateSimIndex(explainerRefs.current.indexOf(focusedElem));
    }

    useEffect(() => {
        explainerRefs.current.forEach((e, i) => {
            e.classList.remove('explainerFocused');
            e.classList.remove('explainerUnfocused');
            e.classList.add((i == 1)? 'explainerFocused' : 'explainerUnfocused');
        })
        updateSimIndex(1);
    }, [])

    return (
        <div className="explainer" onScroll={onScroll}>
            {explainers}
        </div>
    )
}

export default Explainer
