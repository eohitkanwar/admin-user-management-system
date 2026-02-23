// Simple admin login test
import fetch from 'node-fetch';

console.log('🧪 Simple admin login test...');

const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'admin@yopmail.com',
        password: 'admin123'
    })
});

const loginData = await loginResponse.json();
console.log('📊 Login Response:', JSON.stringify(loginData, null, 2));

if (loginData.success && loginData.user.role === 'admin') {
    console.log('✅ SUCCESS! Admin user has correct role');
    
    // Test users API
    const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${loginData.token}`
        }
    });
    
    const usersData = await usersResponse.json();
    console.log('📊 Users API Response:', JSON.stringify(usersData, null, 2));
    
    if (usersData.success) {
        console.log('🎉 COMPLETE! Admin can access users API');
    } else {
        console.log('❌ Users API failed:', usersData.message);
    }
} else {
    console.log('❌ FAILED! Admin role issue detected');
    console.log('Expected role: admin, Got role:', loginData.user?.role);
}
