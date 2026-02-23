// Test fresh login and then test users API
import fetch from 'node-fetch';

console.log('🧪 Testing fresh login...');

// First login to get fresh token
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
console.log('📊 Login Response:', loginData);

if (loginData.success && loginData.token) {
    console.log('✅ Login successful, got new token');
    
    // Now test users API with fresh token
    const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
        }
    });
    
    const usersData = await usersResponse.json();
    console.log('📊 Users API Response:', usersData);
    console.log('📊 Users API Status:', usersResponse.status);
    
    if (usersData.success) {
        console.log('✅ Users API working correctly');
    } else {
        console.log('❌ Users API failed:', usersData.message);
    }
} else {
    console.log('❌ Login failed:', loginData.message);
}
