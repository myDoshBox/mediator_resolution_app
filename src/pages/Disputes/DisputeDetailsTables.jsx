import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Card, Badge, Table } from "react-bootstrap";

const STATUS_BADGE = {
  In_Dispute: "danger",
  resolving: "warning",
  escalated_to_mediator: "primary",
  resolved: "success",
  cancelled: "secondary",
};

const STATUS_LABEL = {
  In_Dispute: "In Dispute",
  resolving: "Resolving",
  escalated_to_mediator: "Escalated – Awaiting Resolution",
  resolved: "Resolved",
  cancelled: "Cancelled",
};

const canResolve = (status) =>
  ["resolving", "escalated_to_mediator"].includes(status);

const DisputeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── From Redux only ───────────────────────────────────────────────────────
  const dispute = useSelector((state) =>
    state.disputes.disputes.find((d) => d._id === id),
  );

  if (!dispute) {
    return (
      <div className="text-center py-5">
        <h4>Dispute not found</h4>
        <p>
          Return to <Link to="/dashboard">Dashboard</Link>
        </p>
      </div>
    );
  }

  const tx = dispute.transaction || {};
  const products = dispute.products || tx.products || [];
  const totalPrice = products.reduce(
    (sum, p) => sum + (p.price || 0) * (p.quantity || 1),
    0,
  );

  return (
    <div className="container py-4" style={{ maxWidth: 860 }}>
      <h3 className="mb-1 text-center fw-bold">Dispute Details</h3>
      <p className="text-center text-muted mb-4 small">
        Transaction ID: <code>{dispute.transaction_id}</code>
      </p>

      {/* Status badge */}
      <div className="text-center mb-4">
        <Badge
          bg={STATUS_BADGE[dispute.dispute_status] || "secondary"}
          className="fs-6 px-4 py-2"
        >
          {STATUS_LABEL[dispute.dispute_status] || dispute.dispute_status}
        </Badge>
      </div>

      {/* Resolution result */}
      {dispute.dispute_status === "resolved" && (
        <Card className="mb-4 border-success shadow-sm">
          <Card.Header className="bg-success text-white fw-semibold">
            ✅ Resolution Summary
          </Card.Header>
          <Card.Body>
            <Table className="mb-0" bordered size="sm">
              <tbody>
                <tr>
                  <td className="fw-semibold" style={{ width: "40%" }}>
                    Fault Assigned To
                  </td>
                  <td className="text-capitalize">
                    {dispute.dispute_fault || "—"}
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold">Resolution Notes</td>
                  <td>{dispute.resolution_description || "—"}</td>
                </tr>
                {dispute.resolved_at && (
                  <tr>
                    <td className="fw-semibold">Resolved At</td>
                    <td>{new Date(dispute.resolved_at).toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Dispute Info */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-success text-white fw-semibold">
          Dispute Information
        </Card.Header>
        <Card.Body>
          <Table bordered size="sm" className="mb-0">
            <tbody>
              <tr>
                <td className="fw-semibold" style={{ width: "40%" }}>
                  Raised By
                </td>
                <td className="text-capitalize">
                  {dispute.dispute_raised_by} ({dispute.dispute_raised_by_email}
                  )
                </td>
              </tr>
              <tr>
                <td className="fw-semibold">Stage</td>
                <td className="text-capitalize">
                  {dispute.dispute_stage?.replace(/_/g, " ")}
                </td>
              </tr>
              <tr>
                <td className="fw-semibold">Reason</td>
                <td>{dispute.reason_for_dispute}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Description</td>
                <td>{dispute.dispute_description}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Date Filed</td>
                <td>
                  {new Date(dispute.createdAt).toLocaleDateString()}{" "}
                  {new Date(dispute.createdAt).toLocaleTimeString()}
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Parties */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-success text-white fw-semibold">
          Parties Involved
        </Card.Header>
        <Card.Body>
          <Table bordered size="sm" className="mb-0">
            <tbody>
              <tr>
                <td className="fw-semibold" style={{ width: "40%" }}>
                  Buyer Email
                </td>
                <td>{dispute.buyer_email}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Vendor Name</td>
                <td>{dispute.vendor_name}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Vendor Email</td>
                <td>{dispute.vendor_email}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Vendor Phone</td>
                <td>{dispute.vendor_phone_number}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Products — uses dispute.products array, not flat tx fields */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-success text-white fw-semibold">
          Disputed Products
        </Card.Header>
        <Card.Body className="p-0">
          <Table bordered className="mb-0" size="sm">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No product details
                  </td>
                </tr>
              ) : (
                products.map((p, i) => (
                  <tr key={p._id || i}>
                    <td>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{
                          width: 56,
                          height: 56,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </td>
                    <td>
                      <div className="fw-semibold">{p.name}</div>
                      {p.description && (
                        <small className="text-muted">{p.description}</small>
                      )}
                    </td>
                    <td>{p.quantity}</td>
                    <td>₦{(p.price || 0).toLocaleString()}</td>
                    <td>
                      ₦{((p.price || 0) * (p.quantity || 1)).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {products.length > 0 && (
              <tfoot className="table-light">
                <tr>
                  <td colSpan="4" className="text-end fw-bold">
                    Total
                  </td>
                  <td className="fw-bold">₦{totalPrice.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </Table>
        </Card.Body>
      </Card>

      {/* Transaction snapshot */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-success text-white fw-semibold">
          Transaction State at Filing
        </Card.Header>
        <Card.Body>
          <Table bordered size="sm" className="mb-0">
            <tbody>
              {Object.entries(dispute.transaction_state_snapshot || {}).map(
                ([key, val]) => (
                  <tr key={key}>
                    <td
                      className="fw-semibold text-capitalize"
                      style={{ width: "50%" }}
                    >
                      {key.replace(/_/g, " ")}
                    </td>
                    <td>
                      <Badge bg={val ? "success" : "secondary"}>
                        {val ? "Yes" : "No"}
                      </Badge>
                    </td>
                  </tr>
                ),
              )}
              {tx.delivery_address && (
                <tr>
                  <td className="fw-semibold">Delivery Address</td>
                  <td>{tx.delivery_address}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Resolution proposal history */}
      {dispute.resolution_proposals?.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-success text-white fw-semibold">
            Resolution Proposal History
          </Card.Header>
          <Card.Body className="p-0">
            <Table bordered size="sm" className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Proposed By</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dispute.resolution_proposals.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="text-capitalize">{p.proposed_by}</td>
                    <td>{p.proposal_description}</td>
                    <td>
                      <Badge
                        bg={
                          p.status === "accepted"
                            ? "success"
                            : p.status === "rejected"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td>{new Date(p.proposal_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Actions */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button variant="outline-success" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        {canResolve(dispute.dispute_status) && (
          <Button
            variant="success"
            onClick={() =>
              navigate(`/dashboard/settle-dispute/${dispute._id}/settle`)
            }
          >
            Resolve Dispute
          </Button>
        )}
      </div>
    </div>
  );
};

export default DisputeDetails;
