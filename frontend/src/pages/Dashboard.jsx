import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const features = [
        {
            title: 'Soothing Music',
            path: '/music',
            color: 'var(--pastel-blue)',
            badge: 'MUSIC',
            icon: '🎵',
            desc: 'Play curated lofi and your own Spotify/YouTube playlists.',
        },
        {
            title: 'Personal Journal',
            path: '/journal',
            color: 'var(--pastel-pink)',
            badge: 'WRITE',
            icon: '📓',
            desc: 'Write reflections, then manage history separately.',
        },
        {
            title: 'Mini Games',
            path: '/games',
            color: 'var(--pastel-yellow)',
            badge: 'PLAY',
            icon: '🎮',
            desc: 'Play online Tic-Tac-Toe or solo and memory match.',
        },
        {
            title: 'Relaxation Tips',
            path: '/tips',
            color: 'var(--pastel-lilac)',
            badge: 'CALM',
            icon: '🧘',
            desc: 'Science-backed calming techniques with visuals.',
        },
        {
            title: 'Meditation Timer',
            path: '/meditation',
            color: 'var(--pastel-blue)',
            badge: 'BREATHE',
            icon: '🕉️',
            desc: 'Set timer and switch sound modes: ocean, rain, and om.',
        },
        {
            title: 'Yoga Tutorials',
            path: '/yoga',
            color: 'var(--pastel-pink)',
            badge: 'MOVE',
            icon: '🧎',
            desc: 'Follow guided poses for mind and body relief.',
        },
    ];

    return (
        <section className="page section-shell">
            <div className="page-header">
                <p className="eyebrow">Your space</p>
                <h1>Hello, Friend</h1>
                <p className="muted">Pick what you need right now. Everything is one tap away.</p>
            </div>

            <motion.div
                className="dashboard-grid dashboard-grid-six"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
                }}
            >
                {features.map((feature) => (
                    <Link to={feature.path} key={feature.path} className="feature-link">
                        <motion.div
                            className="feature-card"
                            style={{ backgroundColor: feature.color }}
                            variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                            whileHover={{ y: -8, scale: 1.012 }}
                            whileTap={{ scale: 0.985 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                            <span className="feature-badge">{feature.badge}</span>
                            <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </section>
    );
};

export default Dashboard;
