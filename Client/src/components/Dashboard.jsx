import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import RealTimeChart from '../components/Realtimechart';
import DashboardNav from '../components/DashboardNav';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3006');
    
    // Listen for 'sensor-data' event from the backend
    socketRef.current.on('sensor-data', (data) => {
      const newData = {
        time: new Date().toLocaleTimeString(),  // Add a time stamp
        temperature: data.temperature,
        humidity: data.humidity,
      };

      // Add new data to the state and limit to the latest 10 entries
      setSensorData((prev) => [...prev, newData].slice(-10));
    });

    return () => socketRef.current.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />  {/* Assuming DashboardNav is another component */}
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Live Sensor Data</h2>
        <RealTimeChart data={sensorData} />
      </main>
    </div>
  );
};

export default Dashboard;
