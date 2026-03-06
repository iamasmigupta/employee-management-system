import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import API_URL from '../../utils/api';

const typeColors = {
    National: 'bg-red-100 text-red-700 border-red-200',
    Regional: 'bg-orange-100 text-orange-700 border-orange-200',
    Company: 'bg-teal-100 text-teal-700 border-teal-200',
};

const HolidayCalendar = () => {
    const [holidays, setHolidays] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', date: '', type: 'Company' });

    const fetchHolidays = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/holiday`);
            if (res.data.success) setHolidays(res.data.holidays);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchHolidays(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/holiday`, form);
            setForm({ name: '', date: '', type: 'Company' });
            setShowForm(false);
            fetchHolidays();
        } catch (err) { alert('Failed to add holiday'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this holiday?')) return;
        try {
            await axios.delete(`${API_URL}/api/holiday/${id}`);
            fetchHolidays();
        } catch (err) { alert('Failed to delete'); }
    };

    const today = new Date();
    const upcoming = holidays.filter(h => new Date(h.date) >= today);
    const past = holidays.filter(h => new Date(h.date) < today);

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><FaCalendarAlt className="text-teal-500" /> Holiday Calendar</h2>
                    <p className="text-gray-400 text-sm mt-0.5">Manage company holidays and public holidays</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/25 transition font-medium text-sm">
                    <FaPlus /> Add Holiday
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Add Holiday</h3>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name *</label>
                            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Diwali" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                            <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50">
                                <option>National</option>
                                <option>Regional</option>
                                <option>Company</option>
                            </select>
                        </div>
                        <div className="col-span-3 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500">Cancel</button>
                            <button type="submit" className="px-6 py-2 text-sm bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-medium">Add Holiday</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Upcoming */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-3">Upcoming Holidays ({upcoming.length})</h3>
                {upcoming.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">No upcoming holidays. Add one!</p>
                ) : (
                    <div className="space-y-3">
                        {upcoming.map(h => (
                            <div key={h._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex justify-between items-center hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="bg-teal-50 border border-teal-100 rounded-xl px-3 py-2 text-center min-w-[56px]">
                                        <p className="text-lg font-bold text-teal-700 leading-none">{new Date(h.date).getDate()}</p>
                                        <p className="text-[10px] text-teal-600 uppercase font-semibold">{new Date(h.date).toLocaleString('default', { month: 'short' })}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{h.name}</p>
                                        <p className="text-xs text-gray-400">{formatDate(h.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${typeColors[h.type] || typeColors.Company}`}>{h.type}</span>
                                    <button onClick={() => handleDelete(h._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"><FaTrash className="text-sm" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past */}
            {past.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-400 mb-3 text-sm">Past Holidays</h3>
                    <div className="space-y-2">
                        {past.map(h => (
                            <div key={h._id} className="bg-gray-50 rounded-xl border border-gray-100 p-3 flex justify-between items-center opacity-60">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 rounded-lg px-2 py-1 text-center min-w-[44px]">
                                        <p className="text-sm font-bold text-gray-500 leading-none">{new Date(h.date).getDate()}</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-semibold">{new Date(h.date).toLocaleString('default', { month: 'short' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{h.name}</p>
                                        <p className="text-xs text-gray-400">{new Date(h.date).getFullYear()}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(h._id)} className="p-1.5 text-red-300 hover:text-red-500 rounded-lg transition"><FaTrash className="text-xs" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HolidayCalendar;
