const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');


mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;

db.on('open', function() {
  console.log('Connected to MongoDB');
});

db.on('error', function(err) {
  console.log(err);
});

const app = express();

app.use(session({
  secret: config.secret,
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

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

let articles = require('./routes/articles');
let users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);

let Article = require('./models/article');
app.get('/', function(req, res) {
  Article.find({}, function(err, articles) {
    res.render('articles/index', {
      articles: articles
    });
  });
});


app.listen(5000, function() {
  console.log("Server started on port 5000...");
});




