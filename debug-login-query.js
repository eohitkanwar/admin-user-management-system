// Debug login query
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔍 Debugging login query...');

// Connect to database
mongoose.connect('mongodb://localhost:27017/admin-user-management');

// Test the exact same query as login controller
const email = 'admin@yopmail.com';
console.log('🔍 Searching for email:', email);

const user = await User.findOne({ email: email });

if (user) {
    console.log('✅ User found:');
    console.log('   ID:', user._id);
    console.log('   Username:', user.username);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Status:', user.status);
    console.log('   Raw object:', JSON.stringify(user, null, 2));
} else {
    console.log('❌ User not found');
}

mongoose.disconnect();
console.log('🎉 Login query debug complete!');
