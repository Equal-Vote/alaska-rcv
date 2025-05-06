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
    let electionTag = parts?.[1];
    let election = undefined;
    if(window.location.pathname != '/'){
        election = elections.filter(e => e.tag == electionTag)[0]
    }
    return <div className="app" style={{overflowY: election ? 'none' : 'auto'}}>
        <Nav navTop={navTop} election={election}/>
        {!election && <>
            <CaseStudySelector/>
        </>}

        {election && 
            <SimContextProvider election={election}>
                <div className="columns">
                    <Simulation/>
                    <Explainer setNavTop={setNavTop}/>
                </div>
            </SimContextProvider>
        }
    </div>;
}