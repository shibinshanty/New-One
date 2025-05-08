const express = require('express');
const router = express.Router();
const {verifyToken}=require('../middleware/authMiddleware')
const { createFlowchart, getAllFlowcharts, getFlowchartById, updateFlowchartById, deleteFlowchartById } = require('../controllers/flowChartController');

// Route to create a new flowchart
router.post('/create',verifyToken,createFlowchart);

// Route to get all flowcharts
router.get('/',verifyToken,getAllFlowcharts);

// Route to get a single flowchart by its ID
router.get('/:id',verifyToken,getFlowchartById);

// Route to update an existing flowchart by its ID
router.put('/:flowchartId',verifyToken,updateFlowchartById);

// Route to delete a flowchart by its ID
router.delete('/:id',verifyToken,deleteFlowchartById);

module.exports = router;

