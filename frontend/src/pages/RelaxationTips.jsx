import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const RelaxationTips = () => {
    const [filter, setFilter] = useState('all');
    const tips = [
        {
            title: 'Slow Breathing (5-6 Breaths/Min)',
            desc: 'Controlled slow breathing can reduce stress arousal and improve heart rate variability in many people.',
            howTo: 'Try 4s inhale + 6s exhale for 3-5 minutes.',
            type: 'breath',
            image:
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
        },
        {
            title: 'Mindfulness Body Scan',
            desc: 'Mindfulness-based practices are linked to reduced anxiety symptoms and better emotional regulation.',
            howTo: 'Spend 5-10 minutes moving attention from head to toe without judging sensations.',
            type: 'mindfulness',
            image:
                'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=1200&q=80',
        },
        {
            title: 'Progressive Muscle Relaxation',
            desc: 'PMR has evidence for decreasing physical tension and perceived stress.',
            howTo: 'Tense and release each muscle group for 5-7 seconds, then relax for 15-20 seconds.',
            type: 'body',
            image:
                'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80',
        },
        {
            title: '10-Minute Nature Walk',
            desc: 'Short walks, especially in greener spaces, can improve mood and lower stress markers.',
            howTo: 'Walk without multitasking; focus on breathing, sounds, and surroundings.',
            type: 'nature',
            image:
                'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80',
        },
        {
            title: 'NSDR / Yoga Nidra',
            desc: 'Short non-sleep deep rest sessions can improve calmness and mental recovery.',
            howTo: 'Lie down comfortably, close your eyes, and follow a 10-minute guided NSDR audio.',
            type: 'mindfulness',
            image:
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        },
        {
            title: 'Consistent Sleep Wind-Down',
            desc: 'A stable pre-sleep routine is associated with better sleep quality and mood regulation.',
            howTo: 'Dim lights, avoid screens, and keep a regular bedtime for at least 30 minutes before sleep.',
            type: 'body',
            image:
                'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?auto=format&fit=crop&w=1200&q=80',
        },
    ];

    const filteredTips = useMemo(
        () => (filter === 'all' ? tips : tips.filter((tip) => tip.type === filter)),
        [filter],
    );

    return (
        <section className="page section-shell">
            <div className="page-header">
                <p className="eyebrow">Slow down</p>
                <h2>Relaxation Tips</h2>
                <p className="muted">Simple ways to find peace in a busy day.</p>
            </div>

            <div className="filter-bar">
                {[
                    { key: 'all', label: 'All' },
                    { key: 'breath', label: 'Breath' },
                    { key: 'mindfulness', label: 'Mindfulness' },
                    { key: 'body', label: 'Body' },
                    { key: 'nature', label: 'Nature' },
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

            <div className="tips-equal-grid">
                {filteredTips.map((tip, index) => (
                    <motion.div
                        key={tip.title}
                        className="card tip-card tip-equal-card"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.24, delay: index * 0.06 }}
                        whileHover={{ y: -4 }}
                    >
                        <img src={tip.image} alt={tip.title} className="tip-image" loading="lazy" />
                        <h3>{tip.title}</h3>
                        <p>{tip.desc}</p>
                        <p className="tip-howto">{tip.howTo}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default RelaxationTips;
