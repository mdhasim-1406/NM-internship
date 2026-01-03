const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./models/book');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/libraryDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// GET / - Get all books
app.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:id - Get single book by ID
app.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /category/:category - Get books by category
app.get('/category/:category', async (req, res) => {
  try {
    const books = await Book.find({ category: req.params.category });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /after/:year - Get books published after a given year
app.get('/after/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const books = await Book.find({ publishedYear: { $gt: year } });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / - Insert a new book
app.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /:id/copies - Increase available copies
app.patch('/:id/copies', async (req, res) => {
  try {
    const { addCopies } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    book.availableCopies += addCopies;
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /:id/category - Update book category
app.patch('/:id/category', async (req, res) => {
  try {
    const { category } = req.body;
    const book = await Book.findByIdAndUpdate(req.params.id, { category }, { new: true, runValidators: true });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /:id - Delete book only if availableCopies === 0
app.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (book.availableCopies !== 0) {
      return res.status(400).json({ error: 'Cannot delete book with available copies' });
    }
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});