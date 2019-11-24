const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User Model
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// Login Page
router.get('/login', (req, res) => res.render('login'))

// Register Page
router.get('/register', (req, res) => res.render('register'))

// Register Handle
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'Please fill in all fields'
    });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({
      msg: 'Passwords do not match'
    })
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
    console.log(errors)
  } else {
    // Validation Passed
    User.findOne({
        email: email
      })
      .then(user => {
        if (user) {
          // User already exists
          errors.push({
            msg: 'Account with that email already registered'
          })
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
          });

          // Hash password
          bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newUser.password = hash;
            // Save new user
            newUser.save()
              .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err))
          }))
          console.log(newUser);
        }
      });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});



// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;
