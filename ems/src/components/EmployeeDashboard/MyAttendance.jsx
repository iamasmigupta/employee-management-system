import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaList } from 'react-icons/fa';
import API_URL from '../../utils/api';

const MyAttendance = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [checkedIn, setCheckedIn] = useState(false);
    const [checkedOut, setCheckedOut] = useState(false);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [calYear, setCalYear] = useState(new Date().getFullYear());

    const fetchAttendance = async () => {
        if (!user?.email) return;
        try {
            const res = await axios.get(`${API_URL}/api/attendance/employee?email=${user.email}`);
            if (res.data.success) {
                setAttendance(res.data.attendance);
                const today = new Date().toDateString();
                const todayRecord = res.data.attendance.find(a => new Date(a.date).toDateString() === today);
                if (todayRecord) {
                    setCheckedIn(true);
                    if (todayRecord.checkOut) setCheckedOut(true);
                }
            }
        } catch (err) {
            console.error('Failed to fetch attendance:', err);
        }
    };

    useEffect(() => { fetchAttendance(); }, [user]);

    const handleCheckIn = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/attendance/check-in`, { email: user.email });
            if (res.data.success) {
                alert('Checked in successfully!');
                setCheckedIn(true);
                fetchAttendance();
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to check in.');
        }
    };

    const handleCheckOut = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/attendance/check-out`, { email: user.email });
            if (res.data.success) {
                alert('Checked out successfully!');
                setCheckedOut(true);
                fetchAttendance();
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to check out');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            Present: 'bg-green-100 text-green-700',
            Late: 'bg-yellow-100 text-yellow-700',
            Absent: 'bg-red-100 text-red-700',
            Leave: 'bg-blue-100 text-blue-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-500';
    };

    const present = attendance.filter(a => a.status === 'Present').length;
    const late = attendance.filter(a => a.status === 'Late').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;

    // Calendar logic
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
    const monthName = new Date(calYear, calMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

    const getAttendanceForDate = (day) => {
        const dateStr = new Date(calYear, calMonth, day).toDateString();
        return attendance.find(a => new Date(a.date).toDateString() === dateStr);
    };

    const calStatusColor = (status) => {
        if (status === 'Present') return 'bg-green-400';
        if (status === 'Late') return 'bg-yellow-400';
        if (status === 'Absent') return 'bg-red-400';
        return 'bg-gray-300';
    };

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
        else setCalMonth(calMonth - 1);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
        else setCalMonth(calMonth + 1);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Attendance</h2>

            {/* Check-In / Check-Out */}
            <div className="flex gap-4 mb-6">
                <button onClick={handleCheckIn} disabled={checkedIn}
                    className={`px-6 py-3 rounded-xl font-semibold text-white transition shadow-lg ${checkedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/25'}`}>
                    {checkedIn ? '✅ Checked In' : '🕐 Check In'}
                </button>
                <button onClick={handleCheckOut} disabled={!checkedIn || checkedOut}
                    className={`px-6 py-3 rounded-xl font-semibold text-white transition shadow-lg ${!checkedIn || checkedOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/25'}`}>
                    {checkedOut ? '✅ Checked Out' : '🕐 Check Out'}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{present}</p>
                    <p className="text-sm text-gray-500">Present</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                    <p className="text-3xl font-bold text-amber-600">{late}</p>
                    <p className="text-sm text-gray-500">Late</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                    <p className="text-3xl font-bold text-red-600">{absent}</p>
                    <p className="text-sm text-gray-500">Absent</p>
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setViewMode('calendar')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${viewMode === 'calendar' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <FaCalendarAlt /> Calendar
                </button>
                <button onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <FaList /> Table
                </button>
            </div>

            {/* Calendar View */}
            {viewMode === 'calendar' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition"><FaChevronLeft className="text-gray-500" /></button>
                        <h3 className="text-lg font-semibold text-gray-700">{monthName}</h3>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition"><FaChevronRight className="text-gray-500" /></button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for days before the 1st */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="p-2"></div>
                        ))}
                        {/* Actual days */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const record = getAttendanceForDate(day);
                            const isToday = new Date().toDateString() === new Date(calYear, calMonth, day).toDateString();
                            const isFuture = new Date(calYear, calMonth, day) > new Date();
                            const isSunday = new Date(calYear, calMonth, day).getDay() === 0;

                            return (
                                <div key={day}
                                    className={`relative p-2 rounded-xl text-center min-h-[60px] flex flex-col items-center justify-center transition
                                        ${isToday ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
                                        ${isFuture ? 'opacity-40' : ''}
                                        ${isSunday && !record ? 'bg-gray-50' : ''}
                                        ${record ? 'hover:scale-105 cursor-pointer' : ''}
                                    `}
                                    title={record ? `${record.status} — In: ${record.checkIn || '-'}, Out: ${record.checkOut || '-'}` : isSunday ? 'Sunday' : ''}
                                >
                                    <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>{day}</span>
                                    {record && (
                                        <div className={`w-2.5 h-2.5 rounded-full mt-1 ${calStatusColor(record.status)}`}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div><span className="text-xs text-gray-500">Present</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><span className="text-xs text-gray-500">Late</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><span className="text-xs text-gray-500">Absent</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded ring-2 ring-blue-400"></div><span className="text-xs text-gray-500">Today</span></div>
                    </div>
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Check In</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Check Out</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Working Hours</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-4 text-gray-500">No attendance records yet.</td></tr>
                                ) : (
                                    attendance.map((record) => (
                                        <tr key={record._id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{new Date(record.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">{record.checkIn || '-'}</td>
                                            <td className="px-4 py-3">{record.checkOut || '-'}</td>
                                            <td className="px-4 py-3">{record.workingHours || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(record.status)}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAttendance;
