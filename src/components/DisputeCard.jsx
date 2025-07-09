import React from 'react';

const DisputeCard = ({ title, count, icon: Icon, iconColor }) => {
  return (
    <div
      className="card shadow-sm p-3 mb-4 border-0"
      style={{
        backgroundColor: '#fff',
        minWidth: '220px',
        borderRadius: '16px',
        minHeight: '105px', // You can change this value as needed
      }}
    >
      <div className="d-flex align-items-center mt-2 ">
        <div
          className="me-3 d-flex justify-content-center align-items-center "
          style={{
            backgroundColor: iconColor,
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            color: 'white',
          }}
        >
          <Icon size={24} />
        </div>
        <div>
          <h6 className="mb-1">{title}</h6>
          <h4 className="mb-0">{count}</h4>
        </div>
      </div>
    </div>
  );
};

export default DisputeCard;