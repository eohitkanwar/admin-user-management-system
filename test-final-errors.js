import fetch from 'node-fetch';

console.log('🧪 Testing error handling with existing admin user...');

async function testWithExistingAdmin() {
    // Login as existing admin
    console.log('🔐 Logging in as existing admin (kanwar1234@yopmail.com)...');
    
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'kanwar1234@yopmail.com',
            password: 'password123'
        })
    });

    if (loginResponse.status !== 200) {
        console.log('❌ Admin login failed');
        console.log('📊 Response:', await loginResponse.text());
        return;
    }

    const loginData = await loginResponse.json();
    const authToken = loginData.token;
    console.log('✅ Admin login successful');
    console.log('👤 Admin Role:', loginData.user.role);

    if (loginData.user.role !== 'admin') {
        console.log('❌ User is not admin');
        return;
    }

    // Test error cases
    console.log('\n📋 Testing error cases that should show proper validation errors...');

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
            name: 'Short username',
            data: { username: 'ab', email: 'test@example.com', password: 'password123' }
        },
        {
            name: 'Short password',
            data: { username: 'testuser4', email: 'test4@example.com', password: '123' }
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
                console.log('🎉 This should now show as a proper error message instead of "Server error during registration"');
            } else if (response.status === 500) {
                console.log('❌ Still getting server error - the fix needs more work');
            } else if (response.status === 201) {
                console.log('✅ User created successfully');
            }
        } catch (error) {
            console.error('❌ Request error:', error.message);
        }
    }

    // Test one successful case
    console.log('\n📋 Testing successful user creation...');
    const validUser = {
        username: 'validuser_' + Date.now(),
        email: 'valid_' + Date.now() + '@example.com',
        password: 'password123'
    };

    try {
        const response = await fetch('http://localhost:5000/api/auth/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(validUser)
        });

        console.log('📊 Status:', response.status);
        
        if (response.status === 201) {
            console.log('✅ Valid user created successfully!');
            console.log('🎉 The fix is working properly!');
        } else {
            const data = await response.json();
            console.log('❌ Unexpected error:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('❌ Request error:', error.message);
    }
}

testWithExistingAdmin();
