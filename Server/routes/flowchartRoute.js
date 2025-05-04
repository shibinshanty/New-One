const express = require('express');
const router = express.Router();
const {createFlowchart,getAllFlowcharts,getFlowchartById,updateFlowchartById,deleteFlowchartById} = require('../controllers/flowChartController');

// Route to create a new flowchart
router.post('/create',createFlowchart);

// Route to get all flowcharts
router.get('/',getAllFlowcharts);

// Route to get a single flowchart by its ID
router.get('/:id',getFlowchartById);

// Route to update an existing flowchart by its ID
router.put('/:id',updateFlowchartById);

// Route to delete a flowchart by its ID
router.delete('/:id',deleteFlowchartById);

module.exports = router;
