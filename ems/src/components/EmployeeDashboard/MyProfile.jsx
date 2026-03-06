import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { FaEnvelope, FaUser, FaBriefcase, FaBuilding, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import API_URL from '../../utils/api';

const MyProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.email) return;
            try {
                const res = await axios.get(`${API_URL}/api/employee/by-email?email=${user.email}`);
                if (res.data.success) {
                    setProfile(res.data.employee);
                }
            } catch (err) {
                console.log('Profile not found');
            }
        };
        fetchProfile();
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header Banner — BLUE */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 flex items-end px-6 pb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-white rounded-full border-4 border-white flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold">{profile?.userId?.name || user?.name || 'Employee'}</h3>
                            <p className="text-blue-100">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                        <FaUser className="text-blue-500 text-lg" />
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{profile?.userId?.name || user?.name || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <FaEnvelope className="text-blue-500 text-lg" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user?.email || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <FaBriefcase className="text-blue-500 text-lg" />
                        <div>
                            <p className="text-sm text-gray-500">Designation</p>
                            <p className="font-medium">{profile?.designation || 'Not assigned'}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <FaBuilding className="text-blue-500 text-lg" />
                        <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">{profile?.department?.dep_name || 'Not assigned'}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <FaCalendar className="text-blue-500 text-lg" />
                        <div>
                            <p className="text-sm text-gray-500">Joined Date</p>
                            <p className="font-medium">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <FaMoneyBillWave className="text-blue-500 text-lg" />
                        <div>
                            <p className="text-sm text-gray-500">Salary</p>
                            <p className="font-medium">{profile?.salary ? `₹${profile.salary.toLocaleString()}` : 'Not assigned'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
