import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { FaUser, FaPhone, FaMapMarkerAlt, FaHeart, FaSave, FaCheckCircle } from 'react-icons/fa';
import API_URL from '../../utils/api';

const EditProfile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        phone: '', address: '', maritalStatus: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.email) return;
            try {
                const res = await axios.get(`${API_URL}/api/employee/by-email?email=${user.email}`);
                if (res.data.success) {
                    const emp = res.data.employee;
                    setEmployee(emp);
                    setFormData({
                        phone: emp.phone || '',
                        address: emp.address || '',
                        maritalStatus: emp.maritalStatus || '',
                    });
                }
            } catch (err) {
                setError('Failed to load profile');
            }
            setLoading(false);
        };
        fetchProfile();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const res = await axios.put(`${API_URL}/api/employee/update-profile`, {
                email: user.email,
                ...formData,
            });
            if (res.data.success) {
                setSuccess('Profile updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError('Failed to update profile');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!employee) {
        return <div className="p-6 text-gray-500">No profile found. Please ask admin to add you as an employee.</div>;
    }

    const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition";

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Edit Profile</h2>
            <p className="text-sm text-gray-400 mb-6">Update your personal information</p>

            {/* Read-only info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-blue-500" /> Basic Info (Read-only)
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-400">Name:</span> <span className="font-medium">{employee.userId?.name}</span></div>
                    <div><span className="text-gray-400">Email:</span> <span className="font-medium">{employee.userId?.email}</span></div>
                    <div><span className="text-gray-400">Employee ID:</span> <span className="font-medium">{employee.employeeId}</span></div>
                    <div><span className="text-gray-400">Department:</span> <span className="font-medium">{employee.department?.dep_name}</span></div>
                    <div><span className="text-gray-400">Designation:</span> <span className="font-medium">{employee.designation}</span></div>
                    <div><span className="text-gray-400">Gender:</span> <span className="font-medium">{employee.gender}</span></div>
                </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm flex items-center gap-2">
                    <FaCheckCircle /> {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Editable Info</h3>

                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                            <FaPhone className="text-blue-400 text-xs" /> Phone Number
                        </label>
                        <input type="tel" value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter your phone number" className={inputClass} />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                            <FaMapMarkerAlt className="text-blue-400 text-xs" /> Address
                        </label>
                        <textarea value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter your address" rows={3} className={inputClass} />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                            <FaHeart className="text-blue-400 text-xs" /> Marital Status
                        </label>
                        <select value={formData.maritalStatus}
                            onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                            className={inputClass}>
                            <option value="">Select</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>

                    <button type="submit" disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition font-semibold disabled:opacity-50 mt-2">
                        <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
