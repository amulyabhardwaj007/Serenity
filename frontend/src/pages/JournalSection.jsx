import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const JournalSection = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('Happy');
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${API_BASE_URL}/api/journal`,
                { title, content, mood },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setTitle('');
            setContent('');
            alert('Entry saved');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save entry');
        }
    };

    return (
        <section className="page page-narrow section-shell">
            <div className="page-header">
                <p className="eyebrow">Daily reflection</p>
                <h2>Your Personal Journal</h2>
                <p className="muted">Write first. Review history separately when you need it.</p>
            </div>

            <motion.div
                className="card section-card"
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
                    <button type="submit">Save Entry</button>
                </form>
                <Link to="/journal/history" className="view-history-button">
                    View Previous Entries
                </Link>
            </motion.div>
        </section>
    );
};

export default JournalSection;
