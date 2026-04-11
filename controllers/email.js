import SibApiV3Sdk from 'sib-api-v3-sdk';

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({ email, subject, html }) => {
  try {
    const sender = {
      email: process.env.EMAIL_USERNAME,
      name: "Admin Panel"
    };

    const receivers = [{ email }];
    console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY);

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject,
      htmlContent: html,
    });

    console.log("✅ Email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Email error:", error);
    return { success: false };
  }
};

export default sendEmail;
