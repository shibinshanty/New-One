const mongoose=require('mongoose')

const flowchartSchema = new mongoose.Schema({
  title: { type: String, required: true },
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
    id: { type: String },  // Optional but good to have
    source: { type: String, required: true },
    target: { type: String, required: true },
    label: { type: String },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

