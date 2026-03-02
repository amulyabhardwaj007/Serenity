import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const SpotifyIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="11" fill="#1DB954" />
        <path d="M17.5 15.8a.73.73 0 0 1-1 .23c-2.75-1.68-6.22-2.06-10.3-1.1a.73.73 0 1 1-.33-1.42c4.46-1.02 8.3-.58 11.4 1.31a.73.73 0 0 1 .23.98Z" fill="#fff" />
        <path d="M18.95 13.06a.92.92 0 0 1-1.27.3c-3.15-1.94-7.94-2.5-11.67-1.37a.92.92 0 0 1-.53-1.76c4.28-1.3 9.61-.68 13.16 1.5.43.26.57.83.31 1.27Z" fill="#fff" />
        <path d="M19.08 10.2C15.3 7.95 9.06 7.74 5.45 8.8a1.1 1.1 0 1 1-.62-2.11c4.14-1.23 11.02-.99 15.38 1.6a1.1 1.1 0 1 1-1.13 1.9Z" fill="#fff" />
    </svg>
);

const YouTubeIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
            fill="#FF0000"
            d="M23.5 7.2a3 3 0 0 0-2.1-2.12C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.58A3 3 0 0 0 .5 7.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.12c1.9.58 9.4.58 9.4.58s7.5 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-4.8ZM9.6 15.2V8.8l6 3.2-6 3.2Z"
        />
    </svg>
);

