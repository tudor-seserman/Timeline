import './App.css'
import Events from './components/Events';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';

function App() {


  return (
    <>

      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegistrationPage />}></Route>
        <Route path="*" element={<Navigate to="/" replace />}></Route>
        <Events />
      </Routes>
    </>
  )
}

export default App
