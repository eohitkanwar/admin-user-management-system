// Delete existing admin user and recreate with correct role
import fetch from 'node-fetch';

console.log('🗑️ Deleting existing admin user...');

// First login with existing user to get token
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

if (loginData.success && loginData.token) {
    console.log('🔑 Got token, deleting user...');
    
    // Delete the user (this is just for testing)
    const deleteResponse = await fetch('http://localhost:5000/api/auth/users/699c8f896b94bcc09dec4dd2', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${loginData.token}`
        }
    });
    
    const deleteData = await deleteResponse.json();
    console.log('🗑️ Delete Response:', deleteData);
}

console.log('👤 Creating new admin user...');

// Now create new admin user
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
} else {
    console.log('❌ Failed to create admin user:', createData.message);
}
