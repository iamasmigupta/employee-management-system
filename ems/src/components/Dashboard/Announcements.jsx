import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBullhorn, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import API_URL from '../../utils/api';

const priorityConfig = {
    high: { label: 'High', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
    low: { label: 'Low', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
};

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', priority: 'medium', expiresAt: '' });

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/announcement`);
            if (res.data.success) setAnnouncements(res.data.announcements);
        } catch (err) {
            console.error('Failed to fetch announcements:', err);
        }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/announcement`, form);
            setForm({ title: '', content: '', priority: 'medium', expiresAt: '' });
            setShowForm(false);
            fetchAnnouncements();
        } catch (err) {
            alert('Failed to create announcement');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        try {
            await axios.delete(`${API_URL}/api/announcement/${id}`);
            fetchAnnouncements();
        } catch (err) {
            alert('Failed to delete announcement');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaBullhorn className="text-teal-500" /> Announcements
                    </h2>
                    <p className="text-gray-400 text-sm mt-0.5">Post company-wide announcements for all employees</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/25 transition font-medium"
                >
                    <FaPlus className="text-sm" /> New Announcement
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Create Announcement</h3>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input
                                type="text" required
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Office closed on Friday"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                            <textarea
                                required rows={4}
                                value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                                placeholder="Write your announcement here..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={form.priority}
                                    onChange={e => setForm({ ...form, priority: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expires On (optional)</label>
                                <input
                                    type="date"
                                    value={form.expiresAt}
                                    onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button type="button" onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading}
                                className="px-6 py-2 text-sm bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition font-medium disabled:opacity-50">
                                {loading ? 'Posting...' : 'Post Announcement'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <FaBullhorn className="text-4xl mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No announcements yet</p>
                        <p className="text-sm">Click "New Announcement" to post one</p>
                    </div>
                ) : (
                    announcements.map(ann => {
                        const p = priorityConfig[ann.priority] || priorityConfig.medium;
                        const isExpired = ann.expiresAt && new Date(ann.expiresAt) < new Date();
                        return (
                            <div key={ann._id} className={`bg-white rounded-2xl border shadow-sm p-5 transition hover:shadow-md ${isExpired ? 'opacity-50' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h3 className="font-semibold text-gray-800">{ann.title}</h3>
                                            <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${p.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>
                                                {p.label}
                                            </span>
                                            {isExpired && (
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 border">Expired</span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{ann.content}</p>
                                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                                            <span>Posted {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            {ann.expiresAt && (
                                                <span>Expires {new Date(ann.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(ann._id)}
                                        className="ml-4 p-2 text-red-400 hover:bg-red-50 rounded-lg transition flex-shrink-0" title="Delete">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Announcements;
