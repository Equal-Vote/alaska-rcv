import { SimContextProvider } from './SimContext';
import Simulation from './components/Simulation';
import Explainer from './components/Explainer';
import Nav from './components/Nav';
import { useState } from 'react';

function App() {
    let [navTop, setNavTop] = useState(0);

    return (
        <div className="app">
            <Nav navTop={navTop}/>
            <div className="columns">
                <SimContextProvider>
                    <Simulation/>
                    <Explainer setNavTop={setNavTop}/>
                </SimContextProvider>
            </div>
        </div>
    );
}

export default App;
