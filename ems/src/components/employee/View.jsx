import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaBriefcase, FaBuilding, FaMoneyBillWave, FaCalendar, FaVenusMars, FaHeart, FaIdBadge, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaClock } from 'react-icons/fa';
import API_URL from '../../utils/api';

const View = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const empRes = await axios.get(`${API_URL}/api/employee`);
                const emp = empRes.data.employees.find(e => e._id === id);
                setEmployee(emp);

                if (emp?.userId?.email) {
                    const [attRes, leaveRes] = await Promise.all([
                        axios.get(`${API_URL}/api/attendance/employee?email=${emp.userId.email}`),
                        axios.get(`${API_URL}/api/leave/employee?email=${emp.userId.email}`)
                    ]);
                    setAttendance(attRes.data.attendance || []);
                    setLeaves(leaveRes.data.leaves || []);
                }
            } catch (err) {
                console.error('Failed to load employee:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Employee not found.</p>
                <button onClick={() => navigate('/admin-dashboard/employee')} className="mt-2 text-teal-600 hover:underline">← Back to list</button>
            </div>
        );
    }

    const present = attendance.filter(a => a.status === 'Present').length;
    const late = attendance.filter(a => a.status === 'Late').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;
    const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;
    const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
    const rejectedLeaves = leaves.filter(l => l.status === 'Rejected').length;

    const InfoItem = ({ icon, label, value, color = 'text-teal-500' }) => (
        <div className="flex items-start space-x-3 py-2">
            <span className={`${color} mt-0.5`}>{icon}</span>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-medium text-gray-800">{value || 'N/A'}</p>
            </div>
        </div>
    );

    const StatCard = ({ icon, label, value, bg, text }) => (
        <div className={`${bg} rounded-xl p-4 text-center`}>
            <div className="flex items-center justify-center mb-1">{icon}</div>
            <p className={`text-2xl font-bold ${text}`}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={() => navigate('/admin-dashboard/employee')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <FaArrowLeft className="text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Employee Details</h2>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-28"></div>
                <div className="px-6 pb-6 -mt-12">
                    <div className="flex items-end space-x-4">
                        <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-teal-600 text-3xl font-bold">
                            {employee.userId?.name?.[0] || 'E'}
                        </div>
                        <div className="pb-1">
                            <h3 className="text-xl font-bold text-gray-800">{employee.userId?.name || 'N/A'}</h3>
                            <p className="text-sm text-gray-500">{employee.designation || 'No designation'} · {employee.department?.dep_name || 'No department'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left — Personal Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h4 className="font-semibold text-gray-700 mb-3">Personal Info</h4>
                        <InfoItem icon={<FaIdBadge />} label="Employee ID" value={employee.employeeId} />
                        <InfoItem icon={<FaEnvelope />} label="Email" value={employee.userId?.email} />
                        <InfoItem icon={<FaVenusMars />} label="Gender" value={employee.gender} />
                        <InfoItem icon={<FaHeart />} label="Marital Status" value={employee.maritalStatus} />
                        <InfoItem icon={<FaCalendar />} label="Date of Birth" value={employee.dob ? new Date(employee.dob).toLocaleDateString() : null} />
                        <InfoItem icon={<FaClock />} label="Joined" value={new Date(employee.createdAt).toLocaleDateString()} />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h4 className="font-semibold text-gray-700 mb-3">Employment</h4>
                        <InfoItem icon={<FaBriefcase />} label="Designation" value={employee.designation} />
                        <InfoItem icon={<FaBuilding />} label="Department" value={employee.department?.dep_name} />
                        <InfoItem icon={<FaMoneyBillWave />} label="Monthly Salary" value={employee.salary ? `₹${Number(employee.salary).toLocaleString()}` : null} />
                    </div>
                </div>

                {/* Right — Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Attendance Summary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h4 className="font-semibold text-gray-700 mb-4">Attendance Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <StatCard icon={<FaCheckCircle className="text-green-500" />} label="Present" value={present} bg="bg-green-50" text="text-green-600" />
                            <StatCard icon={<FaClock className="text-amber-500" />} label="Late" value={late} bg="bg-amber-50" text="text-amber-600" />
                            <StatCard icon={<FaTimesCircle className="text-red-500" />} label="Absent" value={absent} bg="bg-red-50" text="text-red-600" />
                            <StatCard icon={<FaCalendar className="text-blue-500" />} label="Total Days" value={present + late} bg="bg-blue-50" text="text-blue-600" />
                        </div>
                    </div>

                    {/* Leave Summary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h4 className="font-semibold text-gray-700 mb-4">Leave Summary</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <StatCard icon={<FaCheckCircle className="text-green-500" />} label="Approved" value={approvedLeaves} bg="bg-green-50" text="text-green-600" />
                            <StatCard icon={<FaHourglassHalf className="text-yellow-500" />} label="Pending" value={pendingLeaves} bg="bg-yellow-50" text="text-yellow-600" />
                            <StatCard icon={<FaTimesCircle className="text-red-500" />} label="Rejected" value={rejectedLeaves} bg="bg-red-50" text="text-red-600" />
                        </div>
                    </div>

                    {/* Recent Attendance */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h4 className="font-semibold text-gray-700 mb-4">Recent Attendance</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 font-semibold text-gray-600">Date</th>
                                        <th className="px-4 py-2 font-semibold text-gray-600">Check In</th>
                                        <th className="px-4 py-2 font-semibold text-gray-600">Check Out</th>
                                        <th className="px-4 py-2 font-semibold text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.slice(0, 5).map(a => (
                                        <tr key={a._id} className="border-t">
                                            <td className="px-4 py-2">{new Date(a.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">{a.checkIn || '-'}</td>
                                            <td className="px-4 py-2">{a.checkOut || '-'}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                          ${a.status === 'Present' ? 'bg-green-100 text-green-700' : ''}
                          ${a.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${a.status === 'Absent' ? 'bg-red-100 text-red-700' : ''}
                        `}>{a.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {attendance.length === 0 && (
                                        <tr><td colSpan="4" className="text-center py-3 text-gray-400">No attendance records</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View;
