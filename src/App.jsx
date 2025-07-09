// src/App.jsx
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';

import LoginPage from './pages/Authentication/LoginPage';
import Dashboard from './pages/Dashboard/MediatorDashboard';
import DisputeDetails from './pages/Disputes/DisputeDetailsTables';
import ProtectedRoute from './components/ProtectedRoute';
import SettleDispute from "./pages/Disputes/SettleDispute"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Layout component with nested outlet
const DashboardLayout = () => (
  <ProtectedRoute>
    <div className="dashboard-layout">
      {/* Navbar or Sidebar can go here */}
      <Outlet />
    </div>
  </ProtectedRoute>
);

// ✅ Router definition
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,  // ✅ ProtectedRoute applied here
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: 'dispute/:id',
          element: <DisputeDetails />,
        },
        {
          path: 'settle-dispute/:id/settle',
          element: <SettleDispute />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

// ✅ Main App
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
