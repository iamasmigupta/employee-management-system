import User from '../models/User.js';

// Sync Clerk user data to MongoDB after signup
export const syncUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Missing email' });
    }

    let user = await User.findOne({ email });

    if (user) {
      // User exists — DON'T overwrite role
      console.log(`User ${email} already exists with role: ${user.role}`);
    } else {
      // New user — create in MongoDB with the chosen role
      user = new User({
        name: name || 'User',
        email,
        password: 'clerk-managed',
        role: role || 'admin',
      });
      await user.save();
      console.log(`New user created: ${email} with role: ${user.role}`);
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Sync user error:', error);
    return res.status(500).json({ success: false, error: 'Failed to sync user' });
  }
};

// Get user role from MongoDB (read-only)
export const getUserRole = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Missing email' });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ success: true, role: user.role });
    } else {
      return res.status(200).json({ success: true, role: null });
    }
  } catch (error) {
    console.error('Get role error:', error);
    return res.status(500).json({ success: false, error: 'Failed to get role' });
  }
};
