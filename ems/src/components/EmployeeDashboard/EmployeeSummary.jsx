import React, { useEffect, useState } from 'react';
import SummaryCard from '../Dashboard/SummaryCard';
import { FaCalendarAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import API_URL from '../../utils/api';

const EmployeeSummary = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!user?.email) return;
            try {
                const res = await axios.get(`${API_URL}/api/dashboard/employee?email=${user.email}`);
                if (res.data.success) {
                    setSummary(res.data.summary);
                }
            } catch (err) {
                console.error('Failed to fetch employee summary:', err);
            }
        };
        fetchSummary();
    }, [user]);

    if (!summary) {
        return (
            <div className="p-6">
                <h3 className="text-2xl font-bold">My Dashboard</h3>
                <p className="text-gray-500 mt-1">Welcome, {user?.name || 'Employee'}!</p>
                <p className="mt-4 text-gray-400">No employee record found. Please ask admin to add you as an employee first.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold">My Dashboard</h3>
            <p className="text-gray-500 mt-1">Welcome, {summary.employee.name}!</p>

            {/* Quick Stats — BLUE theme */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <SummaryCard icon={<FaClipboardList />} text="Days Present" number={summary.attendance.total} color="bg-blue-600" />
                <SummaryCard icon={<FaCalendarAlt />} text="Leaves Taken" number={summary.leaves.approvedLeaves} color="bg-blue-600" />
                <SummaryCard icon={<FaMoneyBillWave />} text="Monthly Salary" number={`₹${summary.employee.salary?.toLocaleString() || 0}`} color="bg-blue-600" />
            </div>

            {/* Leave Summary */}
            <div className="mt-12">
                <h4 className="text-center text-2xl font-bold mb-6">My Leave Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <SummaryCard icon={<FaCalendarAlt />} text="Leaves Applied" number={summary.leaves.totalLeaves} color="bg-blue-600" />
                    <SummaryCard icon={<FaCheckCircle />} text="Leaves Approved" number={summary.leaves.approvedLeaves} color="bg-green-600" />
                    <SummaryCard icon={<FaHourglassHalf />} text="Leaves Pending" number={summary.leaves.pendingLeaves} color="bg-yellow-600" />
                    <SummaryCard icon={<FaTimesCircle />} text="Leaves Rejected" number={summary.leaves.rejectedLeaves} color="bg-red-600" />
                </div>
            </div>
        </div>
    );
};

export default EmployeeSummary;
