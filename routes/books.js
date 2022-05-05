const express = require('express');
const router = express.Router();
const fs = require('fs');
const Author = require('../models/author');
const Book = require('../models/book');


const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath) // Public/uploads/bookCovers
const imagaMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imagaMimeTypes.includes(file.mimetype))
  }
})


// All Books Route
router.get('/', async (req, res) => {
  let query = Book.find(); //1 Kikérjük a book összes elemét

  console.log(req.query.title, req.query.publishedBefore, req.query.publishedAfter)

  if (req.query.title != null && req.query.title != '') {

    query = query.regex('title', new RegExp(req.query.title,)) // amelynek belepasszoljuk 

  }

  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {

    query = query.lte('publishDate', new RegExp(req.query.publishedBefore,)) 

  }

  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {

    query = query.gte('publishDate', new RegExp(req.query.publishedAfter,)) 

  }


  try {
    const books = await query.exec();
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch (error) {
    console.log(error);
  }
})

// New Book route
router.get('/new', async (req, res) => {
  renderBookPage(res, new Book())
})

// Create book route
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    descriptions: req.body.descriptions,
    author: req.body.author
  })

  console.log(book);

  try {
    const newBook = await book.save()
    res.redirect('books')
    console.log(newBook);
  } catch (error) {
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName);
    }
    renderBookPage(res, new Book(), true)
    console.log(error)
  }
})

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

async function renderBookPage(res, book, hasError = true) {
  try {
    const authors = await Author.find({});
    const params = { authors: authors, book: book }
    res.render('books/new', params)
    if (hasError) params.errorMessage = 'Error creating new Book!'
  } catch {
    res.redirect('/books');
  }
}

module.exports = router;