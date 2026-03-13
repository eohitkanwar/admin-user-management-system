import fetch from 'node-fetch';

console.log('🧪 Testing validation errors directly...');

async function testValidationErrors() {
    console.log('📋 Testing validation errors without authentication...');

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
            name: 'All fields missing',
            data: {}
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
                console.log('🎉 The validation fix is working!');
            } else if (response.status === 500) {
                console.log('❌ Still getting server error - checking logs...');
            } else if (response.status === 201) {
                console.log('✅ User created successfully');
            }
        } catch (error) {
            console.error('❌ Request error:', error.message);
        }
    }
}

testValidationErrors();
