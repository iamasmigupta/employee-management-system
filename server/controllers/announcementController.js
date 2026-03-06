import Announcement from '../models/Announcement.js';
import { createNotification } from './notificationController.js';

// Get all announcements (non-expired first)
export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
        return res.json({ success: true, announcements });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Create announcement (admin only)
export const createAnnouncement = async (req, res) => {
    try {
        const { title, content, priority, expiresAt } = req.body;
        const announcement = new Announcement({
            title, content, priority,
            expiresAt: expiresAt && expiresAt !== '' ? new Date(expiresAt) : null,
            createdBy: req.body.userId || null,
        });
        await announcement.save();

        // Notify all employees about new announcement
        await createNotification({
            role: 'employee',
            title: '📢 New Announcement',
            message: title,
            type: 'info',
        });

        return res.json({ success: true, announcement });
    } catch (error) {
        console.error('Create announcement error:', error.message);
        return res.status(500).json({ success: false, error: error.message || 'Server error' });
    }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};
