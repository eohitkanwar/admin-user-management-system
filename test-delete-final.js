// Test delete with correct user ID and check logs
import fetch from 'node-fetch';

console.log('🔑 Testing admin login for delete test...');

// First login as admin
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
console.log('📊 Login Response:', loginData);

if (loginData.success) {
    console.log('✅ Admin login successful');
    
    // Test deleting the first user (jack)
    const userIdToDelete = '699752c267bba918b1b05ae0'; // jack user
    
    console.log(`🗑️ Testing delete of user ID: ${userIdToDelete}`);
    
    const deleteResponse = await fetch(`http://localhost:5000/api/auth/users/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${loginData.token}`
        }
    });
    
    const deleteData = await deleteResponse.json();
    console.log('📊 Delete Response:', deleteData);
    console.log('📊 Status Code:', deleteResponse.status);
    
    if (deleteResponse.status === 200 && deleteData.success) {
        console.log('🎉 SUCCESS! User deleted successfully');
        console.log('✅ Delete functionality works perfectly');
    } else if (deleteResponse.status === 404) {
        console.log('❌ User not found - checking if ID is correct');
        console.log('Expected user ID:', userIdToDelete);
        console.log('This might be a database connection issue');
    } else {
        console.log('❌ Delete failed:', deleteData.message);
    }
} else {
    console.log('❌ Admin login failed:', loginData.message);
}
