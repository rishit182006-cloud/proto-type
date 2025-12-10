const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    needId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Need',
        required: true
    },
    donatorName: {
        type: String,
        required: true
    },
    donatorEmail: {
        type: String,
        required: true
    },
    donatorPhone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Offer', OfferSchema);
