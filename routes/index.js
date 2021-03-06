const express = require('express');
const router = express.Router();
var fs = require('fs');
const mongoose = require('mongoose')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const db = mongoose.connection;
const Graph = require('../models/Graph.js');

router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Graph.find({ email: req.user.email }, (err, arr) => {
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
    graphInfo: [],
    xAxis: req.body.xAxis,
    yAxis: req.body.yAxis
  })
  newGraph.save()
    .then(graph => {
      console.log(graph);
    })
    .catch(err => console.log(err));
})

router.put('/graphs/changeGraph', (req, res) => {
  Graph.findOneAndUpdate({email: req.user.email, graphName: req.body.graphName},
    {
      $set: {graphInfo: req.body.graphInfo, xAxis: req.body.xAxis, yAxis: req.body.yAxis}
    },
    (err, result) => {
    if (err) return res.send(err)
    res.send(result);
    })
})

router.put('/graphs/deleteField', (req, res) => {
  let input = req.body.input;
  let value = req.body.value;
  Graph.findOneAndUpdate({ email: req.user.email, graphName: req.body.graphName },
    { $pull: { graphInfo : { [input] : value } } },
    (err, result) => {
    if (err) return res.send(err)
    res.send(result);
    })
})

router.delete('/graphs/deleteGraph', (req, res) => {
  Graph.findOneAndDelete({ email: req.user.email, graphName: req.body.graphName},
    (err, result) => {
      if (err) return res.send(500, err)
      res.send(result)
    })
})

module.exports = router;
