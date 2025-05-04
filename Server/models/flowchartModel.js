const mongoose = require('mongoose');

const flowchartSchema = new mongoose.Schema({
  title: { type: String, required: true },  // Title of the flowchart
  nodes: [{
    id: { type: String, required: true },  // Unique ID for each node
    label: { type: String, required: true },  // Label to describe the node
    position: { x: { type: Number }, y: { type: Number } },  // Position of the node (x, y coordinates)
  }],
  edges: [{
    source: { type: String, required: true },  // Source node ID
    target: { type: String, required: true },  // Target node ID
    label: { type: String },  // Optional label for the edge
  }],
  createdAt: { type: Date, default: Date.now },  // Date when the flowchart was created
  updatedAt: { type: Date, default: Date.now },  // Date when the flowchart was last updated
});

// Create the model based on the schema
const Flowchart = mongoose.model('Flowchart', flowchartSchema);

module.exports = Flowchart;
