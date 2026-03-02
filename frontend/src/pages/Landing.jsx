import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = ({ isAuth }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handlePointerMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({
            x: -py * 10,
            y: px * 14,
        });
    };

    const resetTilt = () => setTilt({ x: 0, y: 0 });

    return (
        <section className="page landing-shell">
            <motion.div
                className="landing-hero card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="landing-copy">
                    <p className="eyebrow">Serenity platform</p>
                    <h1>Stress care with a product-grade calm interface</h1>
                    <p className="muted">
                        Journal your thoughts, play mindful mini-games, run guided routines, and manage your mood ritual from one elegant workspace.
                    </p>
                    <div className="landing-cta">
                        {isAuth ? (
                            <Link to="/dashboard" className="view-history-button">Go to Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/signup" className="view-history-button">Get Started</Link>
                                <Link to="/login" className="view-history-button">Login</Link>
                            </>
                        )}
                    </div>
                </div>
                <div
                    className="landing-visual-wrap"
                    onMouseMove={handlePointerMove}
                    onMouseLeave={resetTilt}
                >
                    <motion.div
                        className="landing-visual"
                        style={{ rotateX: tilt.x, rotateY: tilt.y }}
                        animate={{ y: [0, -7, 0] }}
                        transition={{ y: { duration: 5.6, repeat: Infinity, ease: 'easeInOut' } }}
                    >
                        <svg viewBox="0 0 560 420" className="landing-svg" aria-hidden="true">
                            <defs>
                                <linearGradient id="glassA" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#E9F8FF" />
                                    <stop offset="100%" stopColor="#C6EAF8" />
                                </linearGradient>
                                <linearGradient id="glassB" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFE8C1" />
                                    <stop offset="100%" stopColor="#FBD091" />
                                </linearGradient>
                            </defs>
                            <rect x="40" y="38" width="480" height="340" rx="32" fill="url(#glassA)" opacity="0.75" />
                            <rect x="82" y="86" width="392" height="240" rx="22" fill="#FFFFFF" opacity="0.8" />
                            <rect x="114" y="118" width="156" height="124" rx="14" fill="#E2F5E9" />
                            <rect x="292" y="118" width="146" height="58" rx="12" fill="#E6F4FF" />
                            <rect x="292" y="184" width="146" height="58" rx="12" fill="#FFF1DB" />
                            <circle cx="192" cy="182" r="31" fill="url(#glassB)" />
                            <path d="M168 182h48" stroke="#134A66" strokeWidth="5" strokeLinecap="round" />
                            <path d="M192 158v48" stroke="#134A66" strokeWidth="5" strokeLinecap="round" />
                            <circle cx="454" cy="92" r="18" fill="#9DDFD7" />
                            <circle cx="104" cy="324" r="14" fill="#92D8F1" />
                            <circle cx="498" cy="330" r="12" fill="#FFD48E" />
                        </svg>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Landing;
