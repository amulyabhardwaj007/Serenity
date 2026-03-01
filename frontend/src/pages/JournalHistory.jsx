import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const JournalHistory = () => {
    const [entries, setEntries] = useState([]);
    const token = localStorage.getItem('token');

    const fetchEntries = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/journal`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEntries(res.data);
        } catch (err) {
            alert('Failed to load entries');
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const deleteEntry = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/journal/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEntries((prev) => prev.filter((entry) => entry._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete entry');
        }
    };

    return (
        <section className="page page-narrow section-shell">
            <div className="page-header">
                <p className="eyebrow">Journal history</p>
                <h2>Previous Entries</h2>
                <p className="muted">You can review and delete old entries here.</p>
            </div>

            <div className="stack">
                {entries.length === 0 && <p className="muted">No entries yet.</p>}
                {entries.map((entry, index) => (
                    <motion.div
                        key={entry._id}
                        className="card entry-card"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.03 }}
                        whileHover={{ y: -3 }}
                    >
                        <h4>
                            {entry.title}
                            <small>{entry.mood}</small>
                        </h4>
                        <p>{entry.content}</p>
                        <div className="entry-footer">
                            <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                            <button className="delete-button" onClick={() => deleteEntry(entry._id)}>
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Link to="/journal" className="view-history-button back-link">
                Back to Journal
            </Link>
        </section>
    );
};

export default JournalHistory;
