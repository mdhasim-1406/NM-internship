const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;