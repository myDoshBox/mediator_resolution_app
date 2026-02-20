import React, { useEffect, useState, useMemo } from "react";
import DisputeCard from "../../components/DisputeCard";
import { CheckCircle, AlertTriangle, RefreshCcw } from "react-feather";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Slice/AuthSlice/AuthSlice";
import { fetchAllDisputes } from "../../Redux/Slice/DisputeSlice/DisputeSlice";

const ACTIVE_STATUSES = ["In_Dispute", "resolving", "escalated_to_mediator"];

const STATUS_LABEL = {
  In_Dispute: "In Dispute",
  resolving: "Resolving",
  escalated_to_mediator: "Awaiting Resolution",
  resolved: "Resolved",
  cancelled: "Cancelled",
};

const STATUS_BADGE = {
  In_Dispute: "danger",
  resolving: "warning",
  escalated_to_mediator: "primary",
  resolved: "success",
  cancelled: "secondary",
};

const MediatorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Single source of truth: Redux auth state ──────────────────────────────
  const { user, token } = useSelector((state) => state.auth);
  // Backend stores email under mediator_email; fall back to generic email field
  const mediatorEmail = user?.mediator_email || user?.email || null;

  const { disputes, loading, error } = useSelector((state) => state.disputes);

  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!token || !mediatorEmail) navigate("/");
  }, [token, mediatorEmail, navigate]);

  useEffect(() => {
    if (mediatorEmail && token) dispatch(fetchAllDisputes(mediatorEmail));
  }, [dispatch, mediatorEmail, token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const truncateEmail = (email = "") => {
    const at = email.indexOf("@");
    if (at === -1) return email;
    const name = email.slice(0, at);
    return name.length > 3
      ? `${name.slice(0, 3)}...@${email.slice(at + 1)}`
      : email;
  };

  const totalCount = disputes.length;
  const resolvedCount = disputes.filter(
    (d) => d.dispute_status === "resolved",
  ).length;
  const activeCount = disputes.filter((d) =>
    ACTIVE_STATUSES.includes(d.dispute_status),
  ).length;

  const filteredDisputes = useMemo(() => {
    let list = [...disputes];
    if (activeFilter === "resolved")
      list = list.filter((d) => d.dispute_status === "resolved");
    else if (activeFilter === "active")
      list = list.filter((d) => ACTIVE_STATUSES.includes(d.dispute_status));

    const term = searchTerm.toLowerCase();
    if (term) {
      list = list.filter(
        (d) =>
          d.product_name?.toLowerCase().includes(term) ||
          d.dispute_status?.toLowerCase().includes(term) ||
          d.reason_for_dispute?.toLowerCase().includes(term) ||
          d.buyer_email?.toLowerCase().includes(term),
      );
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [disputes, searchTerm, activeFilter]);

  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage);
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredDisputes.slice(
    indexOfFirst,
    indexOfFirst + itemsPerPage,
  );

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "rgb(249,249,251)", minHeight: "100vh" }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
          <span className="fw-medium text-muted">
            Logged in as: <strong>{truncateEmail(mediatorEmail)}</strong>
          </span>
        </div>

        <div className="row mb-5">
          {[
            {
              filter: "all",
              title: "Total Disputes",
              count: totalCount,
              icon: AlertTriangle,
              color: "red",
            },
            {
              filter: "resolved",
              title: "Resolved",
              count: resolvedCount,
              icon: CheckCircle,
              color: "green",
            },
            {
              filter: "active",
              title: "Active Disputes",
              count: activeCount,
              icon: RefreshCcw,
              color: "orange",
            },
          ].map(({ filter, title, count, icon, color }) => (
            <div
              key={filter}
              className="col-md-4"
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              style={{ cursor: "pointer" }}
            >
              <DisputeCard
                title={title}
                count={count}
                icon={icon}
                iconColor={color}
                active={activeFilter === filter}
              />
            </div>
          ))}
        </div>

        <h5 className="fw-bold mb-3">
          {activeFilter === "all" && "All Disputes"}
          {activeFilter === "resolved" && "Resolved Disputes"}
          {activeFilter === "active" && "Active Disputes"}
        </h5>

        {error && <div className="alert alert-danger">{error}</div>}

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
              {[10, 25, 35].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="ms-2">entries</span>
          </div>
          <input
            type="text"
            className="form-control"
            style={{ width: 250 }}
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="table-responsive bg-white shadow-sm rounded p-3">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Reason</th>
                <th>Buyer</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" />
                    Loading…
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No disputes found
                  </td>
                </tr>
              ) : (
                currentItems.map((dispute) => (
                  <tr key={dispute._id}>
                    <td>{dispute.product_name}</td>
                    <td>{dispute.reason_for_dispute}</td>
                    <td>
                      <small>{dispute.buyer_email}</small>
                    </td>
                    <td>
                      <span
                        className={`badge bg-${STATUS_BADGE[dispute.dispute_status] || "secondary"}`}
                      >
                        {STATUS_LABEL[dispute.dispute_status] ||
                          dispute.dispute_status}
                      </span>
                    </td>
                    <td>
                      {new Date(dispute.createdAt).toLocaleDateString()}{" "}
                      <small className="text-muted">
                        {new Date(dispute.createdAt).toLocaleTimeString()}
                      </small>
                    </td>
                    <td>
                      <Link
                        to={`/dashboard/dispute/${dispute._id}`}
                        className={`btn btn-sm btn-${dispute.dispute_status === "resolved" ? "success" : "primary"}`}
                      >
                        {dispute.dispute_status === "resolved"
                          ? "View"
                          : "Resolve"}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="text-muted small">
              Showing {filteredDisputes.length === 0 ? 0 : indexOfFirst + 1}–
              {Math.min(indexOfFirst + itemsPerPage, filteredDisputes.length)}{" "}
              of {filteredDisputes.length}
            </span>
            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <li
                      key={n}
                      className={`page-item ${currentPage === n ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(n)}
                      >
                        {n}
                      </button>
                    </li>
                  ),
                )}
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
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
