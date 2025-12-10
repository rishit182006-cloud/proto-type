const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Need = require('../models/Need');
const Offer = require('../models/Offer');

// Multer Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});
const upload = multer({ storage: storage });

// 1. Create a Need
router.post('/needs/create', upload.single('image'), async (req, res) => {
    try {
        const { ngoName, ngoEmail, ngoPhone, city, category, title, description } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newNeed = new Need({
            ngoName,
            ngoEmail,
            ngoPhone,
            city,
            category,
            title,
            description,
            imageUrl
        });

        await newNeed.save();
        res.status(201).json({ message: 'Need created successfully', need: newNeed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating need' });
    }
});

// 2. Get All Needs (with filters)
router.get('/needs', async (req, res) => {
    try {
        const { city, category } = req.query;
        let query = {};
        if (city) query.city = city;
        if (category) query.category = category;

        const needs = await Need.find(query).sort({ createdAt: -1 });
        res.json(needs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching needs' });
    }
});

// 3. Get Single Need
router.get('/needs/:id', async (req, res) => {
    try {
        const need = await Need.findById(req.params.id);
        if (!need) return res.status(404).json({ error: 'Need not found' });
        res.json(need);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching need' });
    }
});

// 4. Create Offer
router.post('/needs/:id/offer', async (req, res) => {
    try {
        const { donatorName, donatorEmail, donatorPhone, message } = req.body;
        const needId = req.params.id;

        const newOffer = new Offer({
            needId,
            donatorName,
            donatorEmail,
            donatorPhone,
            message
        });

        await newOffer.save();
        res.status(201).json({ message: 'Offer submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error submitting offer' });
    }
});

// 5. View Offers (NGO Only - Email Check)
router.post('/needs/:id/view-offers', async (req, res) => {
    try {
        const { ngoEmail } = req.body;
        const needId = req.params.id;

        const need = await Need.findById(needId);
        if (!need) return res.status(404).json({ error: 'Need not found' });

        // AUTH CHECK: specific matching logic
        if (need.ngoEmail !== ngoEmail) {
            return res.status(403).json({ error: 'Unauthorized: Email does not match the NGO who posted this need.' });
        }

        const offers = await Offer.find({ needId }).sort({ createdAt: -1 });
        res.json(offers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching offers' });
    }
});

module.exports = router;
