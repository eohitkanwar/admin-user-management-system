import fetch from 'node-fetch';

console.log('🧪 Creating proper admin user and testing error handling...');

async function createProperAdminAndTest() {
    // Step 1: Create admin user with special email that gets admin role
    console.log('👤 Creating admin user with admin@yopmail.com...');
    const adminUser = {
        username: 'superadmin',
        email: 'admin@yopmail.com', // This email gets admin role
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
        console.log('👤 Role:', registerResponse.user?.role || 'checking...');
    } else if (registerResponse.status === 400) {
        console.log('ℹ️ Admin user already exists, trying to login...');
    } else {
        console.log('❌ Admin user creation failed');
        return;
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
        console.log('📊 Response:', await loginResponse.text());
        return;
    }

    const loginData = await loginResponse.json();
    const authToken = loginData.token;
    console.log('✅ Admin login successful');
    console.log('👤 Admin Role:', loginData.user.role);

    if (loginData.user.role !== 'admin') {
        console.log('❌ User is not admin, cannot test admin functionality');
        return;
    }

    // Step 3: Test error cases
    console.log('\n📋 Testing error cases with proper admin token...');

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

createProperAdminAndTest();