const MusicSection = () => {
    const MAX_PLAYLISTS = 3;
    const [spotifyInput, setSpotifyInput] = useState('');
    const [youtubeInput, setYoutubeInput] = useState('');
    const [savedSpotify, setSavedSpotify] = useState([]);
    const [savedYoutube, setSavedYoutube] = useState([]);
    const [status, setStatus] = useState({ type: '', text: '' });

    const extractSpotifyPlaylistId = (value) => {
        if (!value) return '';
        const trimmed = value.trim();
        const uriMatch = trimmed.match(/^spotify:playlist:([a-zA-Z0-9]+)$/);
        if (uriMatch) return uriMatch[1];
        const urlMatch = trimmed.match(/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
        return urlMatch ? urlMatch[1] : '';
    };

    const extractYoutubePlaylistId = (value) => {
        if (!value) return '';
        const trimmed = value.trim();
        const urlMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
        return urlMatch ? urlMatch[1] : '';
    };

    const normalizeStoredList = (rawValue, extractor) => {
        if (Array.isArray(rawValue)) {
            return rawValue
                .map((item) => String(item).trim())
                .filter((item) => !!extractor(item))
                .slice(0, MAX_PLAYLISTS);
        }
        if (typeof rawValue === 'string') {
            const single = rawValue.trim();
            return extractor(single) ? [single] : [];
        }
        return [];
    };

    useEffect(() => {
        const stored = localStorage.getItem('serenity_music_sources');
        if (!stored) return;
        try {
            const parsed = JSON.parse(stored);
            setSavedSpotify(normalizeStoredList(parsed.spotify, extractSpotifyPlaylistId));
            setSavedYoutube(normalizeStoredList(parsed.youtube, extractYoutubePlaylistId));
        } catch (err) {
            console.error(err);
        }
    }, []);

    const saveSources = (nextSpotifyList, nextYoutubeList) => {
        localStorage.setItem(
            'serenity_music_sources',
            JSON.stringify({ spotify: nextSpotifyList, youtube: nextYoutubeList }),
        );
    };

    const spotifyEmbeds = useMemo(
        () =>
            savedSpotify
                .map((url) => {
                    const id = extractSpotifyPlaylistId(url);
                    if (!id) return null;
                    return {
                        id,
                        url,
                        embedUrl: `https://open.spotify.com/embed/playlist/${id}?utm_source=generator`,
                    };
                })
                .filter(Boolean),
        [savedSpotify],
    );

    const youtubeEmbeds = useMemo(
        () =>
            savedYoutube
                .map((url) => {
                    const id = extractYoutubePlaylistId(url);
                    if (!id) return null;
                    return {
                        id,
                        url,
                        embedUrl: `https://www.youtube.com/embed/videoseries?list=${id}`,
                    };
                })
                .filter(Boolean),
        [savedYoutube],
    );

    const handleSaveSpotify = () => {
        const id = extractSpotifyPlaylistId(spotifyInput);
        if (!id) {
            setStatus({ type: 'error', text: 'Enter a valid Spotify playlist link.' });
            return;
        }
        if (savedSpotify.length >= MAX_PLAYLISTS) {
            setStatus({ type: 'error', text: `You can save up to ${MAX_PLAYLISTS} Spotify playlists.` });
            return;
        }
        if (savedSpotify.some((url) => extractSpotifyPlaylistId(url) === id)) {
            setStatus({ type: 'error', text: 'This Spotify playlist is already saved.' });
            return;
        }
        const next = spotifyInput.trim();
        const nextSpotify = [...savedSpotify, next];
        setSavedSpotify(nextSpotify);
        saveSources(nextSpotify, savedYoutube);
        setSpotifyInput('');
        setStatus({ type: 'success', text: 'Spotify playlist saved.' });
    };

    const handleSaveYoutube = () => {
        const id = extractYoutubePlaylistId(youtubeInput);
        if (!id) {
            setStatus({ type: 'error', text: 'Enter a valid YouTube or YouTube Music playlist link.' });
            return;
        }
        if (savedYoutube.length >= MAX_PLAYLISTS) {
            setStatus({ type: 'error', text: `You can save up to ${MAX_PLAYLISTS} YouTube playlists.` });
            return;
        }
        if (savedYoutube.some((url) => extractYoutubePlaylistId(url) === id)) {
            setStatus({ type: 'error', text: 'This YouTube playlist is already saved.' });
            return;
        }
        const next = youtubeInput.trim();
        const nextYoutube = [...savedYoutube, next];
        setSavedYoutube(nextYoutube);
        saveSources(savedSpotify, nextYoutube);
        setYoutubeInput('');
        setStatus({ type: 'success', text: 'YouTube playlist saved.' });
    };

    const removeSpotifyPlaylist = (id) => {
        const nextSpotify = savedSpotify.filter((url) => extractSpotifyPlaylistId(url) !== id);
        setSavedSpotify(nextSpotify);
        saveSources(nextSpotify, savedYoutube);
        setStatus({ type: 'success', text: 'Spotify playlist removed.' });
    };

    const removeYoutubePlaylist = (id) => {
        const nextYoutube = savedYoutube.filter((url) => extractYoutubePlaylistId(url) !== id);
        setSavedYoutube(nextYoutube);
        saveSources(savedSpotify, nextYoutube);
        setStatus({ type: 'success', text: 'YouTube playlist removed.' });
    };

    const tracks = [
        {
            title: 'Lofi Hip Hop Radio',
            vibe: 'Chill beats to focus and relax',
            embedUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
            bgClass: 'music-bg-night',
        },
        {
            title: 'Sleep and Chill Radio',
            vibe: 'Gentle night-time beats for meditation and sleep',
            embedUrl: 'https://www.youtube.com/embed/lTRiuFIWV54',
            bgClass: 'music-bg-sleep',
        },
        {
            title: 'Jazz Lofi Radio',
            vibe: 'Warm jazz textures for calm focus and relaxed mornings',
            embedUrl: 'https://www.youtube.com/embed/HuFYqnbVbzY',
            bgClass: 'music-bg-piano',
        },
        {
            title: 'Synthwave Relax Stream',
            vibe: 'Warm retro waves for evening unwinding',
            embedUrl: 'https://www.youtube.com/embed/4xDzrJKXOOY',
            bgClass: 'music-bg-synth',
        },
    ];

    return (
        <section className="page section-shell">
            <div className="page-header">
                <p className="eyebrow">Audio reset</p>
                <h2>Meditational and Soothing Music</h2>
                <p className="muted">Curated Lofi Girl sessions with mood-themed visuals.</p>
            </div>

            <div className="dashboard-grid">
                {tracks.map((track, index) => (
                    <motion.article
                        key={track.title}
                        className={`card music-card ${track.bgClass}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.07 }}
                        whileHover={{ y: -6 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <h3>{track.title}</h3>
                        <p className="muted">{track.vibe}</p>
                        <div className="video-frame">
                            <iframe
                                src={track.embedUrl}
                                title={track.title}
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.article>
                ))}
            </div>

            <motion.div
                className="card section-card playlist-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.1 }}
            >
                <h3>Your Playlists</h3>
                <p className="muted">Save up to 3 playlists per platform. Remove any time.</p>
                {status.text && (
                    <p className={`notice ${status.type === 'error' ? 'notice-error' : 'notice-success'}`}>{status.text}</p>
                )}

                <div className="playlist-grid">
                    <div className="playlist-source">
                        <label className="playlist-label">
                            <span className="platform-icon" aria-hidden="true"><SpotifyIcon /></span>
                        </label>
                        <div className="playlist-input-row">
                            <input
                                aria-label="Spotify playlist URL"
                                value={spotifyInput}
                                onChange={(e) => setSpotifyInput(e.target.value)}
                                placeholder="https://open.spotify.com/playlist/..."
                            />
                            <button type="button" onClick={handleSaveSpotify} disabled={savedSpotify.length >= MAX_PLAYLISTS}>Save</button>
                        </div>
                        <p className="muted">Saved: {savedSpotify.length}/{MAX_PLAYLISTS}</p>
                        {spotifyEmbeds.length ? (
                            spotifyEmbeds.map((playlist, index) => (
                                <div key={`${playlist.id}-${index}`} className="stack">
                                    <div className="entry-footer">
                                        <span>Playlist {index + 1}</span>
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => removeSpotifyPlaylist(playlist.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="spotify-frame">
                                        <iframe
                                            title={`Spotify Playlist ${index + 1}`}
                                            src={playlist.embedUrl}
                                            loading="lazy"
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="muted">Add a public Spotify playlist to load it.</p>
                        )}
                    </div>

                    <div className="playlist-source">
                        <label className="playlist-label">
                            <span className="platform-icon" aria-hidden="true"><YouTubeIcon /></span>
                        </label>
                        <div className="playlist-input-row">
                            <input
                                aria-label="YouTube or YouTube Music playlist URL"
                                value={youtubeInput}
                                onChange={(e) => setYoutubeInput(e.target.value)}
                                placeholder="https://music.youtube.com/playlist?list=..."
                            />
                            <button type="button" onClick={handleSaveYoutube} disabled={savedYoutube.length >= MAX_PLAYLISTS}>Save</button>
                        </div>
                        <p className="muted">Saved: {savedYoutube.length}/{MAX_PLAYLISTS}</p>
                        {youtubeEmbeds.length ? (
                            youtubeEmbeds.map((playlist, index) => (
                                <div key={`${playlist.id}-${index}`} className="stack">
                                    <div className="entry-footer">
                                        <span>Playlist {index + 1}</span>
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => removeYoutubePlaylist(playlist.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="video-frame">
                                        <iframe
                                            title={`YouTube Playlist ${index + 1}`}
                                            src={playlist.embedUrl}
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="muted">Add a public YouTube playlist to load it.</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default MusicSection;
