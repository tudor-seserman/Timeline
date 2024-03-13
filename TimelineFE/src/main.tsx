import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from 'primereact/api';
import { NavBar } from './components/base/NavBar.tsx';
import 'primereact/resources/themes/tailwind-light/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import "./global.css"



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <BrowserRouter>
        <NavBar />
        <App />
      </BrowserRouter>
    </PrimeReactProvider>
  </React.StrictMode>
)
