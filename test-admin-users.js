// Test admin login and user management
import fetch from 'node-fetch';

console.log('🔑 Testing admin login...');

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

if (loginData.success && loginData.user.role === 'admin') {
    console.log('✅ Admin login successful!');
    
    // Test users API
    console.log('👥 Testing users API...');
    const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${loginData.token}`
        }
    });
    
    const usersData = await usersResponse.json();
    console.log('📊 Users API Response:', usersData);
    
    if (usersData.success) {
        console.log('🎉 SUCCESS! User management is working');
        console.log('📊 Total users:', usersData.count);
        console.log('✅ Frontend can now load users from backend');
    } else {
        console.log('❌ Users API failed:', usersData.message);
    }
} else {
    console.log('❌ Admin login failed');
    console.log('Expected role: admin, Got role:', loginData.user?.role);
}
