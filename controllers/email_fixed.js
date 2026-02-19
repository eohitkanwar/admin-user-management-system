import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (options) => {
  // Create reusable transporter object using the SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email service (e.g., 'Outlook', 'Yahoo', etc.)
    auth: {
      user: "kanwar.rohit2905@gmail.com", // Your email
      pass: process.env.EMAIL_PASSWORD // Your email password or app password
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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Email sent successfully to:', options.email);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', error.message);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;
