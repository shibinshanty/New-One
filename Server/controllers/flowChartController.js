// controllers/flowChartController.js

const Flowchart = require('../models/flowchartModel');  // Make sure this path is correct

// Function to create a new flowchart
exports.createFlowchart = async (req, res) => {
  try {
    const newFlowchart = new Flowchart(req.body);
    await newFlowchart.save();
    res.status(201).json({ message: 'Flowchart created successfully', flowchart: newFlowchart });
  } catch (error) {
    res.status(500).json({ message: 'Error creating flowchart', error });
  }
};

// Function to get all flowcharts
exports.getAllFlowcharts = async (req, res) => {
  try {
    const flowcharts = await Flowchart.find();
    res.status(200).json(flowcharts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flowcharts', error });
  }
};

// Function to get a flowchart by its ID
exports.getFlowchartById = async (req, res) => {
  try {
    const flowchart = await Flowchart.findById(req.params.id);
    if (!flowchart) {
      return res.status(404).json({ message: 'Flowchart not found' });
    }
    res.status(200).json(flowchart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flowchart', error });
  }
};

// Function to update a flowchart by its ID
exports.updateFlowchartById = async (req, res) => {
  try {
    const flowchart = await Flowchart.findById(req.params.id);
    if (!flowchart) {
      return res.status(404).json({ message: 'Flowchart not found' });
    }
    flowchart.title = req.body.title || flowchart.title;
    flowchart.nodes = req.body.nodes || flowchart.nodes;
    flowchart.edges = req.body.edges || flowchart.edges;

    await flowchart.save();
    res.status(200).json({ message: 'Flowchart updated successfully', flowchart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating flowchart', error });
  }
};

// Function to delete a flowchart by its ID
exports.deleteFlowchartById = async (req, res) => {
  try {
    const flowchart = await Flowchart.findByIdAndDelete(req.params.id);
    if (!flowchart) {
      return res.status(404).json({ message: 'Flowchart not found' });
    }
    res.status(200).json({ message: 'Flowchart deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting flowchart', error });
  }
};
