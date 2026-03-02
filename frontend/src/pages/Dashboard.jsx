import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const shouldReduceMotion = useReducedMotion();

    const features = [
        {
            key: 'music',
            title: 'Soothing Music',
            path: '/music',
            badge: 'MUSIC',
            emoji: '🎧',
            desc: 'Curated lofi and your own playlists.',
            colors: {
                accent: '#5ebfdc',
                surfaceA: '#f2fbff',
                surfaceB: '#e2f5ff',
                badge: '#d3f0fb',
                iconA: '#c4ebf7',
                iconB: '#ffe0b7',
            },
        },
        {
            key: 'journal',
            title: 'Personal Journal',
            path: '/journal',
            badge: 'WRITE',
            emoji: '📝',
            desc: 'Capture reflections and track progress.',
            colors: {
                accent: '#efb96d',
                surfaceA: '#fffaf1',
                surfaceB: '#ffefda',
                badge: '#ffe7c0',
                iconA: '#ffe0b5',
                iconB: '#ffd3c1',
            },
        },
        {
            key: 'games',
            title: 'Mini Games',
            path: '/games',
            badge: 'PLAY',
            emoji: '🎮',
            desc: 'Online tic-tac-toe and memory mode.',
            colors: {
                accent: '#84d49e',
                surfaceA: '#f3fff5',
                surfaceB: '#e6f9ea',
                badge: '#d7f4df',
                iconA: '#bdecc9',
                iconB: '#d5f5f2',
            },
        },
        {
            key: 'tips',
            title: 'Relaxation Tips',
            path: '/tips',
            badge: 'CALM',
            emoji: '🌿',
            desc: 'Science-backed techniques for stress.',
            colors: {
                accent: '#ef9db0',
                surfaceA: '#fff5f8',
                surfaceB: '#ffe8f0',
                badge: '#ffdbe8',
                iconA: '#ffd0e2',
                iconB: '#ffe7bf',
            },
        },
        {
            key: 'meditation',
            title: 'Meditation Timer',
            path: '/meditation',
            badge: 'BREATHE',
            emoji: '🧘',
            desc: 'Guided timer with ambient sounds.',
            colors: {
                accent: '#8aaeff',
                surfaceA: '#f4f7ff',
                surfaceB: '#e7efff',
                badge: '#dce6ff',
                iconA: '#d4e1ff',
                iconB: '#d9f2ff',
            },
        },
        {
            key: 'yoga',
            title: 'Yoga Tutorials',
            path: '/yoga',
            badge: 'MOVE',
            emoji: '🧎',
            desc: 'Simple routines for mind and body.',
            colors: {
                accent: '#caa6f7',
                surfaceA: '#fbf6ff',
                surfaceB: '#f2e9ff',
                badge: '#e9dcff',
                iconA: '#e2d2ff',
                iconB: '#ffe3f2',
            },
        },
    ];

    return (
        <section
            className="section-shell dashboard-screen"
            style={{
                '--hero-glow-a': 'rgba(255, 216, 143, 0.33)',
                '--hero-glow-b': 'rgba(114, 197, 223, 0.24)',
                '--hero-base': 'rgba(255, 255, 255, 0.9)',
                '--hero-ring': '#72c5df',
                '--hero-side': '#ffbf77',
                '--hero-text': '#102336',
                '--hero-muted': 'rgba(16, 35, 54, 0.8)',
                '--hero-metric-bg': 'rgba(255, 255, 255, 0.75)',
                '--hero-metric-text': '#173e54',
                '--hero-metric-sub': 'rgba(39, 81, 105, 0.9)',
            }}
        >
            <div className="dashboard-main-grid">
                <motion.article
                    className="card dashboard-left-hero"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.004 }}
                >
                    <p className="eyebrow">Your calm cockpit</p>
                    <h1>Design your next peaceful hour</h1>
                    <p className="muted">
                        Choose one module, start a small ritual, and close your day with less stress and more clarity.
                    </p>
                    <div className="hero-metrics">
                        <div><strong>06</strong><span>Wellness modules</span></div>
                        <div><strong>01</strong><span>Unified workspace</span></div>
                        <div><strong>24/7</strong><span>Private access</span></div>
                    </div>
                    <motion.svg
                        viewBox="0 0 520 260"
                        className="hero-scene"
                        aria-hidden="true"
                        animate={shouldReduceMotion ? {} : { y: [0, -4, 0] }}
                        transition={shouldReduceMotion ? {} : { duration: 7.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ellipse cx="260" cy="140" rx="170" ry="72" fill="none" stroke="rgba(16,35,54,0.14)" strokeWidth="2" />
                        <ellipse cx="260" cy="140" rx="120" ry="50" fill="none" stroke="rgba(16,35,54,0.11)" strokeWidth="2" />
                        <motion.g
                            animate={shouldReduceMotion ? {} : { rotate: [0, 2.2, 0, -2.2, 0] }}
                            transition={shouldReduceMotion ? {} : { duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ originX: '50%', originY: '54%' }}
                        >
                            <ellipse cx="260" cy="140" rx="82" ry="38" fill="rgba(127, 210, 234, 0.16)" />
                        </motion.g>
                        <circle cx="260" cy="140" r="52" fill="var(--hero-ring)" />
                        <circle cx="353" cy="142" r="18" fill="var(--hero-side)" />
                        <circle cx="176" cy="105" r="10" fill="#a4e0b7" />
                        <rect x="222" y="128" width="76" height="24" rx="12" fill="#ffffff" opacity="0.88" />
                    </motion.svg>
                </motion.article>

                <motion.div
                    className="dashboard-offers-grid"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                >
                    {features.map((feature) => (
                        <Link to={feature.path} key={feature.key} className="feature-link">
                            <motion.article
                                className="offer-card"
                                style={{
                                    '--offer-accent': feature.colors.accent,
                                    '--offer-surface-a': feature.colors.surfaceA,
                                    '--offer-surface-b': feature.colors.surfaceB,
                                    '--offer-badge-bg': feature.colors.badge,
                                    '--offer-icon-a': feature.colors.iconA,
                                    '--offer-icon-b': feature.colors.iconB,
                                    '--offer-title-color': '#18445c',
                                    '--offer-text-color': '#3c6479',
                                    '--offer-badge-color': '#295369',
                                    '--offer-icon-fg': '#134b64',
                                }}
                                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                                whileHover={{
                                    y: -7,
                                    scale: 1.022,
                                    rotateX: -2,
                                    rotateY: 2,
                                    boxShadow: '0 18px 30px rgba(16, 35, 54, 0.2)',
                                }}
                                whileTap={{
                                    scale: 0.975,
                                    rotateX: 1,
                                    rotateY: -1,
                                }}
                                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                            >
                                <svg viewBox="0 0 240 160" className="offer-bg-svg" aria-hidden="true">
                                    <circle cx="188" cy="34" r="24" fill="var(--offer-accent)" opacity="0.45" />
                                    <circle cx="208" cy="68" r="12" fill="var(--offer-accent)" opacity="0.3" />
                                    <path d="M26 126c36-56 112-58 186-34" stroke="var(--offer-accent)" strokeWidth="8" strokeLinecap="round" opacity="0.35" />
                                </svg>
                                <div className="offer-top">
                                    <span className="offer-badge">{feature.badge}</span>
                                    <span className="offer-icon-wrap offer-emoji" aria-hidden="true">{feature.emoji}</span>
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </motion.article>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Dashboard;
