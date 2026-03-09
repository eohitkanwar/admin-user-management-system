import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔍 Checking existing users...');

try {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Dbdata');
  console.log('✅ Connected to MongoDB');

  // Find all users
  const users = await User.find({}).select('-password');
  console.log('📊 Found users:', users.length);

  users.forEach((user, index) => {
    console.log(`👤 User ${index + 1}:`);
    console.log(`   ID: ${user._id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log('');
  });

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
