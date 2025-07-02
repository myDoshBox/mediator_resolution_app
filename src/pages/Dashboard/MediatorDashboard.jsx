import React, { useEffect, useState, useMemo } from 'react';
import DisputeCard from '../../components/DisputeCard';
import { CheckCircle, AlertTriangle, RefreshCcw } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/Slice/AuthSlice/AuthSlice';
import { fetchAllDisputes } from '../../Redux/Slice/DisputeSlice/DisputeSlice';
const MediatorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { disputes, loading, error } = useSelector((state) => state.disputes);
  const user = useSelector((state) => state.auth.user);
  const fallbackEmail = JSON.parse(localStorage.getItem('user'))?.mediator_email;

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllDisputes());
  }, [dispatch]);

  const resolved = disputes.filter(d => d.status === 'resolved').length;
  const unresolved = disputes.filter(d => d.status === 'unresolved').length;
  const inResolution = disputes.filter(d => d.status === 'resolving').length;

  const filteredDisputes = useMemo(() => {
    return disputes
      .filter((d) =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).reverse();
  }, [disputes, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisputes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: 'rgb(249, 249, 251)', minHeight: '100vh' }}>
      <div className="container">

        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
          <span className="fw-medium text-muted">
            Logged in as: <strong>{user?.mediator_email || fallbackEmail}</strong>
          </span>
        </div>

        {/* Dispute Summary Cards */}
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

        {/* Dispute Table Header */}
        <h5 className="fw-bold mb-3">All Disputes</h5>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <label className="me-2">Show</label>
            <select
              className="form-select d-inline-block w-auto"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="ms-2">entries</span>
          </div>

          <div>
            <input
              type="text"
              className="form-control"
              style={{ width: '250px' }}
              placeholder="Search dispute..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Dispute Table */}
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
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted">Loading disputes...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted">No disputes found</td>
                </tr>
              ) : (
                currentItems.map(dispute => (
                  <tr key={dispute.id}>
                    <td>{dispute.title}</td>
                    <td>{dispute.status}</td>
                    <td>{new Date(dispute.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center">
            <span>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDisputes.length)} of {filteredDisputes.length} entries
            </span>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MediatorDashboard;