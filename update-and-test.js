import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔧 Updating existing admin user to admin role...');

try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Dbdata');
    console.log('✅ Connected to MongoDB');

    // Update the admin user role
    const result = await User.updateOne(
        { email: 'admin@yopmail.com' }, 
        { role: 'admin' }
    );

    console.log('📊 Update Result:', result);

    if (result.modifiedCount > 0) {
        console.log('✅ Admin user role updated successfully!');
        
        // Verify the update
        const user = await User.findOne({ email: 'admin@yopmail.com' });
        console.log('👤 Updated User Role:', user.role);
        
        // Now test the login and error handling
        await testWithAdminUser();
    } else {
        console.log('ℹ️ No user was updated, checking existing user...');
        const user = await User.findOne({ email: 'admin@yopmail.com' });
        if (user) {
            console.log('👤 Existing User Role:', user.role);
            if (user.role === 'admin') {
                await testWithAdminUser();
            } else {
                console.log('❌ User role is not admin');
            }
        }
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}

async function testWithAdminUser() {
    const fetch = (await import('node-fetch')).default;
    
    console.log('\n🧪 Testing error handling with admin user...');

    // Login as admin
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'admin@yopmail.com',
            password: 'admin123'
        })
    });

    if (loginResponse.status !== 200) {
        console.log('❌ Admin login failed');
        return;
    }

    const loginData = await loginResponse.json();
    const authToken = loginData.token;
    console.log('✅ Admin login successful');
    console.log('👤 Admin Role:', loginData.user.role);

    // Test error cases
    const testCases = [
        {
            name: 'Empty email',
            data: { username: 'testuser', email: '', password: 'password123' }
        },
        {
            name: 'Missing email field',
            data: { username: 'testuser2', password: 'password123' }
        },
        {
            name: 'Invalid email format',
            data: { username: 'testuser3', email: 'invalid-email', password: 'password123' }
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n📋 Testing: ${testCase.name}`);
        console.log('📤 Data:', testCase.data);
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(testCase.data)
            });

            console.log('📊 Status:', response.status);
            
            const data = await response.json();
            console.log('📄 Response:', JSON.stringify(data, null, 2));
            
            if (response.status === 400 && data.message) {
                console.log('✅ Proper validation error returned:', data.message);
            } else if (response.status === 500) {
                console.log('❌ Still getting server error - need more investigation');
            } else if (response.status === 201) {
                console.log('✅ User created successfully');
            }
        } catch (error) {
            console.error('❌ Request error:', error.message);
        }
    }
}
