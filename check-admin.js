// Check Admin User Script
// Run this to verify admin user exists in database

const mongoose = require('mongoose');
require('dotenv').config();

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

async function checkAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const admin = await Admin.findOne({ username: 'admin' });
    
    if (admin) {
      console.log('✅ Admin user found!');
      console.log('Username:', admin.username);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Created:', admin.createdAt);
      console.log('Password hash exists:', !!admin.password);
    } else {
      console.log('❌ Admin user not found!');
      console.log('Run: npm run setup-admin');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

checkAdmin();
