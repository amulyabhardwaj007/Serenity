import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const API = 'http://localhost:5000/api/games';
const CARD_VALUES = ['🌙', '⭐', '☁️', '🌿', '🫧', '🧘', '🎵', '🕯️'];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const buildMemoryDeck = () =>
    shuffle([...CARD_VALUES, ...CARD_VALUES]).map((value, index) => ({
        id: `${value}-${index}`,
        value,
    }));

const getLocalWinner = (board) => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
    }
    return board.every(Boolean) ? 'DRAW' : '';
};

const MiniGames = () => {
    const token = localStorage.getItem('token');
    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedGame, setSelectedGame] = useState('');
    const [tttMode, setTttMode] = useState('online');

    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [room, setRoom] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    const [soloBoard, setSoloBoard] = useState(['', '', '', '', '', '', '', '', '']);
    const [soloCurrent, setSoloCurrent] = useState('X');
    const [soloWinner, setSoloWinner] = useState('');

    const [deck, setDeck] = useState(buildMemoryDeck);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);

    const roomCodeFromUrl = (searchParams.get('room') || '').toUpperCase();

    const loadRoom = async (code) => {
        try {
            const res = await axios.get(`${API}/rooms/${code}`, { headers });
            setRoom(res.data);
            setStatusMessage('');
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Could not load room');
        }
    };

    useEffect(() => {
        if (roomCodeFromUrl) {
            setSelectedGame('ttt');
            setTttMode('online');
            loadRoom(roomCodeFromUrl);
        }
    }, [roomCodeFromUrl]);

    useEffect(() => {
        if (!room?.roomCode || tttMode !== 'online') return;
        const id = setInterval(() => loadRoom(room.roomCode), 2000);
        return () => clearInterval(id);
    }, [room?.roomCode, tttMode]);

    const createRoom = async () => {
        try {
            const res = await axios.post(`${API}/rooms`, {}, { headers });
            setRoom(res.data);
            setSearchParams({ room: res.data.roomCode });
            setStatusMessage('Room created. Invite your friend now.');
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Failed to create room');
        }
    };

    const joinRoom = async () => {
        const code = roomCodeInput.trim().toUpperCase();
        if (!code) return;
        setSearchParams({ room: code });
        await loadRoom(code);
    };

    const makeOnlineMove = async (index) => {
        if (!room || !room.yourSymbol || room.status !== 'active' || room.winner) return;
        if (room.currentPlayer !== room.yourSymbol) return;
        if (room.board[index]) return;

        try {
            const res = await axios.post(`${API}/rooms/${room.roomCode}/move`, { index }, { headers });
            setRoom(res.data);
            setStatusMessage('');
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Move failed');
        }
    };

    const resetOnlineGame = async () => {
        if (!room) return;
        try {
            const res = await axios.post(`${API}/rooms/${room.roomCode}/reset`, {}, { headers });
            setRoom(res.data);
            setStatusMessage('');
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Could not reset');
        }
    };

    const inviteFriend = async () => {
        if (!room?.roomCode) return;
        const inviteUrl = `${window.location.origin}/games?room=${room.roomCode}`;
        try {
            await navigator.clipboard.writeText(inviteUrl);
            setStatusMessage('Invite link copied');
        } catch (err) {
            setStatusMessage(`Share this link: ${inviteUrl}`);
        }
    };

    const makeSoloMove = (index) => {
        if (soloBoard[index] || soloWinner) return;
        const nextBoard = [...soloBoard];
        nextBoard[index] = soloCurrent;
        const result = getLocalWinner(nextBoard);
        setSoloBoard(nextBoard);
        if (result) {
            setSoloWinner(result);
            return;
        }
        setSoloCurrent((prev) => (prev === 'X' ? 'O' : 'X'));
    };

    const resetSoloGame = () => {
        setSoloBoard(['', '', '', '', '', '', '', '', '']);
        setSoloCurrent('X');
        setSoloWinner('');
    };

    const onMemoryCardClick = (index) => {
        if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) return;

        const nextFlipped = [...flipped, index];
        setFlipped(nextFlipped);

        if (nextFlipped.length === 2) {
            setMoves((prev) => prev + 1);
            const [first, second] = nextFlipped;
            if (deck[first].value === deck[second].value) {
                setMatched((prev) => [...prev, first, second]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 650);
            }
        }
    };

    const restartMemory = () => {
        setDeck(buildMemoryDeck());
        setFlipped([]);
        setMatched([]);
        setMoves(0);
    };

    const renderOnlineStatus = () => {
        if (!room) return 'Create or join a room to start.';
        if (room.winner === 'DRAW') return 'Draw game.';
        if (room.winner) return `Winner: ${room.winner}`;
        if (room.status === 'waiting') return 'Waiting for second player to join.';
        return `Current turn: ${room.currentPlayer} ${room.currentPlayer === room.yourSymbol ? '(your turn)' : ''}`;
    };

    const renderSoloStatus = () => {
        if (soloWinner === 'DRAW') return 'Draw game.';
        if (soloWinner) return `Winner: ${soloWinner}`;
        return `Current turn: ${soloCurrent}`;
    };

    const clearGameSelection = () => {
        setSelectedGame('');
    };

    return (
        <section className="page section-shell">
            <div className="page-header">
                <p className="eyebrow">Light break</p>
                <h2>Mini Games</h2>
                <p className="muted">Click a card to open and play.</p>
            </div>

            {!selectedGame && (
                <div className="game-select-grid">
                    <motion.button
                        type="button"
                        className="card game-card game-launch-card"
                        onClick={() => setSelectedGame('ttt')}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <h3>Tic-Tac-Toe</h3>
                        <p>Online invite mode or play with yourself.</p>
                    </motion.button>
                    <motion.button
                        type="button"
                        className="card game-card alt game-launch-card"
                        onClick={() => setSelectedGame('memory')}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <h3>Memory Match</h3>
                        <p>Match all pairs in the fewest moves.</p>
                    </motion.button>
                </div>
            )}

            {selectedGame === 'ttt' && (
                <motion.div
                    className="card game-card playable-game"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <div className="game-top-row">
                        <h3>Tic-Tac-Toe</h3>
                        <button type="button" className="back-pill" onClick={clearGameSelection}>Back</button>
                    </div>

                    <div className="mode-switch">
                        <button
                            type="button"
                            className={tttMode === 'online' ? 'active' : ''}
                            onClick={() => setTttMode('online')}
                        >
                            Online
                        </button>
                        <button
                            type="button"
                            className={tttMode === 'solo' ? 'active' : ''}
                            onClick={() => setTttMode('solo')}
                        >
                            Play With Yourself
                        </button>
                    </div>

                    {tttMode === 'online' && (
                        <>
                            <p className="muted">{renderOnlineStatus()}</p>
                            <div className="game-actions">
                                <button type="button" onClick={createRoom}>Create Room</button>
                                <button type="button" onClick={inviteFriend} disabled={!room?.roomCode}>Invite Friend</button>
                            </div>

                            <div className="join-row">
                                <input
                                    value={roomCodeInput}
                                    onChange={(e) => setRoomCodeInput(e.target.value)}
                                    placeholder="Enter room code"
                                    aria-label="Room code"
                                />
                                <button type="button" onClick={joinRoom}>Join</button>
                            </div>

                            {room?.roomCode && <p className="room-code">Room: {room.roomCode} | You: {room.yourSymbol || 'Spectator'}</p>}
                            {statusMessage && <p className="status-note">{statusMessage}</p>}

                            <div className="ttt-grid">
                                {Array.from({ length: 9 }).map((_, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className="ttt-cell"
                                        onClick={() => makeOnlineMove(index)}
                                        disabled={!room || !!room.winner || room.status !== 'active' || room.board[index] || room.currentPlayer !== room.yourSymbol}
                                    >
                                        {room?.board?.[index] || ''}
                                    </button>
                                ))}
                            </div>
                            <button type="button" className="reset-game-btn" onClick={resetOnlineGame} disabled={!room}>
                                Reset Game
                            </button>
                        </>
                    )}

                    {tttMode === 'solo' && (
                        <>
                            <p className="muted">{renderSoloStatus()}</p>
                            <div className="ttt-grid">
                                {soloBoard.map((cell, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className="ttt-cell"
                                        onClick={() => makeSoloMove(index)}
                                        disabled={!!cell || !!soloWinner}
                                    >
                                        {cell}
                                    </button>
                                ))}
                            </div>
                            <button type="button" className="reset-game-btn" onClick={resetSoloGame}>
                                Reset Solo Game
                            </button>
                        </>
                    )}
                </motion.div>
            )}

            {selectedGame === 'memory' && (
                <motion.div
                    className="card game-card alt playable-game"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <div className="game-top-row">
                        <h3>Memory Match</h3>
                        <button type="button" className="back-pill" onClick={clearGameSelection}>Back</button>
                    </div>
                    <p className="muted">Moves: {moves} | Matched: {matched.length / 2}/{CARD_VALUES.length}</p>

                    <div className="memory-grid">
                        {deck.map((card, index) => {
                            const isOpen = flipped.includes(index) || matched.includes(index);
                            return (
                                <button
                                    type="button"
                                    key={card.id}
                                    className={`memory-card ${isOpen ? 'open' : ''}`}
                                    onClick={() => onMemoryCardClick(index)}
                                    disabled={isOpen}
                                >
                                    {isOpen ? card.value : '?'}
                                </button>
                            );
                        })}
                    </div>

                    <button type="button" className="reset-game-btn" onClick={restartMemory}>
                        Restart Memory Game
                    </button>
                </motion.div>
            )}
        </section>
    );
};

export default MiniGames;
