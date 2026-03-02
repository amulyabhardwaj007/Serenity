const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const GameRoom = require('../models/GameRoom');
const auth = require('../middleware/auth');
const { validateRoomCodeParam, validateGameMove } = require('../middleware/requestValidation');

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

const parseObjectId = (value) => {
    try {
        return new mongoose.Types.ObjectId(value);
    } catch (error) {
        return null;
    }
};

router.post('/rooms', auth, async (req, res, next) => {
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

        return res.status(201).json(buildPayload(room, req.user.id));
    } catch (error) {
        return next(error);
    }
});

router.get('/rooms/:roomCode', auth, validateRoomCodeParam, async (req, res, next) => {
    try {
        let room = await GameRoom.findOne({ roomCode: req.params.roomCode });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const alreadyJoined = room.players.some(
            (player) => player.userId.toString() === req.user.id.toString(),
        );

        if (!alreadyJoined) {
            const userId = parseObjectId(req.user.id);
            if (!userId) return res.status(400).json({ message: 'Invalid user id.' });

            const joinedRoom = await GameRoom.findOneAndUpdate(
                {
                    roomCode: req.params.roomCode,
                    players: { $not: { $elemMatch: { userId } } },
                    'players.1': { $exists: false },
                },
                {
                    $push: { players: { userId, symbol: 'O' } },
                    $set: { status: 'active' },
                },
                { new: true },
            );

            room = joinedRoom || await GameRoom.findOne({ roomCode: req.params.roomCode });
        }

        return res.json(buildPayload(room, req.user.id));
    } catch (error) {
        return next(error);
    }
});

router.post('/rooms/:roomCode/move', auth, validateRoomCodeParam, validateGameMove, async (req, res, next) => {
    try {
        const room = await GameRoom.findOne({ roomCode: req.params.roomCode });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        if (room.status !== 'active') return res.status(400).json({ message: 'Game is not active yet.' });
        if (room.winner) return res.status(400).json({ message: 'Game is already finished.' });

        const me = room.players.find((player) => player.userId.toString() === req.user.id.toString());
        if (!me) return res.status(403).json({ message: 'Join this room first.' });
        if (me.symbol !== room.currentPlayer) return res.status(400).json({ message: 'Not your turn.' });

        const index = req.body.index;
        if (room.board[index]) return res.status(400).json({ message: 'Cell already filled.' });

        const nextBoard = [...room.board];
        nextBoard[index] = me.symbol;
        const result = getWinner(nextBoard);
        const update = {
            $set: {
                [`board.${index}`]: me.symbol,
            },
        };

        if (result) {
            update.$set.winner = result;
            update.$set.status = 'finished';
        } else {
            update.$set.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
        }

        const updatedRoom = await GameRoom.findOneAndUpdate(
            {
                _id: room._id,
                status: 'active',
                winner: '',
                currentPlayer: me.symbol,
                [`board.${index}`]: '',
            },
            update,
            { new: true },
        );

        if (!updatedRoom) {
            const latestRoom = await GameRoom.findById(room._id);
            return res.status(409).json({
                message: 'Move conflict detected. Please retry.',
                room: latestRoom ? buildPayload(latestRoom, req.user.id) : null,
            });
        }

        return res.json(buildPayload(updatedRoom, req.user.id));
    } catch (error) {
        return next(error);
    }
});

router.post('/rooms/:roomCode/reset', auth, validateRoomCodeParam, async (req, res, next) => {
    try {
        const room = await GameRoom.findOne({ roomCode: req.params.roomCode });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const me = room.players.find((player) => player.userId.toString() === req.user.id.toString());
        if (!me) return res.status(403).json({ message: 'Join this room first.' });

        room.board = ['', '', '', '', '', '', '', '', ''];
        room.currentPlayer = 'X';
        room.winner = '';
        room.status = room.players.length < 2 ? 'waiting' : 'active';
        await room.save();

        return res.json(buildPayload(room, req.user.id));
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
