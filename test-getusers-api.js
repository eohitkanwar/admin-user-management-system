// Test getAllUsers API to check if caching is fixed
import fetch from 'node-fetch';

console.log('🔍 Testing getAllUsers API...');

const testGetUsers = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/users', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk5YzhhMmQ0M2QxZGFmYWFiODQ4ZmQxIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc3MjA0NDg5OSwiZXhwIjoxNzcyNjQ4MjkyfQ.8QJhA2YqXJnJ3mKqL7QpXfR9T2Y4W6Z8bKcV7D3mN9o',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        console.log('📊 Status:', response.status);
        console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));
        
        const data = await response.json();
        console.log('📊 Response:', JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log('✅ SUCCESS! Users fetched successfully');
            console.log('👥 User count:', data.count);
            console.log('📅 Timestamp:', data.timestamp);
            console.log('👤 Users:', data.users.map(u => ({ username: u.username, email: u.email, role: u.role })));
        } else {
            console.log('❌ Failed to fetch users:', data.message);
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
};

testGetUsers();
