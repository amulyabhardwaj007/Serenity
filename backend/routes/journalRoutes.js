const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');
const ENTRY_LIMIT = Number(process.env.JOURNAL_ENTRY_LIMIT || 200);

// Create Journal Entry
router.post('/', auth, async (req, res) => {
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
            mood
        });
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All User Entries
router.get('/', auth, async (req, res) => {
    try {
        const entries = await Journal.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete User Entry
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deleted) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
