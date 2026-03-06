import React, { useEffect, useState } from 'react';
import SummaryCard from './SummaryCard';
import { FaUsers, FaBuilding, FaMoneyBillWave, FaFileAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import API_URL from '../../utils/api';

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, empRes] = await Promise.all([
          axios.get(`${API_URL}/api/dashboard/admin`),
          axios.get(`${API_URL}/api/employee`),
        ]);
        if (sumRes.data.success) setSummary(sumRes.data.summary);
        if (empRes.data.success) setEmployees(empRes.data.employees);
      } catch (err) {
        console.error('Failed to fetch admin summary:', err);
      }
    };
    fetchData();
  }, []);

  if (!summary) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  // Pie chart data — Leave distribution
  const leaveData = [
    { name: 'Approved', value: summary.approvedLeaves, color: '#10b981' },
    { name: 'Pending', value: summary.pendingLeaves, color: '#f59e0b' },
    { name: 'Rejected', value: summary.rejectedLeaves, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Bar chart data — Department-wise employee count
  const deptMap = {};
  employees.forEach(emp => {
    const name = emp.department?.dep_name || 'Unassigned';
    deptMap[name] = (deptMap[name] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([name, count]) => ({ name, employees: count }));

  // Bar chart data — Department-wise salary
  const salaryMap = {};
  employees.forEach(emp => {
    const name = emp.department?.dep_name || 'Unassigned';
    salaryMap[name] = (salaryMap[name] || 0) + Number(emp.salary || 0);
  });
  const salaryData = Object.entries(salaryMap).map(([name, total]) => ({ name, salary: total }));

  return (
    <div className="p-6">
      {/* Dashboard Overview */}
      <h3 className="text-2xl font-bold">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard icon={<FaUsers />} text="Total Employees" number={summary.totalEmployees} color="bg-teal-600" />
        <SummaryCard icon={<FaBuilding />} text="Total Departments" number={summary.totalDepartments} color="bg-yellow-600" />
        <SummaryCard icon={<FaMoneyBillWave />} text="Monthly Salary" number={`₹${summary.totalSalary.toLocaleString()}`} color="bg-red-600" />
      </div>

      {/* Leave Details */}
      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold mb-6">Leave Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard icon={<FaFileAlt />} text="Leave Applied" number={summary.totalLeaves} color="bg-teal-600" />
          <SummaryCard icon={<FaCheckCircle />} text="Leave Approved" number={summary.approvedLeaves} color="bg-green-600" />
          <SummaryCard icon={<FaHourglassHalf />} text="Leave Pending" number={summary.pendingLeaves} color="bg-yellow-600" />
          <SummaryCard icon={<FaTimesCircle />} text="Leave Rejected" number={summary.rejectedLeaves} color="bg-red-600" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-12">
        <h4 className="text-2xl font-bold mb-6">Analytics</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart — Leave Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h5 className="font-semibold text-gray-700 mb-4">Leave Distribution</h5>
            {leaveData.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No leave data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={leaveData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {leaveData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart — Employees by Department */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h5 className="font-semibold text-gray-700 mb-4">Employees by Department</h5>
            {deptData.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No department data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="employees" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart — Salary by Department */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <h5 className="font-semibold text-gray-700 mb-4">Salary Distribution by Department</h5>
            {salaryData.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No salary data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000)}k`} />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="salary" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
