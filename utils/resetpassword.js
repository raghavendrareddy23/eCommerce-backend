const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

dotenv.config();

const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

// Create OAuth2 client with your credentials
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID, // Your client ID from Google Cloud Console
  process.env.CLIENT_SECRET,
  REDIRECT_URI,
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN // Your refresh token obtained from Google OAuth2 playground or by other means
});

// Generate OAuth2 access token
const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, accessToken) => {
      if (err) {
        reject(err);
      } else {
        resolve(accessToken);
      }
    });
  });
};

// Function to send password reset email
const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const accessToken = await getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Dear User,</p><p>Please click <a href="${resetLink}">here</a> to reset your password.</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Reset password email sent successfully');
  } catch (error) {
    console.error('Error sending reset password email:', error);
  }
};

const sendSuccessResetEmail = async (email) => {
    try {
      const accessToken = await getAccessToken();
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Reset Your Password',
        html: `<p>Dear User,</p><p>Your password has been successfully reset.</p>`
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Reset password email sent successfully');
    } catch (error) {
      console.error('Error sending reset password email:', error);
    }
  };

module.exports = {sendResetPasswordEmail, sendSuccessResetEmail};
