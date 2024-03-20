import { SimContextProvider } from './SimContext';
import Simulation from './components/Simulation';
import Explainer from './components/Explainer';
import Nav from './components/Nav';
import { useEffect, useState } from 'react';


function App() {
    // FEATURE FLAG
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        let flags = [{
            key: 'enabled',
            value: false,
            description: 'Bypasses the blocker and enables the site',
            title: 'enabled' // This is optional defaulting to name according to the documentation, but that didn't work for me
        }]

        const setter = (key, value) => {
            setEnabled(value);
        }

        if (window.featureFlagsPluginRegister){
            window.featureFlagsPluginRegister(flags, setter);
        }else{
            window.registerMyFeatureFlags = (register) => register(flags, setter);
        }
    }, [])

    // APP
    let [navTop, setNavTop] = useState(0);
    if(enabled){
        return <div className="app">
            <Nav navTop={navTop}/>
            <div className="columns">
                <SimContextProvider>
                    <Simulation/>
                    <Explainer setNavTop={setNavTop}/>
                </SimContextProvider>
            </div>
        </div>;
    }else{
        return <div style={{padding: '30px'}}> <h1 style={{color: 'white'}}>Soon to be released...</h1> </div>
    }
}

export default App;
