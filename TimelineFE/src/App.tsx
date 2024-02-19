import './App.css'
import { PrimeReactProvider } from 'primereact/api';
import Events from './components/Events';

function App() {


  return (
    <>
      <PrimeReactProvider>
        <Events />
      </PrimeReactProvider>
    </>
  )
}

export default App
