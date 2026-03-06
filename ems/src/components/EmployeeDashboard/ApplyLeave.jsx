import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import API_URL from '../../utils/api';

const LEAVE_BALANCES = [
    { type: 'Casual Leave', total: 12, color: 'blue' },
    { type: 'Sick Leave', total: 10, color: 'purple' },
    { type: 'Earned Leave', total: 15, color: 'teal' },
    { type: 'Maternity Leave', total: 90, color: 'pink' },
];

const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500', border: 'border-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-500', border: 'border-purple-100' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-700', bar: 'bg-teal-500', border: 'border-teal-100' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-700', bar: 'bg-pink-500', border: 'border-pink-100' },
};

const ApplyLeave = () => {
    const { user } = useAuth();
    const [leaveData, setLeaveData] = useState({ leaveType: '', startDate: '', endDate: '', reason: '' });
    const [leaves, setLeaves] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const fetchLeaves = async () => {
        if (!user?.email) return;
        try {
            const res = await axios.get(`${API_URL}/api/leave/employee?email=${user.email}`);
            if (res.data.success) setLeaves(res.data.leaves);
        } catch (err) {
            console.error('Failed to fetch leaves:', err);
        }
    };

    useEffect(() => { fetchLeaves(); }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeaveData({ ...leaveData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await axios.post(`${API_URL}/api/leave/apply`, {
                email: user.email,
                leaveType: leaveData.leaveType,
                startDate: leaveData.startDate,
                endDate: leaveData.endDate,
                reason: leaveData.reason,
            });
            if (res.data.success) {
                alert('Leave application submitted successfully!');
                setLeaveData({ leaveType: '', startDate: '', endDate: '', reason: '' });
                fetchLeaves();
            } else {
                alert(res.data.error || 'Failed to apply leave');
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to apply leave. Make sure admin has added you as an employee.');
        }
        setSubmitting(false);
    };

    const getDays = (start, end) => {
        const diff = new Date(end) - new Date(start);
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const getUsedDays = (type) => {
        return leaves
            .filter(l => l.leaveType === type && l.status === 'Approved')
            .reduce((sum, l) => sum + getDays(l.startDate, l.endDate), 0);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Leaves</h2>

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {LEAVE_BALANCES.map(({ type, total, color }) => {
                    const used = getUsedDays(type);
                    const remaining = Math.max(0, total - used);
                    const pct = Math.min(100, Math.round((used / total) * 100));
                    const c = colorMap[color];
                    return (
                        <div key={type} className={`rounded-2xl border ${c.bg} ${c.border} p-4`}>
                            <p className="text-xs font-semibold text-gray-500 mb-1 leading-tight">{type}</p>
                            <p className={`text-3xl font-bold ${c.text}`}>{remaining}</p>
                            <p className="text-xs text-gray-400 mb-2">of {total} days remaining</p>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${c.bar} rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{used} used</p>
                        </div>
                    );
                })}
            </div>

            {/* Apply Leave Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                        <select name="leaveType" value={leaveData.leaveType} onChange={handleChange} required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition">
                            <option value="">Select Type</option>
                            <option value="Casual Leave">Casual Leave</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Earned Leave">Earned Leave</option>
                            <option value="Maternity Leave">Maternity Leave</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="date" name="startDate" value={leaveData.startDate} onChange={handleChange} required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="date" name="endDate" value={leaveData.endDate} onChange={handleChange} required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <input type="text" name="reason" value={leaveData.reason} onChange={handleChange} placeholder="Enter reason"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" disabled={submitting}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-lg shadow-blue-500/25 disabled:opacity-50">
                            {submitting ? 'Submitting...' : 'Apply Leave'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Leave History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Leave History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">S No</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Leave Type</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">From</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">To</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Days</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Reason</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4 text-gray-500">No leave records yet.</td></tr>
                            ) : (
                                leaves.map((leave, index) => (
                                    <tr key={leave._id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3">{leave.leaveType}</td>
                                        <td className="px-4 py-3">{new Date(leave.startDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{new Date(leave.endDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{getDays(leave.startDate, leave.endDate)}</td>
                                        <td className="px-4 py-3">{leave.reason || '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' : ''}
                                                ${leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                ${leave.status === 'Rejected' ? 'bg-red-100 text-red-700' : ''}
                                            `}>{leave.status}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ApplyLeave;
