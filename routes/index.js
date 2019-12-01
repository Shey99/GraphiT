const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const db = mongoose.connection;
const Graph = require('../models/Graph.js');

router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Graph.find({ email: req.user.email }, (err, arr) => {
    console.log(arr);
    res.render('dashboard', {
      user: req.user,
      graphs: arr
    })
  })
})

router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('create')
})

router.get('/graphs/:id', ensureAuthenticated, (req, res) => {
  Graph.find({ email: req.user.email }, (err, arr) => {
    res.render('graph', {
      graph: arr[req.params.id]
    })
  })
})

router.post('/createGraph', (req, res) => {
  const newGraph = new Graph({
    email: req.user.email,
    graphName: req.body.graphName,
    graphType: req.body.graphType,
    graphInfo: []
  })
  newGraph.save()
    .then( () => {
      res.redirect('/users/login');
    })
    .catch(err => console.log(err));
})

router.put('/graphs/changeGraph', (req, res) => {
  console.log('hello');
  Graph.findOneAndUpdate({email: req.user.email, graphName: req.body.graphName},
    {
      $set: {graphInfo: req.body.graphInfo}
    },
    (err, result) => {
    if (err) return res.send(err)
    res.send(result);
    })
})

module.exports = router;
