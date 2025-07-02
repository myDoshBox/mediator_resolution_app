import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DisputeDetails = () => {
  const { id } = useParams();
  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:5000/api/disputes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDispute(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!dispute) return <div className="p-4 text-danger">Dispute not found</div>;

  return (
    <div className="container py-4">
      <h3>Dispute Details</h3>
      <div className="bg-white p-3 shadow-sm rounded">
        <p><strong>Title:</strong> {dispute.title}</p>
        <p><strong>Status:</strong> {dispute.status}</p>
        <p><strong>Description:</strong> {dispute.description || 'N/A'}</p>
        <p><strong>Created At:</strong> {new Date(dispute.createdAt).toLocaleString()}</p>
        {/* Add more fields if needed */}
      </div>
    </div>
  );
};

export default DisputeDetails;
