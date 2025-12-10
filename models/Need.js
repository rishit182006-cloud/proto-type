const mongoose = require('mongoose');

const NeedSchema = new mongoose.Schema({
  ngoName: {
    type: String,
    required: true
  },
  ngoEmail: {
    type: String,
    required: true
  },
  ngoPhone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Worker', 'Furniture', 'Electronics', 'Books', 'Medical', 'Other']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Need', NeedSchema);
