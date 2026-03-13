import fetch from 'node-fetch';

console.log('🧪 Testing user creation with improved error handling...');

// First login as admin to get token
async function loginAsAdmin() {
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'testadmin@yopmail.com',
            password: 'admin123'
        })
    });

    if (loginResponse.status === 200) {
        const loginData = await loginResponse.json();
        return loginData.token;
    } else {
        console.log('❌ Admin login failed');
        return null;
    }
}

async function testUserCreation() {
    const authToken = await loginAsAdmin();
    
    if (!authToken) {
        console.log('❌ Cannot test without admin token');
        return;
    }

    console.log('✅ Admin login successful, testing user creation...');

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
        },
        {
            name: 'Valid user',
            data: { username: 'testuser4', email: 'test4@example.com', password: 'password123' }
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
            console.log('📊 Status Text:', response.statusText);
            
            const data = await response.json();
            console.log('📄 Response:', JSON.stringify(data, null, 2));
            
            if (response.status === 400 && data.message) {
                console.log('✅ Proper validation error returned:', data.message);
            } else if (response.status === 500) {
                console.log('❌ Still getting server error');
            } else if (response.status === 201) {
                console.log('✅ User created successfully');
            }
        } catch (error) {
            console.error('❌ Request error:', error.message);
        }
    }
}

testUserCreation();
