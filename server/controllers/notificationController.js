import Notification from "../models/Notification.js";
import User from "../models/User.js";

// Get notifications for a user — properly filtered by role
const getNotifications = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });
        if (!user) return res.status(200).json({ success: true, notifications: [] });

        // Build query based on user role
        let query;
        if (user.role === 'admin') {
            // Admin sees: notifications targeted to 'admin' role or to them specifically
            query = { $or: [{ role: 'admin' }, { userId: user._id }] };
        } else {
            // Employee sees: notifications targeted to them specifically OR to all employees by role
            query = { $or: [{ userId: user._id }, { role: 'employee' }] };
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        // Add per-user read status
        const result = notifications.map(n => ({
            ...n,
            read: n.readBy?.some(id => id.toString() === user._id.toString()) || false,
        }));

        return res.status(200).json({ success: true, notifications: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: "get notifications error" });
    }
};

// Mark notification as read (per-user)
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        await Notification.findByIdAndUpdate(id, {
            $addToSet: { readBy: user._id }
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: "mark read error" });
    }
};

// Mark all as read for a user
const markAllAsRead = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        // Build same query as getNotifications
        let query;
        if (user.role === 'admin') {
            query = { role: 'admin' };
        } else {
            query = { userId: user._id };
        }

        await Notification.updateMany(
            { ...query, readBy: { $ne: user._id } },
            { $addToSet: { readBy: user._id } }
        );
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: "mark all read error" });
    }
};

// Create notification (internal helper)
const createNotification = async ({ userId, role, title, message, type }) => {
    try {
        const notification = new Notification({ userId, role, title, message, type, readBy: [] });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Create notification error:', error);
    }
};

export { getNotifications, markAsRead, markAllAsRead, createNotification };
