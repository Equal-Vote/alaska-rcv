import { useContext, useEffect, useState } from "react";
import { SimContext } from "../SimContext";

const Explainer = () => {
    const {simState} = useContext(SimContext);

    let explainers = simState.allExplainers.map(({explainer, delay},i) => {
        let c;
        if(i < simState.explainerStart)
            c = 'explainerPrev';
        if(simState.explainerStart <= i && i < simState.explainerEnd)
            c = 'explainerCurrent';
        if(simState.explainerEnd <= i)
            c = 'explainerNext';

        return <div className={c} key={`explainer-${i}`} style={{transitionDelay: `${delay}s`}}>{explainer}</div>
    })

    return (
        <div className="explainer">
            {explainers}
        </div>
    )

}

export default Explainer
