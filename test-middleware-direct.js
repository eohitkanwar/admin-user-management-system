import { userValidation } from './validators/userValidator.js';

console.log('🧪 Testing validation middleware directly...');

// Mock request, response, and next objects
const mockReq = {
    body: {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
    }
};

const mockRes = {
    status: (code) => ({
        json: (data) => {
            console.log(`📊 Status: ${code}`);
            console.log('📄 Response:', JSON.stringify(data, null, 2));
            return { status: code, json: data };
        }
    })
};

let nextCalled = false;
const mockNext = () => {
    nextCalled = true;
    console.log('✅ Next() was called - validation passed');
};

// Test the middleware
console.log('📤 Testing with invalid email...');
userValidation(mockReq, mockRes, mockNext);

if (!nextCalled) {
    console.log('❌ Validation failed as expected');
}

// Test with valid data
console.log('\n📤 Testing with valid email...');
const mockReqValid = {
    body: {
        username: 'testuser',
        email: 'valid@example.com',
        password: 'password123'
    }
};

nextCalled = false;
userValidation(mockReqValid, mockRes, mockNext);

if (nextCalled) {
    console.log('✅ Validation passed for valid email');
} else {
    console.log('❌ Validation failed for valid email - unexpected');
}
