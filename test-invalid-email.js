import fetch from 'node-fetch';

console.log('🧪 Testing invalid email format specifically...');

try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'testuser3',
            email: 'invalid-email',
            password: 'password123'
        })
    });

    console.log('📊 Status:', response.status);
    
    const data = await response.json();
    console.log('📄 Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 400 && data.message) {
        console.log('✅ Proper validation error returned:', data.message);
        console.log('🎉 The validation fix is working!');
    } else if (response.status === 500) {
        console.log('❌ Still getting server error - check server logs for debugging output');
    } else if (response.status === 201) {
        console.log('✅ User created successfully');
    }
} catch (error) {
    console.error('❌ Request error:', error.message);
}
