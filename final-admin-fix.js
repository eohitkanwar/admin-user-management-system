// Find all users with admin email
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔍 Finding ALL users with admin email...');

// Connect to database
mongoose.connect('mongodb://localhost:27017/admin-user-management');

// Find ALL users with admin email (case insensitive)
const allUsers = await User.find({
    email: { $regex: new RegExp('^admin@yopmail.com$', 'i') }
});

console.log('📊 Found', allUsers.length, 'users with admin email:');

allUsers.forEach((user, index) => {
    console.log(`${index + 1}. ID: ${user._id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.status}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log('---');
});

// Delete all users with this email and recreate one admin user
if (allUsers.length > 0) {
    console.log('🗑️ Deleting all users with admin email...');
    
    for (const user of allUsers) {
        const deleteResult = await User.deleteOne({ _id: user._id });
        console.log('🗑️ Deleted:', user.email, 'ID:', user._id, 'result:', deleteResult.deletedCount);
    }
    
    // Create new admin user
    console.log('👤 Creating new admin user...');
    const newAdmin = new User({
        username: 'admin',
        email: 'admin@yopmail.com',
        password: 'admin123',
        role: 'admin'
    });
    
    try {
        const savedAdmin = await newAdmin.save();
        console.log('✅ New admin user created:', {
            username: savedAdmin.username,
            email: savedAdmin.email,
            role: savedAdmin.role,
            status: savedAdmin.status,
            _id: savedAdmin._id
        });
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
}

mongoose.disconnect();
console.log('🎉 Admin user cleanup complete!');
