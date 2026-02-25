// Test user creation with MongoDB Atlas and email
import fetch from 'node-fetch';

console.log('👤 Testing user creation with MongoDB Atlas...');

const createResponse = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'testuser123',
        email: 'testuser123@example.com',
        password: 'test123'
    })
});

const createData = await createResponse.json();
console.log('📊 Create Response:', createData);

if (createData.success) {
    console.log('✅ SUCCESS! User created');
    console.log('📊 User Details:');
    console.log('   Username:', createData.user.username);
    console.log('   Email:', createData.user.email);
    console.log('   Role:', createData.user.role);
    console.log('   Email Sent:', createData.emailSent);
    
    // Test login
    console.log('\n🔑 Testing login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'testuser123@example.com',
            password: 'test123'
        })
    });
    
    const loginData = await loginResponse.json();
    console.log('📊 Login Response:', loginData);
    
    if (loginData.success) {
        console.log('✅ SUCCESS! Login working');
        console.log('🎉 Both user creation and login are working with MongoDB Atlas');
    } else {
        console.log('❌ Login failed:', loginData.message);
    }
} else {
    console.log('❌ User creation failed:', createData.message);
}
