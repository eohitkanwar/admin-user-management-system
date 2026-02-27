// Test frontend accessibility
import fetch from 'node-fetch';

console.log('🌐 Testing frontend accessibility...');

try {
    // Test main page
    const response = await fetch('http://localhost:5000/', {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache'
        }
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Content-Type:', response.headers.get('content-type'));
    console.log('📊 Content-Length:', response.headers.get('content-length'));
    
    if (response.status === 200) {
        console.log('✅ Frontend is accessible');
        console.log('📄 Page loaded successfully');
    } else {
        console.log('❌ Frontend not accessible');
        console.log('📊 Status:', response.status);
    }
} catch (error) {
    console.error('❌ Error accessing frontend:', error.message);
}

// Test API endpoint
try {
    const apiResponse = await fetch('http://localhost:5000/api/auth/users', {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    
    console.log('📊 API Status:', apiResponse.status);
    
    if (apiResponse.status === 401) {
        console.log('✅ API is working (requires authentication)');
    } else if (apiResponse.status === 200) {
        console.log('✅ API is working and accessible');
    } else {
        console.log('⚠️ API returned status:', apiResponse.status);
    }
} catch (error) {
    console.error('❌ Error accessing API:', error.message);
}
