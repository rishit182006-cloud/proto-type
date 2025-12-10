```javascript
const express = require('express');
// const mongoose = require('mongoose'); // Removed for in-memory version
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ngo-platform'; // Not needed

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity in this prototype (allows inline scripts/images)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection REMOVED for In-Memory Version
// mongoose.connect(MONGODB_URI)
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Fallback for SPA (though we are using simple HTML pages, this ensures root loads index.html)
app.get('*', (req, res) => {
    // Check if request is for API
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API Endpoint not found' });
    }
    // Otherwise try to serve file, or default to index.html (optional, here we rely on static serving mostly)
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
