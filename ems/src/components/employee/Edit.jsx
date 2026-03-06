import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaBriefcase, FaMoneyBillWave, FaBuilding, FaSave } from 'react-icons/fa';
import API_URL from '../../utils/api';

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '', designation: '', department: '', salary: '', maritalStatus: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch employee
                const empRes = await axios.get(`${API_URL}/api/employee`);
                const emp = empRes.data.employees.find(e => e._id === id);
                if (emp) {
                    setFormData({
                        name: emp.userId?.name || '',
                        designation: emp.designation || '',
                        department: emp.department?._id || '',
                        salary: emp.salary || '',
                        maritalStatus: emp.maritalStatus || '',
                    });
                }
                // Fetch departments
                const depRes = await axios.get(`${API_URL}/api/department`);
                if (depRes.data.success) {
                    setDepartments(depRes.data.departments);
                }
            } catch (err) {
                setError('Failed to load employee data');
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const res = await axios.put(`${API_URL}/api/employee/${id}`, formData);
            if (res.data.success) {
                setSuccess('Employee updated successfully!');
                setTimeout(() => navigate('/admin-dashboard/employee'), 1500);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update employee');
        }
        setIsSubmitting(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition";

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={() => navigate('/admin-dashboard/employee')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <FaArrowLeft className="text-gray-600" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Edit Employee</h2>
                    <p className="text-sm text-gray-400">Update employee details</p>
                </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FaUser className="text-teal-500" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                className={inputClass} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Marital Status</label>
                            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={inputClass}>
                                <option value="">Select</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Employment Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FaBriefcase className="text-teal-500" /> Employment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Designation</label>
                            <input type="text" name="designation" value={formData.designation} onChange={handleChange}
                                className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                            <select name="department" value={formData.department} onChange={handleChange} className={inputClass}>
                                <option value="">Select Department</option>
                                {departments.map(dep => (
                                    <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Salary</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                <input type="number" name="salary" value={formData.salary} onChange={handleChange}
                                    className={`${inputClass} pl-7`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    <button type="button" onClick={() => navigate('/admin-dashboard/employee')}
                        className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/25 transition font-semibold disabled:opacity-50">
                        <FaSave /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Edit;
