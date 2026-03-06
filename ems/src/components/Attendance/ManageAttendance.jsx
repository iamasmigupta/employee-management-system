import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaFilter, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import API_URL from '../../utils/api';

const ManageAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/attendance`);
        if (res.data.success) {
          setAttendance(res.data.attendance);
        }
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
      }
    };
    fetchAttendance();
  }, []);

  const filtered = attendance.filter(record => {
    const name = record.employeeId?.userId?.name || '';
    const matchName = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === '' || record.status === filterStatus;
    const matchDate = filterDate === '' || new Date(record.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString();
    return matchName && matchStatus && matchDate;
  });

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(20, 184, 166);
    doc.text('WorkSphere - Attendance Report', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [['S No', 'Name', 'Date', 'Check In', 'Check Out', 'Hours', 'Status']],
      body: filtered.map((r, i) => [
        i + 1,
        r.employeeId?.userId?.name || 'N/A',
        new Date(r.date).toLocaleDateString(),
        r.checkIn || '-',
        r.checkOut || '-',
        r.workingHours || '-',
        r.status,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [20, 184, 166] },
    });
    doc.save('Attendance_Report.pdf');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold">Manage Attendance</h2>
          <p className="text-gray-400 text-sm">Track all employee attendance records</p>
        </div>
        <button onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25 transition text-sm font-medium">
          <FaFilePdf /> Export PDF
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          <p className="text-xs text-gray-500">Present</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
          <p className="text-xs text-gray-500">Late</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          <p className="text-xs text-gray-500">Absent</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search By Name"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 focus:bg-white transition text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-sm"
        />
        <div className="flex gap-1">
          {['', 'Present', 'Late', 'Absent'].map(status => (
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
        {(searchTerm || filterStatus || filterDate) && (
          <button
            onClick={() => { setSearchTerm(''); setFilterStatus(''); setFilterDate(''); }}
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Check In</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Check Out</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Hours</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-400">No attendance records found.</td>
              </tr>
            ) : (
              filtered.map((record, index) => (
                <tr key={record._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{record.employeeId?.userId?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{record.employeeId?.userId?.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{record.checkIn || '-'}</td>
                  <td className="px-4 py-3 text-sm">{record.checkOut || '-'}</td>
                  <td className="px-4 py-3 text-sm">{record.workingHours || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${record.status === 'Present' ? 'bg-green-100 text-green-700' :
                      record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{record.status}</span>
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

export default ManageAttendance;
