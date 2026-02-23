// Test all API endpoints to help debug frontend issue
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api/auth';

async function testEndpoint(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
        
        const data = await response.json();
        console.log(`\n=== ${method} ${endpoint} ===`);
        console.log('Status:', response.status);
        console.log('Response:', data);
        return { success: response.ok, data, status: response.status };
    } catch (error) {
        console.error(`\n=== ERROR ${method} ${endpoint} ===`);
        console.error('Error:', error);
        return { success: false, error };
    }
}

async function runTests() {
    console.log('🧪 Testing API Endpoints...\n');
    
    // 1. Test login
    console.log('1️⃣ Testing Login...');
    const loginResult = await testEndpoint('/login', 'POST', {
        email: 'admin@yopmail.com',
        password: 'admin123'
    });
    
    if (loginResult.success && loginResult.data.token) {
        const token = loginResult.data.token;
        console.log('✅ Login successful, got token');
        
        // 2. Test users endpoint with token
        console.log('\n2️⃣ Testing Users API...');
        const usersResult = await testEndpoint('/users', 'GET', null, token);
        
        // 3. Test user profile
        console.log('\n3️⃣ Testing Profile...');
        const profileResult = await testEndpoint('/me', 'GET', null, token);
        
        // 4. Test single user
        console.log('\n4️⃣ Testing Single User...');
        const singleUserResult = await testEndpoint('/users/6999fd83225a199e723c70f8', 'GET', null, token);
        
    } else {
        console.log('❌ Login failed, cannot test other endpoints');
    }
    
    console.log('\n🎯 Test Complete!');
}

runTests();
