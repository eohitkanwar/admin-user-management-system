// Test getUserById API after validation removal
import fetch from 'node-fetch';

console.log('🔍 Testing getUserById API...');

const testGetUserById = async () => {
    try {
        // Login first
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
        console.log('🔑 Login:', loginData.success ? 'SUCCESS' : 'FAILED');

        if (loginData.success) {
            // Test getUserById with a valid ID
            const testId = '699c8a2d43d1dafaab848fd1'; // Known admin ID
            console.log(`🔍 Testing getUserById with ID: ${testId}`);

            const userResponse = await fetch(`http://localhost:5000/api/auth/users/${testId}`, {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📊 Status:', userResponse.status);
            console.log('📊 Content-Type:', userResponse.headers.get('content-type'));

            const userData = await userResponse.json();
            console.log('📊 Response:', JSON.stringify(userData, null, 2));

            if (userData.success) {
                console.log('✅ SUCCESS! getUserById working');
                console.log('👤 User:', userData.user.username, userData.user.email);
            } else {
                console.log('❌ Failed:', userData.message);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

testGetUserById();
