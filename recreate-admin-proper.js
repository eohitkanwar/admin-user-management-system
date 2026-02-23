// Delete and recreate admin user properly
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🗑️ Deleting and recreating admin user...');

// Connect to database
mongoose.connect('mongodb://localhost:27017/admin-user-management');

// Delete existing admin user
const deleteResult = await User.deleteOne({ email: 'admin@yopmail.com' });
console.log('🗑️ Delete Result:', deleteResult);

// Create new admin user with proper role
const newAdmin = new User({
    username: 'admin',
    email: 'admin@yopmail.com',
    password: 'admin123',
    role: 'admin'
});

try {
    const savedAdmin = await newAdmin.save();
    console.log('✅ Admin user created:', {
        username: savedAdmin.username,
        email: savedAdmin.email,
        role: savedAdmin.role,
        status: savedAdmin.status
    });
} catch (error) {
    console.error('❌ Error creating admin user:', error);
}

mongoose.disconnect();
console.log('🎉 Admin user recreation complete!');
