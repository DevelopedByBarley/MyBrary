const express = require('express');
const router = express.Router();
const Author = require('../models/author')


router.get('/', async (req, res) => {
  let searchOptions = {};
  searchOptions.name = new RegExp(req.query.name, 'i');
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', {authors: authors, searchOptions: req.query});
    
  } catch {
    req.redirect('/');
  }
})


router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
})

router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save();
    res.redirect('/authors')
    console.log(newAuthor)
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating Author'
    })
  }
})

module.exports = router;