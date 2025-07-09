import React, { useEffect, useState, useMemo } from 'react';
import DisputeCard from '../../components/DisputeCard';
import { CheckCircle, AlertTriangle, RefreshCcw } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/Slice/AuthSlice/AuthSlice';
import { fetchAllDisputes } from '../../Redux/Slice/DisputeSlice/DisputeSlice';

const MediatorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const mediatorEmail = user?.mediator_email || JSON.parse(localStorage.getItem('user'))?.mediator_email;

  const { disputes, loading, error } = useSelector((state) => state.disputes);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (mediatorEmail) {
      dispatch(fetchAllDisputes(mediatorEmail));
    }
  }, [dispatch, mediatorEmail]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate('/');
  };

  const truncateEmail = (email) => {
    if (!email) return '';
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return email;
    const username = email.substring(0, atIndex);
    const domain = email.substring(atIndex + 1);
    return username.length > 3 ? `${username.substring(0, 3)}...${domain}` : email;
  };

  const displayEmail = truncateEmail(mediatorEmail);

  const totalDisputesCount = disputes.length;
  const resolvedDisputesCount = disputes.filter(d => d.dispute_status === 'resolved').length;
  const inResolutionDisputesCount = disputes.filter(d => d.dispute_status === 'resolving').length;

  const filteredDisputes = useMemo(() => {
    let filtered = disputes;

    if (activeFilter === 'resolved') {
      filtered = filtered.filter(d => d.dispute_status === 'resolved');
    } else if (activeFilter === 'inResolution') {
      filtered = filtered.filter(d => d.dispute_status === 'resolving');
    }

    return filtered
      .filter(d =>
        d.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.dispute_status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [disputes, searchTerm, activeFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisputes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage);

  const handleCardClick = (filterType) => {
    setActiveFilter(filterType);
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: 'rgb(249, 249, 251)', minHeight: '100vh' }}>
      <div className="container">

        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
          <span className="fw-medium text-muted">Logged in as: <strong>{displayEmail}</strong></span>
        </div>

        {/* Dispute Summary Cards */}
        <div className="row mb-5">
          <div className="col-md-4" onClick={() => handleCardClick('all')} style={{ cursor: 'pointer' }}>
            <DisputeCard title="Total Dispute" count={totalDisputesCount} icon={AlertTriangle} iconColor="red" />
          </div>
          <div className="col-md-4" onClick={() => handleCardClick('resolved')} style={{ cursor: 'pointer' }}>
            <DisputeCard title="Resolved Disputes" count={resolvedDisputesCount} icon={CheckCircle} iconColor="green" />
          </div>
          <div className="col-md-4" onClick={() => handleCardClick('inResolution')} style={{ cursor: 'pointer' }}>
            <DisputeCard title="Dispute In Resolution" count={inResolutionDisputesCount} icon={RefreshCcw} iconColor="orange" />
          </div>
        </div>

        {/* Table Controls */}
        <h5 className="fw-bold mb-3">
          {activeFilter === 'all' && 'All Disputes'}
          {activeFilter === 'resolved' && 'Resolved Disputes'}
          {activeFilter === 'inResolution' && 'Disputes In Resolution'}
        </h5>

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
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={35}>35</option>
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
                <th>Product Name</th>
                <th>Dispute Status</th>
                <th>Dispute Date</th>
                <th>Dispute Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center text-muted">Loading...</td></tr>
              ) : currentItems.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted">No disputes found</td></tr>
              ) : (
                currentItems.map((dispute) => (
                  <tr key={dispute._id}>
                    <td>{dispute.product_name}</td>
                    <td>{dispute.dispute_status}</td>
                    <td>{new Date(dispute.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(dispute.createdAt).toLocaleTimeString()}</td>
                    <td>
                      <Link
                        to={`/dashboard/dispute/${dispute._id}`}
                        className={`btn btn-sm ${
                          dispute.dispute_status === 'resolved'
                            ? 'btn-success'
                            : dispute.dispute_status === 'resolving'
                            ? 'btn-warning'
                            : 'btn-primary'
                        }`}
                      >
                        View More
                      </Link>
                    </td>
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
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                  <li
                    key={number}
                    className={`page-item ${currentPage === number ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => setCurrentPage(number)}>
                      {number}
                    </button>
                  </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </button>
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
