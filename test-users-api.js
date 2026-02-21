// Test script to login admin and test users API
import fetch from 'node-fetch';

const adminLogin = {
    email: "admin@yopmail.com",
    password: "admin123"
};

// First login to get token
fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(adminLogin)
})
.then(response => response.json())
.then(data => {
    console.log('Login successful:', data);
    
    if (data.success && data.token) {
        // Now test users API with the token
        return fetch('http://localhost:5000/api/auth/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            }
        });
    }
})
.then(response => response.json())
.then(data => console.log('Users API response:', data))
.catch(error => console.error('Error:', error));
