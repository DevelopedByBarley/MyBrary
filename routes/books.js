const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');


const multer = require('multer');
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imagaMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imagaMimeTypes.includes(file.mimetype))
  }
})


// All Books Route
router.get('/', async (req, res) => {
  res.send('AllBooks')
})

// New Book route
router.get('/new', async (req, res) => {
  renderBookPage(res, new Book())
})

// Create book route
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Author({
    title: req.body.title,
    name: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description
  })

  try {
    const newBook = await book.save()
    res.redirect('books')
  } catch (error) {
    console.log(error);
  }
})

async function renderBookPage(res, book, hasError = true) { // That's not done! #3 27:00
  try {
    const authors = await Author.find({});
    const params = { authors: authors, book: book }
    res.render('books/new', params)
  } catch {
    res.redirect('/books');
  }
}

module.exports = router;