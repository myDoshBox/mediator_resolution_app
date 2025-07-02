import React, { useEffect, useState } from 'react';
import DisputeCard from '../../components/DisputeCard';
import { CheckCircle, AlertTriangle, RefreshCcw } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/Slice/AuthSlice/authSlice'; // make sure you have this action

const mockDisputes = [
  { id: 1, title: 'Dispute A', status: 'resolved', createdAt: '2025-07-02T10:00:00Z' },
  { id: 2, title: 'Dispute B', status: 'unresolved', createdAt: '2025-07-02T12:00:00Z' },
  { id: 3, title: 'Dispute C', status: 'resolving', createdAt: '2025-07-02T11:00:00Z' },
];

const MediatorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [disputes, setDisputes] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const fallbackEmail = JSON.parse(localStorage.getItem('user'))?.mediator_email;

  useEffect(() => {
    setDisputes(mockDisputes); // Replace with actual fetch later
  }, []);

  const handleLogout = () => {
    dispatch(logout()); // clear Redux state
    localStorage.clear(); // clear localStorage
    navigate('/'); // redirect to login
  };

  const resolved = disputes.filter(d => d.status === 'resolved').length;
  const unresolved = disputes.filter(d => d.status === 'unresolved').length;
  const inResolution = disputes.filter(d => d.status === 'resolving').length;

  const sortedDisputes = [...disputes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: 'rgb(249, 249, 251)', minHeight: '100vh' }}>
      <div className="container">

        {/* ✅ Top Bar with Logout (left) and Email (right) */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>

          <span className="fw-medium text-muted">
            Logged in as: <strong>{user?.mediator_email || fallbackEmail}</strong>
          </span>
        </div>

        {/* Summary Cards */}
        <div className="row mb-5">
          <div className="col-md-4">
            <DisputeCard title="Resolved Disputes" count={resolved} icon={CheckCircle} iconColor="green" />
          </div>
          <div className="col-md-4">
            <DisputeCard title="Unresolved Disputes" count={unresolved} icon={AlertTriangle} iconColor="red" />
          </div>
          <div className="col-md-4">
            <DisputeCard title="Issues In Resolution" count={inResolution} icon={RefreshCcw} iconColor="orange" />
          </div>
        </div>

        {/* Table */}
        <h5 className="fw-bold mb-3">All Disputes</h5>
        <div className="table-responsive bg-white shadow-sm rounded p-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Dispute Title</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {sortedDisputes.map(dispute => (
                <tr key={dispute.id}>
                  <td>{dispute.title}</td>
                  <td>{dispute.status}</td>
                  <td>{new Date(dispute.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MediatorDashboard;
