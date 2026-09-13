
import { SimContextProvider } from './SimContext';

// @ts-ignore
import Simulation from './components/Simulation';
// @ts-ignore
import Explainer from './components/Explainer';
// @ts-ignore
import Nav from './components/Nav';
import { useState } from 'react';
import CaseStudySelector from './components/CaseStudySelector';
import { elections } from './Transitions';

export default () => {
    // APP
    let [navTop, setNavTop] = useState(0);
    let parts = window.location.pathname.split('/');
    let tag = parts?.[1];
    let election = undefined;
    if(window.location.pathname !== ''){
        let electionMatches = elections.filter(e => e.tag === tag)
        if(electionMatches.length > 0){
            election = electionMatches[0];
        }
    }
    // NOTE: this used to read `election ? 'none' : 'auto'`. 'none' is not a
    // valid overflow-y value, so browsers discarded it and .app fell back to
    // its stylesheet rule (overflow: hidden on desktop, visible on mobile).
    // `undefined` preserves that exact behaviour -- no inline override -- while
    // satisfying the type checker. Switching it to 'hidden' would look like the
    // obvious fix but would newly override the mobile 'visible' rule.
    return <div className="app" style={{overflowY: election ? undefined : 'auto'}}>
        <Nav navTop={navTop} election={election}/>
        {election ?
            <SimContextProvider election={election}>
                <div className="columns">
                    <Simulation navTop={navTop}/>
                    <Explainer setNavTop={setNavTop}/>
                </div>
            </SimContextProvider>
        :
            <CaseStudySelector/>
        }
    </div>;
}
