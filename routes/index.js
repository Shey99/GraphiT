const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const db = mongoose.connection;

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  db.collection('users').find().toArray((err, result) => {
    res.render('dashboard', {
      user: req.user,
      profile: result
    })
  })
})

router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('create')
})

router.put('/createGraph', (req, res) => {
  db.collection('users').findOneAndUpdate(
    {email: req.user.email},
    { $push: { graphs:
      { graphName: req.body.graphName,
        graphType: req.body.graphType,
        graphInfo: []
      }
    }
  },
    (err, result) => {
    if (err) return res.send(err)
    res.send(result);
  })
})


module.exports = router;
