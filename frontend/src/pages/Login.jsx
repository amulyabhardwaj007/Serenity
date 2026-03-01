import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            alert('Login failed: ' + (err.response?.data?.message || 'Server error'));
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
                <p className="eyebrow">Welcome back</p>
                <h2>Welcome Back</h2>
                <p className="muted">Log in to continue your calm routine.</p>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p className="auth-footnote">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
