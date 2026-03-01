import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const poses = [
    {
        name: "Child's Pose (Balasana)",
        benefit: 'Calms the nervous system and relaxes lower back tension.',
        steps: 'Kneel, sit back on heels, fold forward, arms extended. Stay for 1-2 minutes with slow breathing.',
        type: 'restorative',
        image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=80',
        tutorialUrl: 'https://www.youtube.com/watch?v=2MJGg-dUKh0',
    },
    {
        name: 'Cat-Cow Flow',
        benefit: 'Improves spine mobility and helps release stress from neck/back.',
        steps: 'On all fours, alternate arching and rounding your back with each breath for 60-90 seconds.',
        type: 'mobility',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
        tutorialUrl: 'https://www.youtube.com/watch?v=kqnua4rHVVA',
    },
    {
        name: 'Legs Up The Wall (Viparita Karani)',
        benefit: 'Promotes relaxation and can reduce mental fatigue.',
        steps: 'Lie on your back with hips near a wall, extend legs upward, and breathe gently for 5-10 minutes.',
        type: 'restorative',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
        tutorialUrl: 'https://www.youtube.com/watch?v=3qFYxMXCC3A',
    },
];

const YogaPoses = () => {
    const [filter, setFilter] = useState('all');

    const filteredPoses = useMemo(
        () => (filter === 'all' ? poses : poses.filter((pose) => pose.type === filter)),
        [filter],
    );

    return (
        <section className="page section-shell">
            <div className="page-header">
                <p className="eyebrow">Mind + Body</p>
                <h2>Yoga Poses and Tutorials</h2>
                <p className="muted">Gentle poses focused on reducing stress and improving body awareness.</p>
            </div>

            <div className="filter-bar">
                {[
                    { key: 'all', label: 'All' },
                    { key: 'restorative', label: 'Restorative' },
                    { key: 'mobility', label: 'Mobility' },
                ].map((item) => (
                    <button
                        type="button"
                        key={item.key}
                        className={filter === item.key ? 'active' : ''}
                        onClick={() => setFilter(item.key)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="yoga-equal-grid">
                {filteredPoses.map((pose, index) => (
                    <motion.article
                        key={pose.name}
                        className="card yoga-card yoga-equal-card"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.26, delay: index * 0.06 }}
                        whileHover={{ y: -3 }}
                    >
                        <img src={pose.image} alt={pose.name} className="yoga-image" loading="lazy" />
                        <h3>{pose.name}</h3>
                        <p><strong>Why it helps:</strong> {pose.benefit}</p>
                        <p className="tip-howto"><strong>How to do it:</strong> {pose.steps}</p>
                        <a className="tutorial-link" href={pose.tutorialUrl} target="_blank" rel="noreferrer">
                            Watch Tutorial
                        </a>
                    </motion.article>
                ))}
            </div>
        </section>
    );
};

export default YogaPoses;
