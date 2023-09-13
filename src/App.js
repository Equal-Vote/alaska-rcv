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
        </div>
    );
}

export default App;
