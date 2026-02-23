// Check all users in database
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔍 Checking all users in database...');

// Connect to database
mongoose.connect('mongodb://localhost:27017/admin-user-management');

// Get all users
const allUsers = await User.find({});
console.log('📊 All Users:', allUsers.length, 'users found');

allUsers.forEach((user, index) => {
    console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
});

mongoose.disconnect();
console.log('🎉 Database check complete!');
