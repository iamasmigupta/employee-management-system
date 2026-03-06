import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCheck, FaTimes, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import API_URL from '../../utils/api';

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/leave`);
      if (res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/leave/${id}`, { status });
      fetchLeaves();
    } catch (err) {
      alert('Failed to update leave status');
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const name = leave.employeeId?.userId?.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === '' || leave.status === filterStatus);
  });

  const getDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(20, 184, 166);
    doc.text('WorkSphere - Leave Report', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [['S No', 'Name', 'Type', 'From', 'To', 'Days', 'Reason', 'Status']],
      body: filteredLeaves.map((l, i) => [
        i + 1,
        l.employeeId?.userId?.name || 'N/A',
        l.leaveType,
        new Date(l.startDate).toLocaleDateString(),
        new Date(l.endDate).toLocaleDateString(),
        getDays(l.startDate, l.endDate),
        l.reason || '-',
        l.status,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [20, 184, 166] },
    });
    doc.save('Leave_Report.pdf');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold">Manage Leaves</h2>
          <p className="text-gray-400 text-sm">Review and manage employee leave requests</p>
        </div>
        <button onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25 transition text-sm font-medium">
          <FaFilePdf /> Export PDF
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <FaHourglassHalf className="text-yellow-500 text-lg mx-auto mb-1" />
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <FaCheckCircle className="text-green-500 text-lg mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <FaTimesCircle className="text-red-500 text-lg mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
          <p className="text-xs text-gray-500">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search By Employee Name"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 focus:bg-white transition text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {['', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${filterStatus === status
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>
        {(searchTerm || filterStatus) && (
          <button
            onClick={() => { setSearchTerm(''); setFilterStatus(''); }}
            className="text-xs text-red-500 hover:text-red-600 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">S No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">From</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">To</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Days</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Reason</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-400">No leave records found.</td>
              </tr>
            ) : (
              filteredLeaves.map((leave, index) => (
                <tr key={leave._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{leave.employeeId?.userId?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{leave.leaveType}</td>
                  <td className="px-4 py-3 text-sm">{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{getDays(leave.startDate, leave.endDate)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-[150px] truncate">{leave.reason || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{leave.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {leave.status === 'Pending' && (
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                          className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition" title="Approve">
                          <FaCheck />
                        </button>
                        <button onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Reject">
                          <FaTimes />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLeaves;
