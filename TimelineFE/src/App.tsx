import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashPage from './pages/DashPage';
import CreateTimelinePage from './pages/CreateTimelinePage';
import TimelinePage from './pages/TimelinePage';
import ModifyTimelinePage from './pages/ModifyTimelinePage';
import ConnectionsPage from './pages/ConnectionsPage';
import PendingConnectionsPage from './pages/PendingConectionsPage';



function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegistrationPage />}></Route>
        <Route path="/dash" element={<DashPage />}></Route>
        <Route path="/timelines/*" element={
          <Routes>
            <Route path="create" element={<CreateTimelinePage />}></Route>
            <Route path="modify/:timelineId" element={<ModifyTimelinePage />}></Route>
            <Route path="/:timelineId" element={<TimelinePage />}></Route>
          </Routes>}
        ></Route>
        <Route path="/connections/*" element={
          <Routes>
            <Route path="/" element={<ConnectionsPage />} />
            <Route path="pending" element={<PendingConnectionsPage />} />
          </Routes>
        }></Route>
        <Route path="*" element={<Navigate to="/" replace />}></Route>
      </Routes>
    </>
  )
}

export default App
