const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');


mongoose.connect("mongodb+srv://abc01:abc01@clustersgp-nsn0q.mongodb.net/nodejs-blog?retryWrites=true", { useNewUrlParser: true });
let db = mongoose.connection;

db.on('open', function() {
  console.log('Connected to MongoDB');
});

db.on('error', function(err) {
  console.log(err);
});

const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

let Article = require('./models/article');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  Article.find({}, function(err, articles) {
    res.render('index', {
      articles: articles
    });
  });
});

app.get('/articles/new', function(req, res) {
  res.render('new', {
    title: 'Add Article'
  });
});

app.get('/articles/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('show', {
      article: article
    });
  });
});

app.get('/articles/:id/edit', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('edit', {
      title: 'Edit Article',
      article: article
    });
  });
});

app.post('/articles/create', function(req, res) {
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
});

app.post('/articles/update/:id', function(req, res) {
  let query = { _id: req.params.id };

  Article.update(query, req.body, function(err, article) {
    if(err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

app.delete('/articles/:id', function(req, res) {
  let query = { _id: req.params.id };

  Article.remove(query, function(err) {
    if(err) {
      console.log(err);
    }

    res.send('Success');
  });
});

app.listen(5000, function() {
  console.log("Server started on port 5000...");
});




