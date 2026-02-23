// Check admin user in database
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔍 Checking admin user in database...');

// Connect to database
mongoose.connect('mongodb://localhost:27017/admin-user-management');

// Find admin user
const adminUser = await User.findOne({ email: 'admin@yopmail.com' });

if (adminUser) {
    console.log('✅ Admin user found:', {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
        status: adminUser.status,
        _id: adminUser._id
    });
    
    // Update role to admin if needed
    if (adminUser.role !== 'admin') {
        console.log('🔧 Updating role to admin...');
        const updateResult = await User.updateOne(
            { _id: adminUser._id },
            { role: 'admin' }
        );
        console.log('📊 Update Result:', updateResult);
        
        // Check again
        const updatedUser = await User.findOne({ email: 'admin@yopmail.com' });
        console.log('✅ Updated Admin user:', {
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status
        });
    }
} else {
    console.log('❌ Admin user not found');
}

mongoose.disconnect();
console.log('🎉 Admin user check complete!');
