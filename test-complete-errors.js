import fetch from 'node-fetch';

console.log('🧪 Creating admin user and testing error handling...');

async function createAdminAndTest() {
    // Step 1: Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = {
        username: 'testadmin',
        email: 'testadmin@yopmail.com',
        password: 'admin123'
    };

    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminUser)
    });

    if (registerResponse.status === 201) {
        console.log('✅ Admin user created successfully');
    } else {
        console.log('ℹ️ Admin user might already exist');
    }

    // Step 2: Login as admin
    console.log('\n🔐 Logging in as admin...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: adminUser.email,
            password: adminUser.password
        })
    });

    if (loginResponse.status !== 200) {
        console.log('❌ Admin login failed');
        return;
    }

    const loginData = await loginResponse.json();
    const authToken = loginData.token;
    console.log('✅ Admin login successful');

    // Step 3: Test error cases
    console.log('\n📋 Testing error cases...');

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

createAdminAndTest();
