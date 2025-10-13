const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    await user.save();
    res.status(201).json({ 
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    user.name = name || user.name;
    user.role = role || user.role;
    
    // Only update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    
    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};