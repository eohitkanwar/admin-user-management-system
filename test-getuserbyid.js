// Test getUserById API
import fetch from 'node-fetch';

console.log('🔍 Testing getUserById API...');

const testGetUserById = async () => {
    try {
        // First login to get token
        console.log('🔑 Getting admin token...');
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'kanwar2905@yopmail.com',
                password: 'rohit@2006'
            })
        });

        const loginData = await loginResponse.json();
        
        if (!loginData.success) {
            console.log('❌ Login failed:', loginData.message);
            return;
        }

        console.log('✅ Login successful');
        const token = loginData.token;

        // Get all users first to get a valid user ID
        console.log('👥 Getting all users...');
        const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        });

        const usersData = await usersResponse.json();
        
        if (!usersData.success) {
            console.log('❌ Failed to get users:', usersData.message);
            return;
        }

        console.log(`✅ Found ${usersData.count} users`);
        
        if (usersData.users.length === 0) {
            console.log('❌ No users found to test with');
            return;
        }

        // Test getting user by ID
        const testUserId = usersData.users[0].id;
        console.log(`🔍 Testing getUserById with user ID: ${testUserId}`);

        const userResponse = await fetch(`http://localhost:5000/api/auth/users/${testUserId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        });

        console.log('📊 Response Status:', userResponse.status);
        
        const userData = await userResponse.json();
        console.log('📊 Response:', JSON.stringify(userData, null, 2));

        if (userData.success) {
            console.log('✅ SUCCESS! getUserById API working');
            console.log('👤 User Details:');
            console.log(`   Username: ${userData.user.username}`);
            console.log(`   Email: ${userData.user.email}`);
            console.log(`   Role: ${userData.user.role}`);
            console.log(`   Status: ${userData.user.status}`);
            console.log(`   Created: ${userData.user.createdAt}`);
        } else {
            console.log('❌ getUserById failed:', userData.message);
        }

        // Test with invalid ID
        console.log('\n🔍 Testing with invalid ID...');
        const invalidResponse = await fetch('http://localhost:5000/api/auth/users/invalid123', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        });

        const invalidData = await invalidResponse.json();
        console.log('📊 Invalid ID Response:', {
            status: invalidResponse.status,
            success: invalidData.success,
            message: invalidData.message
        });

        // Test with non-existent ID
        console.log('\n🔍 Testing with non-existent ID...');
        const nonExistentResponse = await fetch('http://localhost:5000/api/auth/users/507f1f77bcf86cd799439011', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        });

        const nonExistentData = await nonExistentResponse.json();
        console.log('📊 Non-existent ID Response:', {
            status: nonExistentResponse.status,
            success: nonExistentData.success,
            message: nonExistentData.message
        });

    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
};

testGetUserById();
