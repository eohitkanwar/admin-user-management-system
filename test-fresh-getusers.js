// Test getAllUsers with fresh login
import fetch from 'node-fetch';

console.log('🔑 Getting fresh token...');

// First login to get a fresh token
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'kanwar2905@yopmail.com',
        password: 'rohit@2006'
    })
});

const loginData = await loginResponse.json();
console.log('📊 Login Response:', loginData.success ? 'SUCCESS' : 'FAILED');

if (loginData.success) {
    console.log('✅ Got fresh token');
    
    // Now test getAllUsers with fresh token
    const response = await fetch('http://localhost:5000/api/auth/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${loginData.token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Cache-Control:', response.headers.get('cache-control'));
    
    const data = await response.json();
    console.log('📊 Response Summary:');
    console.log('   Success:', data.success);
    console.log('   User Count:', data.count);
    console.log('   Timestamp:', data.timestamp);
    console.log('   Users:', data.users?.length || 0);
    
    if (data.success) {
        console.log('\n🎉 SUCCESS! Users API is working');
        console.log('👥 First 3 users:');
        data.users.slice(0, 3).forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.role}`);
        });
    } else {
        console.log('❌ Failed:', data.message);
    }
} else {
    console.log('❌ Login failed:', loginData.message);
}
