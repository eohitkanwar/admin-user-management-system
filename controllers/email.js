import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (options) => {
  try {
    // Create reusable transporter object using the SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or your email service (e.g., 'Outlook', 'Yahoo', etc.)
      auth: {
        user: "kanwar.rohit2905@gmail.com", // Your email
        pass: "rohit@2006" // Your email password or app password (for development only)
      },
    });

    console.log("transporter", transporter);

    // Send mail with defined transport object
    const mailOptions = {
      from: `"Your App Name" <kanwar.rohit2905@gmail.com>`, // Use your email directly
      to: options.email,       
      subject: options.subject,
      text: options.message,
      html: options.html,
    };
    
    console.log("Mail options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Email sent successfully to:', options.email);
    return info;
  } catch (error) {
    console.error('Email sending failed (non-blocking):', error.message);
    console.log('⚠️ Email failed but continuing with user creation...');
    // Don't throw error, just log it and continue
    return { success: false, message: 'Email failed but user creation continued' };
  }
};

export default sendEmail;
