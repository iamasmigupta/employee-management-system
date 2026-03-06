import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaSearch, FaEdit, FaSave, FaTimes, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import API_URL from '../../utils/api';

const AddSalary = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editSalary, setEditSalary] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/employee`);
      if (res.data.success) setEmployees(res.data.employees);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setEditSalary(emp.salary || '');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/api/employee/${editingId}`, { salary: Number(editSalary) });
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      alert('Failed to update salary');
    }
    setSaving(false);
  };

  const filtered = employees.filter(emp =>
    emp.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.dep_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalary = employees.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(20, 184, 166);
    doc.text('WorkSphere - Salary Report', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Monthly Payroll: ₹${totalSalary.toLocaleString()}`, 14, 35);

    autoTable(doc, {
      startY: 42,
      head: [['S No', 'Emp ID', 'Name', 'Department', 'Designation', 'Monthly Salary (₹)']],
      body: filtered.map((emp, i) => [
        i + 1,
        emp.employeeId,
        emp.userId?.name || 'N/A',
        emp.department?.dep_name || 'N/A',
        emp.designation || 'N/A',
        Number(emp.salary).toLocaleString(),
      ]),
      foot: [['', '', '', '', 'Total', `₹${totalSalary.toLocaleString()}`]],
      theme: 'grid',
      headStyles: { fillColor: [20, 184, 166] },
      footStyles: { fillColor: [240, 253, 250], textColor: [20, 150, 130], fontStyle: 'bold' },
    });
    doc.save('Salary_Report.pdf');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold">Salary Management</h2>
          <p className="text-gray-400 text-sm">View and manage employee salaries</p>
        </div>
        <button onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25 transition text-sm font-medium">
          <FaFilePdf /> Export PDF
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <FaMoneyBillWave className="text-teal-500 text-lg mx-auto mb-1" />
          <p className="text-2xl font-bold text-teal-600">₹{totalSalary.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total Monthly Payroll</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
          <p className="text-xs text-gray-500">Total Employees</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">
            ₹{employees.length > 0 ? Math.round(totalSalary / employees.length).toLocaleString() : 0}
          </p>
          <p className="text-xs text-gray-500">Average Salary</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative w-fit">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name, ID, or department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 focus:bg-white transition text-sm w-80"
          />
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">S No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Emp ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Department</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Designation</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Monthly Salary</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-400">No employees found.</td>
              </tr>
            ) : (
              filtered.map((emp, index) => (
                <tr key={emp._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-mono">{emp.employeeId}</td>
                  <td className="px-4 py-3 text-sm font-medium">{emp.userId?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{emp.userId?.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{emp.department?.dep_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{emp.designation || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === emp._id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">₹</span>
                        <input
                          type="number"
                          value={editSalary}
                          onChange={(e) => setEditSalary(e.target.value)}
                          className="w-28 px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span className="font-semibold text-green-600">₹{Number(emp.salary).toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === emp._id ? (
                        <>
                          <button onClick={handleSave} disabled={saving}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition" title="Save">
                            <FaSave />
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition" title="Cancel">
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleEdit(emp)}
                          className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg transition" title="Edit Salary">
                          <FaEdit />
                        </button>
                      )}
                    </div>
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

export default AddSalary;
