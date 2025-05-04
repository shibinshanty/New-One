import React, { useEffect, useCallback, useState } from 'react';
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
          setNodes(flowchart.nodes || []);
          setEdges(flowchart.edges || []);
        } else {
          const createRes = await axios.post(
            'http://localhost:3006/api/flowchart',
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
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = async () => {
    try {
      if (!flowchartId) return alert('No flowchart to update');

      await axios.put(
        `http://localhost:3006/api/flowchart/${flowchartId}`,
        { nodes, edges },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('Flowchart saved successfully!');
    } catch (error) {
      console.error('Error saving flowchart:', error);
      alert('Failed to save flowchart');
    }
  };

  // Add new node
  const handleAddNode = () => {
    const newNode = {
      id: uuidv4(),
      data: { label: `Node ${nodes.length + 1}` },
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
