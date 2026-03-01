import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const soundOptions = [
    {
        key: 'ocean',
        label: 'Ocean Waves',
        embed: 'https://www.youtube.com/embed/V-_O7nl0Ii0',
    },
    {
        key: 'rain',
        label: 'Rain + Waves',
        embed: 'https://www.youtube.com/embed/mPZkdNFkNps',
    },
    {
        key: 'om',
        label: 'Om Chants',
        embed: 'https://www.youtube.com/embed/8sYK7lm3UKg',
    },
];

const Meditation = () => {
    const [minutes, setMinutes] = useState(10);
    const [secondsLeft, setSecondsLeft] = useState(10 * 60);
    const [running, setRunning] = useState(false);
    const [soundKey, setSoundKey] = useState('ocean');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        if (!running) return undefined;
        if (secondsLeft <= 0) {
            setRunning(false);
            return undefined;
        }

        const timer = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [running, secondsLeft]);

    useEffect(() => {
        const clock = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(clock);
    }, []);

    const chooseMinutes = (value) => {
        setMinutes(value);
        setSecondsLeft(value * 60);
        setRunning(false);
    };

    const resetTimer = () => {
        setRunning(false);
        setSecondsLeft(minutes * 60);
    };

    const timeDisplay = useMemo(() => {
        const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
        const secs = (secondsLeft % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }, [secondsLeft]);

    const activeSound = soundOptions.find((option) => option.key === soundKey);
    const secondDeg = now.getSeconds() * 6;
    const minuteDeg = now.getMinutes() * 6 + now.getSeconds() * 0.1;
    const hourDeg = ((now.getHours() % 12) / 12) * 360 + now.getMinutes() * 0.5;

    return (
        <section className="page section-shell meditation-page">
            <div className="page-header">
                <p className="eyebrow">Breathe</p>
                <h2>Meditation Timer</h2>
                <p className="muted">Set your session and pair it with a calming sound.</p>
            </div>

            <motion.div
                className="card meditation-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
            >
                <div className="meditation-layout">
                    <div className="meditation-controls">
                        <div className="live-clock-wrap">
                            <span className="live-clock-label">Current Time</span>
                            <div className="analog-clock" aria-label="Analog clock">
                                <span className="clock-dot" />
                                <span className="clock-hand hour-hand" style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }} />
                                <span className="clock-hand minute-hand" style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }} />
                                <span className="clock-hand second-hand" style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }} />
                            </div>
                        </div>
                        <div className="time-display">{timeDisplay}</div>

                        <div className="duration-buttons">
                            {[5, 10, 15, 20].map((value) => (
                                <button
                                    type="button"
                                    key={value}
                                    onClick={() => chooseMinutes(value)}
                                    className={minutes === value ? 'active' : ''}
                                >
                                    {value} min
                                </button>
                            ))}
                        </div>

                        <div className="timer-controls">
                            <button type="button" onClick={() => setRunning(true)} disabled={running || secondsLeft === 0}>Start</button>
                            <button type="button" onClick={() => setRunning(false)} disabled={!running}>Pause</button>
                            <button type="button" onClick={resetTimer}>Reset</button>
                        </div>

                        <div className="sound-options">
                            {soundOptions.map((option) => (
                                <button
                                    type="button"
                                    key={option.key}
                                    className={soundKey === option.key ? 'active' : ''}
                                    onClick={() => setSoundKey(option.key)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        <p className="muted">Current sound: {activeSound?.label}</p>
                    </div>

                    <div className="meditation-preview">
                        <div className="video-frame meditation-frame">
                            <iframe
                                title="Meditation sound"
                                src={`${activeSound?.embed}?autoplay=0`}
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Meditation;
