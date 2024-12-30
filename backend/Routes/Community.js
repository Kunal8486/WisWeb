const express = require('express');
const multer = require('multer');
const path = require('path');
const Community = require('../Models/Community');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Get all communities
router.get('/', async (req, res) => {
    try {
        const communities = await Community.find();
        res.json(communities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new community
router.post('/', upload.single('icon'), async (req, res) => {
    const { category, name, description } = req.body;
    const iconPath = req.file ? `/uploads/${req.file.filename}` : '/uploads/community.png';

    const community = new Community({ category, name, description, icon: iconPath });

    try {
        const newCommunity = await community.save();
        res.status(201).json(newCommunity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a community
router.put('/:id', upload.single('icon'), async (req, res) => {
    const { category, name, description } = req.body;
    const iconPath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = { category, name, description };
    if (iconPath) updateData.icon = iconPath;

    try {
        const updatedCommunity = await Community.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedCommunity) return res.status(404).json({ message: 'Community not found' });

        res.json(updatedCommunity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a community
router.delete('/:id', async (req, res) => {
    try {
        await Community.findByIdAndDelete(req.params.id);
        res.json({ message: 'Community deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
