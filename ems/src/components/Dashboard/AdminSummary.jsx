import React, { useEffect, useState } from 'react';
import SummaryCard from './SummaryCard';
import { FaUsers, FaBuilding, FaMoneyBillWave, FaFileAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaBirthdayCake } from 'react-icons/fa';
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

  // Birthday Reminders
  const today = new Date();
  const toMD = (d) => {
    const dt = new Date(d);
    return `${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  };
  const todayMD = toMD(today);
  const birthdays = employees
    .filter(emp => emp.dob)
    .map(emp => {
      const dob = new Date(emp.dob);
      const thisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      const diff = Math.ceil((thisYear - today) / (1000 * 60 * 60 * 24));
      const daysLeft = diff < 0 ? diff + 365 : diff;
      return { emp, dob, daysLeft, isToday: toMD(emp.dob) === todayMD };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 8);

  return (
    <div className="p-6">
      {/* Dashboard Overview */}
      <h3 className="text-2xl font-bold">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard icon={<FaUsers />} text="Total Employees" number={summary.totalEmployees} color="bg-teal-600" />
        <SummaryCard icon={<FaBuilding />} text="Total Departments" number={summary.totalDepartments} color="bg-yellow-600" />
        <SummaryCard icon={<FaMoneyBillWave />} text="Monthly Salary" number={`₹${summary.totalSalary.toLocaleString()}`} color="bg-red-600" />
      </div>

      {/* Birthday Reminders Widget */}
      {birthdays.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <FaBirthdayCake className="text-pink-500" /> Birthday Reminders
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {birthdays.map(({ emp, dob, daysLeft, isToday }) => (
              <div key={emp._id} className={`rounded-2xl border p-3 flex items-center gap-3 ${isToday ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-100'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${isToday ? 'bg-pink-500' : 'bg-gradient-to-br from-purple-400 to-pink-500'}`}>
                  {emp.userId?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{emp.userId?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-400">
                    {isToday ? '🎉 Today!' : daysLeft === 1 ? 'Tomorrow' : `In ${daysLeft} days`}
                  </p>
                  <p className="text-[10px] text-gray-300">{new Date(dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <Pie data={leaveData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}>
                    {leaveData.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} />))}
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
