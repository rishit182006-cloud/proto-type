const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// IN-MEMORY STORAGE
// Since we removed MongoDB, we will store data in these arrays.
// WARNING: All data is lost when the server restarts.
let needs = [];
let offers = [];

// Helper to generate IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Multer Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 1. Create a Need
router.post('/needs/create', upload.single('image'), (req, res) => {
    try {
        const { ngoName, ngoEmail, ngoPhone, city, category, title, description } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newNeed = {
            _id: generateId(),
            ngoName,
            ngoEmail,
            ngoPhone,
            city,
            category,
            title,
            description,
            imageUrl,
            createdAt: new Date()
        };

        needs.push(newNeed);
        // Sort needs by date (newest first)
        needs.sort((a, b) => b.createdAt - a.createdAt);

        res.status(201).json({ message: 'Need created successfully', need: newNeed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating need' });
    }
});

// 2. Get All Needs (with filters)
router.get('/needs', (req, res) => {
    try {
        const { city, category } = req.query;

        let filteredNeeds = needs;

        if (city) {
            filteredNeeds = filteredNeeds.filter(n => n.city === city);
        }
        if (category) {
            filteredNeeds = filteredNeeds.filter(n => n.category === category);
        }

        res.json(filteredNeeds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching needs' });
    }
});

// 3. Get Single Need
router.get('/needs/:id', (req, res) => {
    try {
        const need = needs.find(n => n._id === req.params.id);
        if (!need) return res.status(404).json({ error: 'Need not found' });
        res.json(need);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching need' });
    }
});

// 4. Create Offer
router.post('/needs/:id/offer', (req, res) => {
    try {
        const { donatorName, donatorEmail, donatorPhone, message } = req.body;
        const needId = req.params.id;

        // Verify need exists
        const needExists = needs.some(n => n._id === needId);
        if (!needExists) return res.status(404).json({ error: 'Need not found' });

        const newOffer = {
            _id: generateId(),
            needId,
            donatorName,
            donatorEmail,
            donatorPhone,
            message,
            createdAt: new Date()
        };

        offers.push(newOffer);

        res.status(201).json({ message: 'Offer submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error submitting offer' });
    }
});

// 5. View Offers (NGO Only - Email Check)
router.post('/needs/:id/view-offers', (req, res) => {
    try {
        const { ngoEmail } = req.body;
        const needId = req.params.id;

        const need = needs.find(n => n._id === needId);
        if (!need) return res.status(404).json({ error: 'Need not found' });

        // AUTH CHECK: specific matching logic
        if (need.ngoEmail !== ngoEmail) {
            return res.status(403).json({ error: 'Unauthorized: Email does not match the NGO who posted this need.' });
        }

        const relevantOffers = offers.filter(o => o.needId === needId);
        // Sort offers by date
        relevantOffers.sort((a, b) => b.createdAt - a.createdAt);

        res.json(relevantOffers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching offers' });
    }
});

module.exports = router;
