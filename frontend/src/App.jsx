import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import JournalSection from './pages/JournalSection';
import JournalHistory from './pages/JournalHistory';
import MusicSection from './pages/MusicSection';
import RelaxationTips from './pages/RelaxationTips';
import MiniGames from './pages/MiniGames';
import Meditation from './pages/Meditation';
import YogaPoses from './pages/YogaPoses';
import './index.css';

const AppShell = () => {
    const isAuth = !!localStorage.getItem('token');
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <>
            {isAuth && (
                <nav className="navbar">
                    <h2 className="brand">Serenity</h2>
                    <div className="nav-links" role="navigation" aria-label="Primary">
                        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
                        <NavLink to="/journal" className={({ isActive }) => (isActive ? 'active' : '')}>Journal</NavLink>
                        <NavLink to="/music" className={({ isActive }) => (isActive ? 'active' : '')}>Music</NavLink>
                        <NavLink to="/meditation" className={({ isActive }) => (isActive ? 'active' : '')}>Meditation</NavLink>
                        <NavLink to="/yoga" className={({ isActive }) => (isActive ? 'active' : '')}>Yoga</NavLink>
                        <NavLink to="/tips" className={({ isActive }) => (isActive ? 'active' : '')}>Tips</NavLink>
                        <NavLink to="/games" className={({ isActive }) => (isActive ? 'active' : '')}>Games</NavLink>
                        <button className="ghost-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </nav>
            )}

            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname}
                    className="route-shell"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.38, ease: 'easeOut' }}
                >
                    <Routes location={location}>
                        <Route path="/" element={<Landing isAuth={isAuth} />} />
                        <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <Login />} />
                        <Route path="/signup" element={isAuth ? <Navigate to="/dashboard" /> : <Signup />} />
                        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/journal" element={isAuth ? <JournalSection /> : <Navigate to="/login" />} />
                        <Route path="/journal/history" element={isAuth ? <JournalHistory /> : <Navigate to="/login" />} />
                        <Route path="/music" element={isAuth ? <MusicSection /> : <Navigate to="/login" />} />
                        <Route path="/meditation" element={isAuth ? <Meditation /> : <Navigate to="/login" />} />
                        <Route path="/yoga" element={isAuth ? <YogaPoses /> : <Navigate to="/login" />} />
                        <Route path="/tips" element={isAuth ? <RelaxationTips /> : <Navigate to="/login" />} />
                        <Route path="/games" element={isAuth ? <MiniGames /> : <Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </motion.main>
            </AnimatePresence>
        </>
    );
};

const App = () => (
    <Router
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
    >
        <AppShell />
    </Router>
);

export default App;
