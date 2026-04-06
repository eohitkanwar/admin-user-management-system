import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (options) => {
  try {
    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
      },
    });
    console.log(
      "📧 Email transporter created for:",
      process.env.EMAIL_USERNAME,
    );

    // Send mail with defined transport object
    const mailOptions = {
      from: `"Admin System" <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };
    transporter.verify((error, success) => {
      if (error) {
        console.log("SMTP ERROR FULL:", error);
      } else {
        console.log("SMTP READY");
      }
    });

    console.log("📧 Sending email to:", options.email);
    console.log("📧 Email subject:", options.subject);

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Message sent: %s", info.messageId);
    console.log("✅ Email sent successfully to:", options.email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    console.log("⚠️ Email failed but continuing with user creation...");
    // Don't throw error, just log it and continue
    return {
      success: false,
      message: "Email failed but user creation continued",
    };
  }
};

export default sendEmail;
