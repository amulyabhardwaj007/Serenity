import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const JournalSection = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('Happy');
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', text: '' });
        try {
            await axios.post(
                `${API_BASE_URL}/api/journal`,
                { title, content, mood },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setTitle('');
            setContent('');
            setStatus({ type: 'success', text: 'Entry saved successfully.' });
        } catch (err) {
            setStatus({ type: 'error', text: err.response?.data?.message || 'Failed to save entry' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="page page-narrow section-shell">
            <div className="page-header">
                <p className="eyebrow">Daily reflection</p>
                <h2>Your Personal Journal</h2>
                <p className="muted">Write first. Review history separately when you need it.</p>
                {status.text && (
                    <p className={`notice ${status.type === 'error' ? 'notice-error' : 'notice-success'}`}>{status.text}</p>
                )}
            </div>

            <motion.div
                className="card section-card journal-layout"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
            >
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>How are you feeling?</label>
                        <select
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            className="serenity-select"
                        >
                            <option>Happy</option>
                            <option>Calm</option>
                            <option>Anxious</option>
                            <option>Sad</option>
                            <option>Energized</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Content</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="5" required />
                    </div>
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Entry'}</button>
                </form>
                <aside className="journal-note-panel">
                    <p className="eyebrow">Note board</p>
                    <h3>Small entries matter</h3>
                    <p className="muted">Capture one honest paragraph. Tiny notes become big progress over time.</p>
                    <svg viewBox="0 0 360 260" className="journal-note-svg" aria-hidden="true">
                        <rect x="20" y="20" width="320" height="220" rx="18" fill="#fff8e6" stroke="#d5b98b" strokeWidth="2" />
                        <rect x="46" y="52" width="268" height="26" rx="8" fill="#ffe3b5" />
                        <rect x="46" y="88" width="230" height="12" rx="6" fill="#efc993" />
                        <rect x="46" y="108" width="248" height="12" rx="6" fill="#efc993" />
                        <rect x="46" y="128" width="196" height="12" rx="6" fill="#efc993" />
                        <circle cx="294" cy="178" r="34" fill="#8ad3e8" />
                        <circle cx="294" cy="178" r="17" fill="#ffffff" />
                        <path d="M294 160v36M276 178h36" stroke="#1b6584" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </aside>
                <Link to="/journal/history" className="view-history-button">
                    View Previous Entries
                </Link>
            </motion.div>
        </section>
    );
};

export default JournalSection;
