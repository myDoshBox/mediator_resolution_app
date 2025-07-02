import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/Authentication/LoginPage';
import Dashboard from './pages/Dashboard/MediatorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DisputeDetails from './pages/Disputes/DisputeDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Add this route here */}
        <Route
          path="/dispute/:id"
          element={
            <ProtectedRoute>
              <DisputeDetails />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
