import { SimContextProvider } from './SimContext';
import Simulation from './components/Simulation';
import Explainer from './components/Explainer';

function App() {
    return (
        <div className="app">
            <SimContextProvider>
                <Simulation/>
                <Explainer/>
            </SimContextProvider>
            <div class="object Candidate objectVisible palin" style={{borderWidth: '3px 5px', fontSize: '17px', width: '15%', height: '15%'}}></div>
        </div>
    );
}

export default App;
