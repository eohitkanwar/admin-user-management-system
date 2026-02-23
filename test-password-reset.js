// Test password reset functionality
import fetch from 'node-fetch';

console.log('🧪 Testing password reset functionality...');

// First, let's test the reset password endpoint with a dummy token
const testToken = 'test123';

fetch(`http://localhost:5000/api/auth/reset-password/${testToken}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        password: 'newpassword123'
    })
})
.then(response => response.json())
.then(data => {
    console.log('📊 Password Reset Response:', data);
    if (data.success) {
        console.log('✅ Password reset endpoint working');
    } else {
        console.log('❌ Password reset failed:', data.message);
    }
})
.catch(error => {
    console.error('❌ Error testing password reset:', error);
});
