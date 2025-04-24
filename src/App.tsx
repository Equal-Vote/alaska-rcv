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
    return <div className="app">
        <Nav navTop={navTop}/>

        {window.location.pathname == '/' &&
            <CaseStudySelector/>
        }

        {window.location.pathname != '/' &&
            <div className="columns">
                <SimContextProvider>
                    <Simulation/>
                    <Explainer setNavTop={setNavTop}/>
                </SimContextProvider>
            </div>
        }
    </div>;
}