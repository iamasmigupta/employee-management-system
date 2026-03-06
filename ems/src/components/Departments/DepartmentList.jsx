import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaSearch, FaBuilding } from 'react-icons/fa';
import API_URL from '../../utils/api';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/department`);
      if (res.data.success) {
        setDepartments(res.data.departments);
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await axios.delete(`${API_URL}/api/department/${id}`);
      fetchDepartments();
    } catch (err) {
      alert('Failed to delete department');
    }
  };

  const handleEdit = (dept) => {
    setEditingId(dept._id);
    setEditName(dept.dep_name);
    setEditDesc(dept.description || '');
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_URL}/api/department/${editingId}`, {
        dep_name: editName,
        description: editDesc,
      });
      setEditingId(null);
      fetchDepartments();
    } catch (err) {
      alert('Failed to update department');
    }
  };

  const filtered = departments.filter(d =>
    d.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Departments</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search By Department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 focus:bg-white transition"
          />
        </div>
        <Link
          to="/admin-dashboard/add-department"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/25 transition font-medium"
        >
          <FaPlus className="text-sm" /> Add Department
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">S No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Department Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">No departments found. Add one!</td>
              </tr>
            ) : (
              filtered.map((dept, index) => (
                <tr key={dept._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === dept._id ? (
                      <input value={editName} onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-teal-500 text-sm" />
                        <span className="font-medium">{dept.dep_name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {editingId === dept._id ? (
                      <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description (optional)"
                        className="px-3 py-1.5 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    ) : (
                      dept.description || '—'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === dept._id ? (
                        <>
                          <button onClick={handleSaveEdit}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition" title="Save">
                            <FaSave />
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition" title="Cancel">
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(dept)}
                            className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg transition" title="Edit">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(dept._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                            <FaTrash />
                          </button>
                        </>
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

export default DepartmentList;
