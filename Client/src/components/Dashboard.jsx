import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import RealTimeChart from '../components/Realtimechart';
import DashboardNav from '../components/DashboardNav';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const socketRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      setLoading(false);
      return;
    }
  
    socketRef.current = io('http://localhost:3006', {
      auth: {
        token: token,
      },
    });
  
    socketRef.current.on('sensor-data', (data) => {
      setLoading(false);
      const newData = {
        time: new Date().toLocaleTimeString(),
        temperature: data.temperature,
        humidity: data.humidity,
      };
      setSensorData((prev) => [...prev, newData].slice(-10));
    });
  
    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setLoading(false);
    });
  
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Live Sensor Data</h2>
        {loading ? <div>Loading...</div> : <RealTimeChart data={sensorData} />}
      </main>
    </div>
  );
  
};

export default Dashboard;

