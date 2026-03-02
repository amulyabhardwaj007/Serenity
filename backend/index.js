const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const { securityHeaders, apiRateLimiter, authRateLimiter } = require('./middleware/security');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(securityHeaders);
app.use(apiRateLimiter);
app.use(express.json({ limit: '100kb' }));

const PORT = process.env.PORT || 5000;
const isVercel = process.env.VERCEL === '1';
let mongoConnectPromise = null;

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!mongoConnectPromise) {
        mongoConnectPromise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
        });
    }

    await mongoConnectPromise;
};

app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        next(err);
    }
});

app.get('/', (req, res) => {
    res.send('Serenity API is running');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const gameRoutes = require('./routes/gameRoutes');

app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/games', gameRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectToDatabase();
        console.log('MongoDB connected');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

if (!isVercel) {
    startServer();
}

module.exports = app;
