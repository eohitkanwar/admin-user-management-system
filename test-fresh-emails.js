import fetch from 'node-fetch';

console.log('🧪 Testing with fresh unique emails...');

const testCases = [
    {
        name: 'Invalid email format',
        data: { username: 'testuser1', email: 'invalid-email-' + Date.now(), password: 'password123' }
    },
    {
        name: 'No @ symbol',
        data: { username: 'testuser2', email: 'testuser' + Date.now() + '.com', password: 'password123' }
    },
    {
        name: 'Valid email (should work)',
        data: { username: 'testuser3', email: 'valid' + Date.now() + '@example.com', password: 'password123' }
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
            if (data.message.includes('valid email')) {
                console.log('🎉 Email validation is working!');
            }
        } else if (response.status === 500) {
            console.log('❌ Server error');
        } else if (response.status === 201) {
            console.log('✅ User created successfully');
        }
    } catch (error) {
        console.error('❌ Request error:', error.message);
    }
}
