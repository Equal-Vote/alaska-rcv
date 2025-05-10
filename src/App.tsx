// @ts-nocheck

import { SimContext, SimContextProvider } from './SimContext';

import Simulation from './components/Simulation';
import Explainer from './components/Explainer';
import Nav from './components/Nav';
import { useContext, useEffect, useState } from 'react';
import CaseStudySelector from './components/CaseStudySelector';
import { elections } from './Transitions';

export default () => {
    // APP
    let [navTop, setNavTop] = useState(0);
    let parts = window.location.pathname.split('/');
    let tag = parts?.[1];
    let election = undefined;
    let primaryDimensionTag = undefined;
    if(window.location.pathname != '/'){
        let electionMatches = elections.filter(e => e.tag == tag)
        if(electionMatches.length > 0){
            election = electionMatches[0];
        }else{
            primaryDimensionTag = tag;
        }
    }
    return <div className="app" style={{overflowY: election ? 'none' : 'auto'}}>
        <Nav navTop={navTop} election={election}/>
        {(election || primaryDimensionTag) ? 
            <SimContextProvider election={election} primaryDimensionTag={primaryDimensionTag}>
                <div className="columns">
                    <Simulation/>
                    <Explainer setNavTop={setNavTop}/>
                </div>
            </SimContextProvider>
        :
            <CaseStudySelector/>
        }
    </div>;
}