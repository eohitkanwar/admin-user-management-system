// Create admin user with correct email for admin role
import fetch from 'node-fetch';

console.log('👤 Creating admin user with correct email...');

// Create admin user with email that gets admin role
const createResponse = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'admin',
        email: 'admin@yopmail.com',
        password: 'admin123'
    })
});

const createData = await createResponse.json();
console.log('👤 Create Response:', createData);

if (createData.success) {
    console.log('✅ Admin user created with role:', createData.user.role);
    console.log('📧 Email:', createData.user.email);
    console.log('👤 Username:', createData.user.username);
    
    // Test login with new admin user
    console.log('\n🔑 Testing login with new admin user...');
    
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
    console.log('🔑 Login Response:', loginData);
    
    if (loginData.success && loginData.token) {
        console.log('✅ Login successful! Testing users API...');
        
        // Test users API
        const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            }
        });
        
        const usersData = await usersResponse.json();
        console.log('📊 Users API Response:', usersData);
        
        if (usersData.success) {
            console.log('🎉 SUCCESS! Admin user can access users API');
        } else {
            console.log('❌ Users API failed:', usersData.message);
        }
    }
} else {
    console.log('❌ Failed to create admin user:', createData.message);
}
