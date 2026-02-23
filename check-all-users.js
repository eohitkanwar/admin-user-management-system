// Check what users actually exist
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔍 Checking what users actually exist...');

// Connect to database
mongoose.connect('mongodb://localhost:27017/admin-user-management');

// Get ALL users
const allUsers = await User.find({});
console.log('📊 Total users in database:', allUsers.length);

allUsers.forEach((user, index) => {
    console.log(`${index + 1}. ID: ${user._id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.status}`);
    console.log('---');
});

// Specifically check for the problematic ID
const problematicUser = await User.findById('699c8f896b94bcc09dec4dd2');
if (problematicUser) {
    console.log('❌ PROBLEMATIC USER STILL EXISTS:');
    console.log('   ID:', problematicUser._id);
    console.log('   Username:', problematicUser.username);
    console.log('   Email:', problematicUser.email);
    console.log('   Role:', problematicUser.role);
} else {
    console.log('✅ Problematic user does not exist');
}

mongoose.disconnect();
console.log('🎉 User check complete!');
