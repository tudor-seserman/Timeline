import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from 'primereact/api';
import { NavBar } from './components/base/NavBar.tsx';
// import 'primereact/resources/primereact.min.css'; //core css
import "/node_modules/primeflex/primeflex.css";
import 'primereact/resources/themes/tailwind-light/theme.css'; //theme
import "./global.css"
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PrimeReactProvider>
        <BrowserRouter>
          <NavBar >
            <App />
          </NavBar>
        </BrowserRouter>
      </PrimeReactProvider>
    </Provider>
  </React.StrictMode>
)
