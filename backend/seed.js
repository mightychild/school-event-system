const bcrypt = require('bcryptjs');
const User = require('./models/User');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const seedAdmin = async () => {
  try {
    const adminUser = {
      name: "Admin",
      email: "admin@test.com",
      password: bcrypt.hashSync("admin123", 10),
      role: "admin"
    };

    await User.deleteMany({ email: adminUser.email }); // Prevent duplicates
    await User.create(adminUser);
    console.log('Admin user seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    // process.exit(1);
  }
};

seedAdmin();