import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import SignUp from './pages/SignUp';
import Otp from './pages/Otp';
import Footer from './components/Footer';
import Flowchart from './pages/Flowchart';
import './App.css';

function AppContent() {
  const location = useLocation();

  // Routes that should NOT show the main Navbar or Footer
  const hideNavbarOn = ['/dashboard', '/flowchart'];

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flowchart" element={<Flowchart />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
