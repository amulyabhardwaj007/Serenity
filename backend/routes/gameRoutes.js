const express = require('express');
const router = express.Router();
const GameRoom = require('../models/GameRoom');
const auth = require('../middleware/auth');

const generateRoomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const getWinner = (board) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
    }
    return board.every(Boolean) ? 'DRAW' : '';
};

const buildPayload = (room, userId) => {
    const me = room.players.find((player) => player.userId.toString() === userId.toString());
    return {
        roomCode: room.roomCode,
        board: room.board,
        currentPlayer: room.currentPlayer,
        winner: room.winner,
        status: room.status,
        players: room.players.map((player) => ({ symbol: player.symbol })),
        yourSymbol: me ? me.symbol : '',
    };
};

router.post('/rooms', auth, async (req, res) => {
    try {
        let code = generateRoomCode();
        while (await GameRoom.exists({ roomCode: code })) {
            code = generateRoomCode();
        }

        const room = await GameRoom.create({
            roomCode: code,
            createdBy: req.user.id,
            players: [{ userId: req.user.id, symbol: 'X' }],
            status: 'waiting',
        });

        res.status(201).json(buildPayload(room, req.user.id));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/rooms/:roomCode', auth, async (req, res) => {
    try {
        const room = await GameRoom.findOne({ roomCode: req.params.roomCode.toUpperCase() });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const alreadyJoined = room.players.some(
            (player) => player.userId.toString() === req.user.id.toString(),
        );

        if (!alreadyJoined && room.players.length < 2) {
            room.players.push({ userId: req.user.id, symbol: 'O' });
            if (room.status === 'waiting') room.status = 'active';
            await room.save();
        }

        res.json(buildPayload(room, req.user.id));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/rooms/:roomCode/move', auth, async (req, res) => {
    try {
        const room = await GameRoom.findOne({ roomCode: req.params.roomCode.toUpperCase() });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        if (room.status !== 'active') return res.status(400).json({ message: 'Game is not active yet.' });

        const me = room.players.find((player) => player.userId.toString() === req.user.id.toString());
        if (!me) return res.status(403).json({ message: 'Join this room first.' });
        if (room.winner) return res.status(400).json({ message: 'Game is already finished.' });
        if (me.symbol !== room.currentPlayer) return res.status(400).json({ message: 'Not your turn.' });

        const index = Number(req.body.index);
        if (!Number.isInteger(index) || index < 0 || index > 8) {
            return res.status(400).json({ message: 'Invalid move index.' });
        }
        if (room.board[index]) return res.status(400).json({ message: 'Cell already filled.' });

        room.board[index] = me.symbol;
        const result = getWinner(room.board);
        if (result) {
            room.winner = result;
            room.status = 'finished';
        } else {
            room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
        }

        await room.save();
        res.json(buildPayload(room, req.user.id));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/rooms/:roomCode/reset', auth, async (req, res) => {
    try {
        const room = await GameRoom.findOne({ roomCode: req.params.roomCode.toUpperCase() });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const me = room.players.find((player) => player.userId.toString() === req.user.id.toString());
        if (!me) return res.status(403).json({ message: 'Join this room first.' });

        room.board = ['', '', '', '', '', '', '', '', ''];
        room.currentPlayer = 'X';
        room.winner = '';
        room.status = room.players.length < 2 ? 'waiting' : 'active';
        await room.save();

        res.json(buildPayload(room, req.user.id));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
