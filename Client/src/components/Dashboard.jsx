import React, { useEffect, useState, useRef } from 'react';

import { io } from 'socket.io-client';
import RealTimeChart from '../components/Realtimechart';
import DashboardNav from '../components/DashboardNav'; 

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3006');
    socketRef.current.on('sensor-data', (data) => {
      setSensorData((prev) => [...prev, data].slice(-10));
    });

    return () => socketRef.current.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav/> {/* ⬅ Add this */}
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Live Sensor Data</h2>
        <RealTimeChart data={sensorData} />
      </main>
    </div>
  );
};

export default Dashboard;
