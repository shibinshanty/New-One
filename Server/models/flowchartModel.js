const mongoose = require('mongoose');

const flowchartSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nodes: [{
    id: { type: String, required: true },
    data: {
      label: { type: String, required: true }
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    }
  }],
  edges: [{
    id: { type: String },
    source: { type: String, required: true },
    target: { type: String, required: true },
    label: { type: String },
  }]
}, { timestamps: true });

module.exports = mongoose.model('Flowchart', flowchartSchema);

