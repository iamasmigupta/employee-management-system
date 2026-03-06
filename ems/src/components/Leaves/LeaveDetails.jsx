import React from 'react';
import { useLocation } from 'react-router-dom';

const LeaveDetails = () => {
  const { state } = useLocation();
  const leave = state?.leave;

  if (!leave) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        No leave data available.
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Leave Details</h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Employee"
            className="rounded-full w-48 h-48 object-cover"
          />
          <div className="text-lg">
            <p><strong>Name:</strong> {leave.name}</p>
            <p><strong>Employee ID:</strong> {leave.empId}</p>
            <p><strong>Leave Type:</strong> {leave.type}</p>
            <p><strong>Reason:</strong> {leave.reason}</p>
            <p><strong>Department:</strong> {leave.dept}</p>
            <p><strong>Start Date:</strong> {leave.startDate}</p>
            <p><strong>End Date:</strong> {leave.endDate}</p>
            <p><strong>Status:</strong> {leave.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;
