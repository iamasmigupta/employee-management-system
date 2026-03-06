import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBullhorn } from 'react-icons/fa';
import API_URL from '../../utils/api';

const priorityConfig = {
    high: { label: 'High', color: 'bg-red-50 border-red-200 text-red-700', dot: 'bg-red-500', bar: 'bg-red-400' },
    medium: { label: 'Medium', color: 'bg-yellow-50 border-yellow-200 text-yellow-700', dot: 'bg-yellow-500', bar: 'bg-yellow-400' },
    low: { label: 'Low', color: 'bg-green-50 border-green-200 text-green-700', dot: 'bg-green-500', bar: 'bg-green-400' },
};

const EmployeeAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/announcement`);
                if (res.data.success) {
                    // Filter out expired
                    const active = res.data.announcements.filter(
                        a => !a.expiresAt || new Date(a.expiresAt) >= new Date()
                    );
                    setAnnouncements(active);
                }
            } catch (err) {
                console.error('Failed to fetch announcements:', err);
            }
        };
        fetch();
    }, []);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaBullhorn className="text-teal-500" /> Announcements
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">Company-wide announcements from admin</p>
            </div>

            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <FaBullhorn className="text-4xl mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No announcements right now</p>
                        <p className="text-sm">Check back later for updates from your team</p>
                    </div>
                ) : (
                    announcements.map(ann => {
                        const p = priorityConfig[ann.priority] || priorityConfig.medium;
                        return (
                            <div key={ann._id} className={`bg-white rounded-2xl border ${p.color} shadow-sm p-5 relative overflow-hidden hover:shadow-md transition`}>
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.bar} rounded-l-2xl`}></div>
                                <div className="pl-2">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-semibold text-gray-800">{ann.title}</h3>
                                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${p.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>
                                            {p.label}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{ann.content}</p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Posted {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        {ann.expiresAt && ` · Expires ${new Date(ann.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default EmployeeAnnouncements;
