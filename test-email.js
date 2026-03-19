import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('📧 Testing Gmail Configuration...');
console.log('Email:', process.env.EMAIL_USERNAME);
console.log('Password Length:', process.env.EMAIL_PASSWORD?.length || 'Not set');

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Gmail Connection Failed:', error.message);
    if (error.message.includes('535-5.7.8')) {
      console.log('🔑 This is an authentication error - you need an App Password!');
      console.log('');
      console.log('📋 SOLUTION:');
      console.log('1. Enable 2-Step Verification on your Gmail account');
      console.log('2. Go to: https://myaccount.google.com/apppasswords');
      console.log('3. Generate App Password for "Admin Panel"');
      console.log('4. Use the 16-character App Password instead of your regular password');
    }
  } else {
    console.log('✅ Gmail Connection Successful');
  }
});
