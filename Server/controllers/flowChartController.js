

const Flowchart = require('../models/flowchartModel');  // Make sure this path is correct

// Function to create a new flowchart
exports.createFlowchart = async (req, res) => {
  try {
    const { title, nodes, edges } = req.body;
    const ownerId = req.user.id; // Extract from JWT

    if (!title || !nodes || !edges) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newFlowchart = new Flowchart({ title, nodes, edges, ownerId });
    await newFlowchart.save();

    res.status(201).json({ message: 'Flowchart created successfully', flowchart: newFlowchart });
  } catch (error) {
    console.error('Error saving flowchart:', error);
    res.status(500).json({ message: 'Internal server error' });
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
    const { flowchartId } = req.params;
    const { title, nodes, edges } = req.body;

    // Validate nodes: ensure every node has a label
    for (let i = 0; i < nodes.length; i++) {
      if (!nodes[i].data || !nodes[i].data.label) {
        return res.status(400).json({
          message: `Node at index ${i} is missing a required label.`,
        });
      }
    }

    // Validate edges: ensure every edge has a source and target
    for (let i = 0; i < edges.length; i++) {
      if (!edges[i].source || !edges[i].target) {
        return res.status(400).json({
          message: `Edge at index ${i} is missing a required source or target.`,
        });
      }
    }

    // Log received data for debugging purposes
    console.log('Received data:', { title, nodes, edges });

    // Proceed with the update if all nodes and edges are valid
    const updatedFlowchart = await Flowchart.findByIdAndUpdate(
      flowchartId,
      { title, nodes, edges },
      { new: true }
    );

    if (!updatedFlowchart) {
      return res.status(404).json({ message: 'Flowchart not found' });
    }

    res.status(200).json({
      message: 'Flowchart updated successfully',
      updatedFlowchart,
    });
  } catch (error) {
    console.error('Error updating flowchart:', error);
    res.status(500).json({ message: 'Error updating flowchart', error: error.message });
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
