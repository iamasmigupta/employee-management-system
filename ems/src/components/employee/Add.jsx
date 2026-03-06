import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdBadge, FaBriefcase, FaMoneyBillWave, FaBuilding, FaLock, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import API_URL from '../../utils/api';

const Add = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', employeeId: '', dob: '', gender: '',
    maritalStatus: '', designation: '', department: '', salary: '',
    password: '', role: 'employee',
  });
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch real departments from MongoDB
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/department`);
        if (res.data.success) {
          setDepartments(res.data.departments);
        }
      } catch (err) {
        console.error('Failed to fetch departments');
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post(`${API_URL}/api/employee/add`, formDataObj);
      if (response.data.success) {
        navigate('/admin-dashboard/employee');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate('/admin-dashboard/employee')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition shadow-sm border border-gray-200">
          <FaArrowLeft />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
          <p className="text-sm text-gray-500">Fill in the details below to create a new employee record</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaUser className="text-teal-500" /> Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="John Doe" required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="john@company.com" required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth *</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Marital Status</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition">
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Profile Image</label>
              <input type="file" name="image" onChange={handleChange} accept="image/*"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaBriefcase className="text-blue-500" /> Employment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Employee ID *</label>
              <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange}
                placeholder="EMP001" required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Designation</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleChange}
                placeholder="Software Engineer"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Department *</label>
              <select name="department" value={formData.department} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition">
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.dep_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Salary</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input type="number" name="salary" value={formData.salary} onChange={handleChange}
                  placeholder="50000"
                  className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Setup */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaLock className="text-amber-500" /> Account Setup
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Set initial password" required
                  className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
              <select name="role" value={formData.role} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => navigate('/admin-dashboard/employee')}
            className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-8 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 font-semibold shadow-lg shadow-teal-500/25 transition disabled:opacity-50">
            {isSubmitting ? 'Adding...' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
