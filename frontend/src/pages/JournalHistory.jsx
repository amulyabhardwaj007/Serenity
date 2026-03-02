import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PAGE_LIMIT = 10;

const JournalHistory = () => {
    const [entries, setEntries] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const token = localStorage.getItem('token');

    const fetchEntries = async (targetPage = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/journal`, {
                params: { page: targetPage, limit: PAGE_LIMIT },
                headers: { Authorization: `Bearer ${token}` },
            });

            const payload = res.data;
            setEntries(payload.entries || []);
            setPage(payload.page || targetPage);
            setTotalPages(payload.totalPages || 1);
            setTotalEntries(payload.totalEntries || 0);
            setStatusMessage('');
        } catch (err) {
            setStatusMessage('Failed to load entries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries(1);
    }, []);

    const deleteEntry = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/journal/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const remainingOnPage = entries.length - 1;
            const targetPage = remainingOnPage === 0 && page > 1 ? page - 1 : page;
            await fetchEntries(targetPage);
            setStatusMessage('');
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Failed to delete entry');
        }
    };

    return (
        <section className="page page-narrow section-shell">
            <div className="page-header">
                <p className="eyebrow">Journal history</p>
                <h2>Previous Entries</h2>
                <p className="muted">You can review and delete old entries here.</p>
                {statusMessage && <p className="notice notice-error">{statusMessage}</p>}
            </div>

            <div className="stack">
                <p className="muted">Total entries: {totalEntries}</p>
                {loading && <p className="muted">Loading...</p>}
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

            <div className="game-actions">
                <button type="button" onClick={() => fetchEntries(page - 1)} disabled={page <= 1 || loading}>
                    Previous
                </button>
                <span className="muted">Page {page} of {totalPages}</span>
                <button type="button" onClick={() => fetchEntries(page + 1)} disabled={page >= totalPages || loading}>
                    Next
                </button>
            </div>

            <Link to="/journal" className="view-history-button back-link">
                Back to Journal
            </Link>
        </section>
    );
};

export default JournalHistory;
