const express = require('express');
const { check, validationResult } = require('express-validator/check');

let router = express.Router();
let Article = require('../models/article');

router.get('/', function(req, res) {
  Article.find({}, function(err, articles) {
    res.render('articles/index', {
      articles: articles
    });
  });
});

router.get('/new', function(req, res) {
  res.render('articles/new', {
    title: 'Add Article'
  });
});

router.get('/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('articles/show', {
      article: article
    });
  });
});

router.get('/:id/edit', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('articles/edit', {
      title: 'Edit Article',
      article: article
    });
  });
});

router.post('/create', [
  check('title').isLength({ min: 1 }).withMessage('Title is required'),
  check('author').isLength({ min: 1 }).withMessage('Author is required'),
  check('body').isLength({ min: 1 }).withMessage('Body is required')
], function(req, res) {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    res.render('articles/new', {
      title: 'Add Article',
      errors: errors.array()
    });
  } else {
    let article = new Article(req.body);

    article.save(function(err) {
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash("success", "Article Added");
        res.redirect('/');
      }
    });
  }
});

router.post('/update/:id', function(req, res) {
  let query = { _id: req.params.id };

  Article.updateOne(query, req.body, function(err, article) {
    if(err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article Updated");
      res.redirect('/');
    }
  });
});

router.delete('/:id', function(req, res) {
  let query = { _id: req.params.id };

  Article.deleteOne(query, function(err) {
    if(err) {
      console.log(err);
    }

    req.flash("success", "Article Deleted");
    res.send('Success');
  });
});

module.exports = router;
