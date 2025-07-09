// src/pages/Disputes/SettleDispute.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { resolveDispute } from '../../Redux/Slice/DisputeSlice/ResolvedDisputeSlice';

const SettleDispute = () => {
  const { id } = useParams(); // id = transaction_id or dispute._id
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dispute = useSelector((state) =>
    state.disputes.disputes.find((d) => d._id === id)
  );

  const [disputeFault, setDisputeFault] = useState('buyer');
  const [resolutionDesc, setResolutionDesc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!dispute) {
    return (
      <div className="text-center py-5">
        <h4>Dispute not found</h4>
        <p>
          Return to{' '}
          <Button variant="link" onClick={() => navigate(-1)}>
            Dashboard
          </Button>
        </p>
      </div>
    );
  }

  const handleSubmit = async () => {
     setSubmitting(true);
    
    const payload = {
       transaction_id: dispute.transaction_id || dispute._id,
       dispute_fault: disputeFault,
       resolution_description: resolutionDesc,
      };
    
     try {
         const resultAction = await dispatch(resolveDispute(payload));

       if (resolveDispute.fulfilled.match(resultAction)) {
           toast.success('Dispute resolved successfully!');
           navigate('/dashboard');
       } else {
          toast.error(resultAction.payload || 'Failed to resolve dispute.');
       }
      } catch (err) {
        toast.error('An unexpected error occurred.');
      } finally {
        setSubmitting(false);
        setShowModal(false);
      }
    };
    
    

  return (
    <div className="container py-5">
      <h3 className="mb-4 text-center">Settle Dispute</h3>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label><strong>Who is at fault?</strong></Form.Label>
          <Form.Select value={disputeFault} onChange={(e) => setDisputeFault(e.target.value)}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label><strong>Resolution Description</strong></Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter resolution notes or description..."
            value={resolutionDesc}
            onChange={(e) => setResolutionDesc(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
          <Button
            variant="success"
            disabled={!resolutionDesc.trim()}
            onClick={() => setShowModal(true)}
          >
            Proceed
          </Button>
        </div>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Dispute Resolution</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Dispute Fault:</strong> {disputeFault}</p>
          <p><strong>Resolution Description:</strong></p>
          <div className="border p-2 rounded bg-light">{resolutionDesc}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SettleDispute;
