// @ts-nocheck

import { SimContextProvider } from './SimContext';

import Simulation from './components/Simulation';
import Explainer from './components/Explainer';
import Nav from './components/Nav';
import { useEffect, useState } from 'react';
import CaseStudySelector from './components/CaseStudySelector';

export default () => {
    // APP
    let [navTop, setNavTop] = useState(0);
    let parts = window.location.pathname.split('/');
    let election = parts?.[1];
    return <div className="app">
        <Nav navTop={navTop} election={election}/>

        {window.location.pathname == '/' &&
            <CaseStudySelector/>
        }

        {window.location.pathname != '/' &&
            <div className="columns">
                <SimContextProvider election={election}>
                    <Simulation/>
                    <Explainer setNavTop={setNavTop}/>
                </SimContextProvider>
            </div>
        }
    </div>;
}