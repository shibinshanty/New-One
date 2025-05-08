import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  addEdge,
} from 'react-flow-renderer';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Flowchart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowchartId, setFlowchartId] = useState(null);

  // Fetch or create flowchart
  useEffect(() => {
    const fetchOrCreateFlowchart = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3006/api/flowchart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          const flowchart = response.data[0];
          setFlowchartId(flowchart._id);

          setNodes(
            (flowchart.nodes || []).map((node) => ({
              id: node.id,
              data: { label: node.label },
              position: node.position,
            }))
          );

          setEdges(
            (flowchart.edges || []).map((edge, index) => ({
              id: `e${edge.source}-${edge.target}-${index}`,
              source: edge.source,
              target: edge.target,
              label: edge.label || '',
            }))
          );
        } else {
          const createRes = await axios.post(
            'http://localhost:3006/api/flowchart/create',
            { title: 'New Flowchart', nodes: [], edges: [] },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const newFlowchart = createRes.data.flowchart;
          setFlowchartId(newFlowchart._id);
          setNodes([]);
          setEdges([]);
        }
      } catch (error) {
        console.error('Error loading or creating flowchart:', error);
      }
    };

    fetchOrCreateFlowchart();
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = async () => {
    try {
      if (!flowchartId) return alert('No flowchart to update');
  
      // Ensure all nodes have a valid label, even if data is missing
      const formattedNodes = nodes.map((node, index) => {
        // Check if node.data exists and if label is missing
        const label = node?.data?.label?.trim() || `Node ${index + 1}`; // Fallback if label is missing
        return {
          id: node.id,
          data: { label }, // Ensure `data` object always has a label
          position: node.position,
        };
      });
  
      const formattedEdges = edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
        label: edge.label || '',  // Empty string if label is missing
      }));
  
      console.log("Saving nodes:", formattedNodes);
      console.log("Saving edges:", formattedEdges);
  
      // Make the API call to save the flowchart
      const response = await axios.put(
        `http://localhost:3006/api/flowchart/${flowchartId}`,
        { nodes: formattedNodes, edges: formattedEdges },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      // Check response and display a message
      if (response.status === 200) {
        alert('Flowchart saved successfully!');
      } else {
        console.log('Unexpected response:', response);
        alert('Failed to save flowchart');
      }
    } catch (error) {
      console.error('Error saving flowchart:', error.response || error);
      alert('Failed to save flowchart');
    }
  };
  

  const handleAddNode = () => {
    const label = `Node ${nodes.length + 1}`;
    const newNode = {
      id: uuidv4(),
      data: { label },
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="h-screen p-4 bg-gray-100">
      <h2 className="text-xl font-semibold mb-4">Edit Flowchart</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleAddNode}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Node
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Flowchart
        </button>
      </div>

      <div style={{ height: '85%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Flowchart;
