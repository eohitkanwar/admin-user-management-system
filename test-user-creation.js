// Test user creation with non-blocking email
import fetch from 'node-fetch';

console.log('👤 Testing user creation with fixed email...');

const createResponse = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'test123'
    })
});

const createData = await createResponse.json();
console.log('📊 Create Response:', createData);

if (createData.success) {
    console.log('✅ SUCCESS! User created without email blocking');
    console.log('📊 User Details:');
    console.log('   Username:', createData.user.username);
    console.log('   Email:', createData.user.email);
    console.log('   Role:', createData.user.role);
} else {
    console.log('❌ User creation failed:', createData.message);
}
