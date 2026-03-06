import Holiday from '../models/Holiday.js';

export const getHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.find().sort({ date: 1 });
        return res.json({ success: true, holidays });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const addHoliday = async (req, res) => {
    try {
        const { name, date, type } = req.body;
        const holiday = new Holiday({ name, date: new Date(date), type: type || 'Company' });
        await holiday.save();
        return res.json({ success: true, holiday });
    } catch (error) {
        console.error('Add holiday error:', error.message);
        return res.status(500).json({ success: false, error: error.message || 'Server error' });
    }
};

export const deleteHoliday = async (req, res) => {
    try {
        await Holiday.findByIdAndDelete(req.params.id);
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};
