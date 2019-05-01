const express = require('express');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const passport = require('passport');


let router = express.Router();
let User = require('../models/user');

router.get('/register', function(req, res) {
  res.render('users/register');
});

router.post('/register', [
  check('name').isLength({ min: 1 }).withMessage('Name is required'),
  check('username').isLength({ min: 1 }).withMessage('Username is required'),
  check('email').isEmail().withMessage('Invalid email'),
  check('password', 'Invalid password')
    .isLength({ min: 1 })
    .custom((value, {req, loc, path}) => {
      if(value !== req.body.password_confirmation) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    })
], function(req, res) {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    res.render('users/register', {
      errors: errors.array()
    });
  } else {
    let user = new User(req.body);
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) {
          console.log(err);
          return;
        }

        user.password = hash;

        user.save(function(err) {
          if(err) {
            console.log(err);
            return;
          } else {
            req.flash("success", "You are now registered and can log in");
            res.redirect('/users/login');
          }
        });
      });
    });

  }
});

router.get('/login', function(req, res) {
  res.render('users/login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
    successFlash: 'Welcome!'
  })(req, res, next);
});

module.exports = router;
