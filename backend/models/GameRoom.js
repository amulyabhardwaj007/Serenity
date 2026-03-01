const mongoose = require('mongoose');

const GameRoomSchema = new mongoose.Schema(
    {
        roomCode: { type: String, required: true, unique: true, index: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        board: {
            type: [String],
            default: ['', '', '', '', '', '', '', '', ''],
        },
        currentPlayer: { type: String, enum: ['X', 'O'], default: 'X' },
        winner: { type: String, default: '' },
        status: { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
        players: {
            type: [
                {
                    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                    symbol: { type: String, enum: ['X', 'O'], required: true },
                },
            ],
            default: [],
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('GameRoom', GameRoomSchema);
