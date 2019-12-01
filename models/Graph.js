const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GraphSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  graphName: {
    type: String,
    required: true
  },
  graphType: {
    type: String,
    required: true
  },
  graphInfo: {
    type: Array,
    required: true
  },
});

const Graph = mongoose.model('Graph', GraphSchema, 'graphs');

module.exports = Graph;
