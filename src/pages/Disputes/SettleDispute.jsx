import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { resolveDispute } from "../../Redux/Slice/DisputeSlice/DisputeSlice";

const RESOLVABLE = ["resolving", "escalated_to_mediator"];

const SettleDispute = () => {
  const { id } = useParams(); // dispute._id (from route)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── From Redux only ───────────────────────────────────────────────────────
  const dispute = useSelector((state) =>
    state.disputes.disputes.find((d) => d._id === id),
  );

  const [disputeFault, setDisputeFault] = useState("buyer");
  const [resolutionDesc, setResolutionDesc] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (!dispute) {
    return (
      <div className="text-center py-5">
        <h4>Dispute not found</h4>
        <Button variant="link" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!RESOLVABLE.includes(dispute.dispute_status)) {
    return (
      <div className="container py-5 text-center">
        <Alert
          variant={
            dispute.dispute_status === "resolved" ? "success" : "warning"
          }
        >
          <Alert.Heading>
            {dispute.dispute_status === "resolved"
              ? "✅ This dispute has already been resolved."
              : `⚠️ Cannot resolve a dispute with status: ${dispute.dispute_status}`}
          </Alert.Heading>
        </Alert>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!resolutionDesc.trim()) return;
    setSubmitting(true);
    setSubmitError(null);

    // ✅ Must use transaction_id — backend route is /resolve-dispute/:transaction_id
    const payload = {
      transaction_id: dispute.transaction_id,
      dispute_fault: disputeFault,
      resolution_description: resolutionDesc.trim(),
    };

    try {
      const resultAction = await dispatch(resolveDispute(payload));

      if (resolveDispute.fulfilled.match(resultAction)) {
        toast.success("Dispute resolved successfully!");
        setShowModal(false);
        navigate("/dashboard");
      } else {
        const msg = resultAction.payload || "Failed to resolve dispute.";
        setSubmitError(msg);
        toast.error(msg);
      }
    } catch {
      const msg = "An unexpected error occurred.";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <h3 className="mb-1 text-center fw-bold">Settle Dispute</h3>
      <p className="text-center text-muted mb-4 small">
        Transaction: <code>{dispute.transaction_id}</code>
      </p>

      {/* Context */}
      <div className="bg-light rounded p-3 mb-4 small">
        <div>
          <strong>Product:</strong> {dispute.product_name}
        </div>
        <div>
          <strong>Buyer:</strong> {dispute.buyer_email}
        </div>
        <div>
          <strong>Seller:</strong> {dispute.vendor_email}
        </div>
        <div>
          <strong>Reason:</strong> {dispute.reason_for_dispute}
        </div>
        <div>
          <strong>Description:</strong> {dispute.dispute_description}
        </div>
      </div>

      {submitError && (
        <Alert
          variant="danger"
          onClose={() => setSubmitError(null)}
          dismissible
        >
          {submitError}
        </Alert>
      )}

      <Form>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Who is at fault?</Form.Label>
          <Form.Select
            value={disputeFault}
            onChange={(e) => setDisputeFault(e.target.value)}
          >
            <option value="buyer">Buyer — {dispute.buyer_email}</option>
            <option value="seller">Seller — {dispute.vendor_email}</option>
          </Form.Select>
          <Form.Text className="text-muted">
            Both parties will be notified by email.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">
            Resolution Description
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Explain your decision in detail…"
            value={resolutionDesc}
            onChange={(e) => setResolutionDesc(e.target.value)}
          />
          <Form.Text className="text-muted">
            {resolutionDesc.trim().length} characters
          </Form.Text>
        </Form.Group>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <Button
            variant="success"
            disabled={!resolutionDesc.trim()}
            onClick={() => setShowModal(true)}
          >
            Review & Submit
          </Button>
        </div>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Resolution</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Fault Assigned To: </strong>
            <span className="badge bg-danger text-capitalize">
              {disputeFault}
            </span>
          </p>
          <p className="mb-1">
            <strong>Resolution Notes:</strong>
          </p>
          <div
            className="border rounded p-2 bg-light"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {resolutionDesc}
          </div>
          <p className="mt-3 text-muted small mb-0">
            ⚠️ This action is <strong>irreversible</strong>. Both parties will
            be notified.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Submitting…
              </>
            ) : (
              "Confirm Resolution"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SettleDispute;
