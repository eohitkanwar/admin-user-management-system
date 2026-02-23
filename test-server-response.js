// Test to see if server is receiving requests
import fetch from 'node-fetch';

console.log('🧪 Testing if server receives GET /api/auth/users...');

// Test with proper headers
const testWithHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk5OWZkODMyMjVhMTk5ZTcyM2M3MGY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc3MTcwMDM0MCwiZXhwIjoxNzcyMzA1MTQwfQ.xfyw5kLE4Nbc0AzKLwa3uJmG71PHcaUNa_6BjGDEnRo'
};

fetch('http://localhost:5000/api/auth/users', {
    method: 'GET',
    headers: testWithHeaders
})
.then(response => {
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', response.headers);
    return response.json();
})
.then(data => {
    console.log('📊 Response Data:', data);
    console.log('✅ SUCCESS: Server is responding correctly!');
})
.catch(error => {
    console.error('❌ ERROR:', error);
    console.log('🔍 Possible issues:');
    console.log('  1. Server not running');
    console.log('  2. Wrong URL');
    console.log('  3. CORS issues');
    console.log('  4. Network problems');
});
