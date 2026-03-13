import fetch from 'node-fetch';

console.log('🧪 Testing user creation with empty email...');

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
        name: 'Valid user',
        data: { username: 'testuser3', email: 'test3@example.com', password: 'password123' }
    }
];

async function runTests() {
    for (const testCase of testCases) {
        console.log(`\n📋 Testing: ${testCase.name}`);
        console.log('📤 Data:', testCase.data);
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testCase.data)
            });

            console.log('📊 Status:', response.status);
            console.log('📊 Status Text:', response.statusText);
            
            const data = await response.json();
            console.log('📄 Response:', JSON.stringify(data, null, 2));
            
            if (response.status === 500) {
                console.log('❌ Server error detected - this is the issue!');
            }
        } catch (error) {
            console.error('❌ Request error:', error.message);
        }
    }
}

runTests();
