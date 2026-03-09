import fetch from 'node-fetch';

console.log('🔍 Checking existing admin user role...');

try {
  // Login with admin credentials
  const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@yopmail.com',
      password: 'admin123'
    })
  });

  const loginData = await loginResponse.json();
  console.log('📊 Login Status:', loginResponse.status);
  
  if (loginResponse.status === 200 && loginData.success) {
    console.log('✅ Login successful!');
    console.log('👤 User Role:', loginData.user.role);
    console.log('👤 User Info:', JSON.stringify(loginData.user, null, 2));
  } else {
    console.log('❌ Login failed:', loginData.message);
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}
