// Direct database update to fix admin role
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔧 Fixing admin role directly in database...');

// Connect to database
mongoose.connect('mongodb://localhost:27017/admin-user-management');

// Update admin user role
const updateResult = await User.updateOne(
    { email: 'admin@yopmail.com' },
    { role: 'admin' }
);

console.log('📊 Update Result:', updateResult);

// Verify the update
const adminUser = await User.findOne({ email: 'admin@yopmail.com' });
console.log('✅ Updated User:', {
    username: adminUser.username,
    email: adminUser.email,
    role: adminUser.role
});

mongoose.disconnect();
console.log('🎉 Admin role fixed!');
