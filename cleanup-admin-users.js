// Check all admin-related users
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔍 Checking all users with admin email...');

// Connect to database
mongoose.connect('mongodb://localhost:27017/admin-user-management');

// Find all users with admin email variations
const allAdminUsers = await User.find({
    $or: [
        { email: 'admin@yopmail.com' },
        { email: 'Admin@yopmail.com' },
        { email: 'ADMIN@YOPMAIL.COM' }
    ]
});

console.log('📊 Found', allAdminUsers.length, 'admin-related users:');

allAdminUsers.forEach((user, index) => {
    console.log(`${index + 1}. ID: ${user._id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.status}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log('---');
});

// If multiple users exist, delete all but the latest one
if (allAdminUsers.length > 1) {
    console.log('🗑️ Multiple admin users found, keeping only the latest...');
    
    // Sort by creation date
    allAdminUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Keep the first (latest) and delete others
    const latestUser = allAdminUsers[0];
    const usersToDelete = allAdminUsers.slice(1);
    
    console.log('✅ Keeping:', latestUser.email, 'created at', latestUser.createdAt);
    
    for (const userToDelete of usersToDelete) {
        const deleteResult = await User.deleteOne({ _id: userToDelete._id });
        console.log('🗑️ Deleted:', userToDelete.email, 'result:', deleteResult.deletedCount);
    }
}

mongoose.disconnect();
console.log('🎉 Admin user cleanup complete!');
