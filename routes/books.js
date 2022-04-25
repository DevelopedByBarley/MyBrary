const express = require('express');
const router = express.Router();
const author = require('../models/author');
const Book = require('../models/author')

// All Books Route
router.get('/', async (req, res) => {
  res.send('AllBooks')
})

// New Book route
router.get('/new', async(req, res) => {
  try {
    const authors = await author.find({});
    const book = new Book();
    res.render('books/new', {authors: authors, book: book})
  } catch {
    res.redirect('/books');
  }
})

// Create book route
router.post('/', async (req, res) => {
  res.send('CreateBook')
})

module.exports = router;