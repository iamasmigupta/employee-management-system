import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBuilding, FaArrowLeft } from 'react-icons/fa';
import API_URL from '../../utils/api';

const AddDepartment = () => {
  const [department, setDepartment] = useState({ dep_name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/department/add`, department);
      if (response.data.success) {
        navigate('/admin-dashboard/department');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add department');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => navigate('/admin-dashboard/department')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition shadow-sm border border-gray-200">
            <FaArrowLeft />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add Department</h2>
            <p className="text-sm text-gray-500">Create a new department for your organization</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <FaBuilding />
            </div>
            <h3 className="text-base font-semibold text-gray-700">Department Details</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Department Name *</label>
              <input type="text" name="dep_name" placeholder="e.g. Software Engineering"
                value={department.dep_name} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <textarea name="description" placeholder="Brief description of the department..."
                value={department.description} onChange={handleChange} rows="4"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition resize-none" />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => navigate('/admin-dashboard/department')}
                className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="px-8 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 font-semibold shadow-lg shadow-teal-500/25 transition disabled:opacity-50">
                {isSubmitting ? 'Adding...' : 'Add Department'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
