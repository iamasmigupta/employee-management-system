import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from 'react-icons/fa';
import API_URL from '../../utils/api';

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/employee`);
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`${API_URL}/api/employee/${id}`);
      fetchEmployees();
    } catch (err) {
      alert('Failed to delete employee');
    }
  };

  const filtered = employees.filter(emp =>
    emp.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Employees</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search By Name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 focus:bg-white transition"
          />
        </div>
        <Link
          to="/admin-dashboard/add-employee"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/25 transition font-medium"
        >
          <FaPlus className="text-sm" /> Add New Employee
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">S No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Emp ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Department</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Designation</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Salary</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400">No employees found. Add one!</td>
              </tr>
            ) : (
              filtered.map((emp, index) => (
                <tr key={emp._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-mono">{emp.employeeId}</td>
                  <td className="px-4 py-3 text-sm font-medium">{emp.userId?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{emp.department?.dep_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{emp.designation || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">₹{Number(emp.salary)?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/admin-dashboard/view-employee/${emp._id}`}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="View">
                        <FaEye />
                      </Link>
                      <Link to={`/admin-dashboard/edit-employee/${emp._id}`}
                        className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg transition" title="Edit">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(emp._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <FaTrash />
                      </button>
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

export default List;
