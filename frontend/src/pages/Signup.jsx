import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', text: '' });
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, { username, email, password });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            setStatus({ type: 'error', text: err.response?.data?.message || 'Signup failed. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                className="card auth-card"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
            >
                <p className="eyebrow">Start fresh</p>
                <h2>Create Account</h2>
                <p className="muted">Build your private space for journaling and calm tools.</p>
                {status.text && (
                    <p className={`notice ${status.type === 'error' ? 'notice-error' : 'notice-success'}`}>{status.text}</p>
                )}
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Sign Up'}</button>
                </form>
                <p className="auth-footnote">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
