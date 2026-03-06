import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import API_URL from '../../utils/api';

const typeColors = {
    National: 'bg-red-50 border-red-200 text-red-700',
    Regional: 'bg-orange-50 border-orange-200 text-orange-700',
    Company: 'bg-teal-50 border-teal-200 text-teal-700',
};

const EmployeeHolidays = () => {
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/holiday`);
                if (res.data.success) setHolidays(res.data.holidays);
            } catch (err) { console.error(err); }
        };
        fetch();
    }, []);

    const today = new Date();
    const upcoming = holidays.filter(h => new Date(h.date) >= today);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2"><FaCalendarAlt className="text-teal-500" /> Holiday Calendar</h2>
                <p className="text-gray-400 text-sm mt-0.5">Upcoming company and public holidays</p>
            </div>

            {upcoming.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <FaCalendarAlt className="text-4xl mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No upcoming holidays</p>
                    <p className="text-sm">Enjoy your work days! 🚀</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {upcoming.map(h => {
                        const daysLeft = Math.ceil((new Date(h.date) - today) / (1000 * 60 * 60 * 24));
                        return (
                            <div key={h._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex justify-between items-center hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="bg-teal-50 border border-teal-100 rounded-xl px-3 py-2 text-center min-w-[56px]">
                                        <p className="text-lg font-bold text-teal-700 leading-none">{new Date(h.date).getDate()}</p>
                                        <p className="text-[10px] text-teal-600 uppercase font-semibold">{new Date(h.date).toLocaleString('default', { month: 'short' })}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{h.name}</p>
                                        <p className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${typeColors[h.type] || typeColors.Company}`}>{h.type}</span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {daysLeft === 0 ? '🎉 Today!' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days away`}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EmployeeHolidays;
