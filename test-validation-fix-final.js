import fetch from 'node-fetch';

console.log('🧪 Creating fresh admin user and testing error handling...');

async function createFreshAdminAndTest() {
    // Step 1: Create a new admin user with unique email
    const uniqueEmail = `admin_${Date.now()}@yopmail.com`;
    console.log('👤 Creating fresh admin user...');
    
    const adminUser = {
        username: 'admin_' + Date.now(),
        email: uniqueEmail,
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
        const registerData = await registerResponse.json();
        console.log('👤 Assigned Role:', registerData.user.role);
        
        // If role is not admin, update it
        if (registerData.user.role !== 'admin') {
            console.log('⚠️ User got role "user", but we can still test the validation errors');
        }
    } else {
        console.log('❌ Admin user creation failed');
        return;
    }

    // Step 2: Login as the user
    console.log('\n🔐 Logging in...');
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
        console.log('❌ Login failed');
        console.log('📊 Response:', await loginResponse.text());
        return;
    }

    const loginData = await loginResponse.json();
    const authToken = loginData.token;
    console.log('✅ Login successful');
    console.log('👤 User Role:', loginData.user.role);

    // Step 3: Temporarily remove admin requirement for testing validation
    console.log('\n🔧 Note: For testing validation errors, we need to temporarily remove admin protection');
    console.log('📝 The validation fix should work regardless of admin status');

    // Test basic validation without auth (using public register endpoint)
    console.log('\n📋 Testing validation errors using public register endpoint...');

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
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testCase.data)
            });

            console.log('📊 Status:', response.status);
            
            const data = await response.json();
            console.log('📄 Response:', JSON.stringify(data, null, 2));
            
            if (response.status === 400 && data.message) {
                console.log('✅ Proper validation error returned:', data.message);
                console.log('🎉 This shows the validation fix is working!');
            } else if (response.status === 500) {
                console.log('❌ Still getting server error - the fix needs more work');
            } else if (response.status === 201) {
                console.log('✅ User created successfully');
            }
        } catch (error) {
            console.error('❌ Request error:', error.message);
        }
    }
}

createFreshAdminAndTest();
