// Test script to create admin user
import fetch from 'node-fetch';

const adminUser = {
    username: "admin",
    email: "admin@yopmail.com",
    password: "admin123"
};

fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(adminUser)
})
.then(response => response.json())
.then(data => console.log('Admin user created:', data))
.catch(error => console.error('Error creating admin user:', error));
