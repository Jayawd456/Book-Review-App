const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  description: String,
  genre: String,
  year: Number,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// virtual average rating (populated by aggregation or compute on details route)
module.exports = mongoose.model('Book', BookSchema);
