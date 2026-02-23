// Check for admin user with case-insensitive search
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔍 Searching for admin user...');

// Connect to database
mongoose.connect('mongodb://localhost:27017/admin-user-management');

// Search for admin user with different variations
const adminUsers = await User.find({
    $or: [
        { email: 'admin@yopmail.com' },
        { email: 'Admin@yopmail.com' },
        { email: 'ADMIN@YOPMAIL.COM' }
    ]
});

console.log('📊 Admin Users Found:', adminUsers.length);

if (adminUsers.length > 0) {
    adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
    });
} else {
    console.log('❌ No admin user found');
    
    // Let's create one directly
    console.log('👤 Creating admin user directly...');
    
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
            role: savedAdmin.role
        });
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
}

mongoose.disconnect();
console.log('🎉 Admin user check complete!');
