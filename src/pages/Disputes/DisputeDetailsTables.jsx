import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Card } from 'react-bootstrap'; // Removed Modal as it's no longer used here

const DisputeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispute = useSelector((state) =>
        state.disputes.disputes.find((d) => d._id === id)
    );

    // const [show, setShow] = useState(false); // No longer needed as we navigate

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

    return (
        <div className="container py-4">
        <h3 className="mb-4 text-center">Dispute Details Table</h3>
        
           {/* Dispute Resolution Information (Conditional) */}
           {dispute?.dispute_status === 'resolved' && (
            <Card className="mb-4 shadow-sm table-hover">
                <Card.Header className="bg-success text-white">Dispute Resolution Information</Card.Header>
                <Card.Body>
                <table className="table mb-0">
                    <tbody>
                    <tr><td>Resolved Against</td><td>{dispute?.dispute_fault}</td></tr>
                    <tr><td>Resolution Description</td><td>{dispute?.resolution_description}</td></tr>
                    </tbody>
                </table>
                </Card.Body>
            </Card>
            )}


            {/* User Details */}
            <Card className="mb-4 shadow-sm table-hover">
                <Card.Header className="bg-success text-white">User Details</Card.Header>
                <Card.Body>
                    <table className="table mb-0">
                        <tbody>
                            <tr><td>Email</td><td>{dispute.user?.email}</td></tr>
                            <tr><td>Phone</td><td>{dispute.user?.phone_number}</td></tr>
                            <tr><td>Initiated Date</td><td>{new Date(dispute?.createdAt).toLocaleDateString()}</td></tr>
                            <tr><td>Initiated Time</td><td>{new Date(dispute?.createdAt).toLocaleTimeString()}</td></tr>
                        </tbody>
                    </table>
                </Card.Body>
            </Card>

            {/* Transaction Details */}
            <Card className="mb-4 shadow-sm table-hover">
                <Card.Header className="bg-success text-white">Transaction Details</Card.Header>
                <Card.Body>
                    <table className="table mb-0">
                        <tbody>
                            <tr><td>Vendor Name</td><td>{dispute.transaction?.vendor_name}</td></tr>
                            <tr><td>Vendor Phone</td><td>{dispute.transaction?.vendor_phone_number}</td></tr>
                            <tr><td>Vendor Email</td><td>{dispute?.vendor_email}</td></tr>
                            <tr><td>Product Name</td><td>{dispute?.product_name}</td></tr>
                            <tr><td>Product Quantity</td><td>{dispute.transaction?.product_quantity}</td></tr>
                            <tr><td>Product Price</td><td>₦{dispute.transaction?.product_price.toLocaleString()}</td></tr>
                            <tr>
                                <td>Product Image</td>
                                <td>
                                    <img
                                        src={dispute.transaction?.product_image}
                                        alt="Product"
                                        style={{ maxWidth: '120px', maxHeight: '120px', borderRadius: '8px' }}
                                    />
                                </td>
                            </tr>
                            <tr><td>Delivery Address</td><td>{dispute.transaction?.delivery_address}</td></tr>
                            <tr><td>Transaction Date</td><td>{new Date(dispute.transaction?.createdAt).toLocaleDateString()}</td></tr>
                            <tr><td>Transaction Time</td><td>{new Date(dispute.transaction?.createdAt).toLocaleTimeString()}</td></tr>
                        </tbody>
                    </table>
                </Card.Body>
            </Card>

            {/* Dispute Info */}
            <Card className="mb-4 shadow-sm table-hover">
                <Card.Header className="bg-success text-white">Dispute Information</Card.Header>
                <Card.Body>
                    <table className="table mb-0">
                        <tbody>
                            <tr><td>Reason For Dispute</td><td>{dispute?.reason_for_dispute}</td></tr>
                            <tr><td>Dispute Description</td><td>{dispute?.dispute_description}</td></tr>
                            <tr><td>Date</td><td>{new Date(dispute?.createdAt).toLocaleDateString()}</td></tr>
                            <tr><td>Time</td><td>{new Date(dispute?.createdAt).toLocaleTimeString()}</td></tr>
                        </tbody>
                    </table>
                </Card.Body>
            </Card>

            {/* Footer Buttons */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <Button variant="outline-success" onClick={() => navigate(-1)}>
                    ← Back
                </Button>
                {dispute?.dispute_status !== 'resolved' && ( // Only show "Resolve Dispute" if not already resolved
                   // Inside DisputeDetails.jsx, for the Resolve Dispute button:
                    <Button
                        variant="success"
                        onClick={() => navigate(`/dashboard/settle-dispute/${dispute?._id}/settle`)} // ADDED '/settle'
                    >
                        Resolve Dispute
                    </Button>
                )}
            </div>
        </div>
    );
};

export default DisputeDetails;