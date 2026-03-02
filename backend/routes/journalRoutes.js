const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');
const { validateJournalCreate } = require('../middleware/requestValidation');

const ENTRY_LIMIT = Number(process.env.JOURNAL_ENTRY_LIMIT || 200);
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Create Journal Entry
router.post('/', auth, validateJournalCreate, async (req, res, next) => {
    try {
        const { title, content, mood } = req.body;
        const entryCount = await Journal.countDocuments({ userId: req.user.id });
        if (entryCount >= ENTRY_LIMIT) {
            return res.status(400).json({ message: `Entry limit reached (${ENTRY_LIMIT}). Delete older entries to add new ones.` });
        }

        const newEntry = new Journal({
            userId: req.user.id,
            title,
            content,
            mood,
        });
        const savedEntry = await newEntry.save();
        return res.status(201).json(savedEntry);
    } catch (error) {
        return next(error);
    }
});

// Get User Entries (paginated)
router.get('/', auth, async (req, res, next) => {
    try {
        const page = Math.max(Number.parseInt(req.query.page, 10) || DEFAULT_PAGE, 1);
        const requestedLimit = Number.parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
        const limit = Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
        const skip = (page - 1) * limit;

        const [entries, totalEntries] = await Promise.all([
            Journal.find({ userId: req.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Journal.countDocuments({ userId: req.user.id }),
        ]);

        const totalPages = Math.max(Math.ceil(totalEntries / limit), 1);

        return res.json({
            entries,
            page,
            limit,
            totalEntries,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        });
    } catch (error) {
        return next(error);
    }
});

// Delete User Entry
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const deleted = await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deleted) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        return res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
