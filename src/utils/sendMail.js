import nodemailer from 'nodemailer';
import { welcomeTemplate } from '../../templates/welcomeTemplate.js';
import { forgetTemplate } from '../../templates/forgetPasswordTemp.js';

export const welcomeMail = async (userMail, userName, otp) => {
  console.log(userMail, otp, userName);
  console.log(process.env.SMTP_USERNAME, process.env.SMTP_PASSWORD);
  // Create a transport configuration
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use the email service you prefer (e.g., 'Gmail', 'Outlook')
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  let subject = `Welcome ${userMail} to my World!`;
  let text = `Please use below given OTP to Verify Your Account`;
  let welcomeTemp = welcomeTemplate(userName, otp);
  // Define the email message
  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: userMail, // Receiver's email address
    subject: subject,
    text: text,
    html: welcomeTemp,
  };
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export const forgetPassMail = async (userMail, otp, userName) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  let subject = `Welcome ${userMail} to my World!`;
  let text = `Please use below given OTP to Verify Your Account`;
  let forgetPassTemp = forgetTemplate(userName, otp);

  // const resetLink = `https://your-app-url/reset-password/${resetToken}`;
  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: userMail,
    subject: subject,
    text: text,
    html: forgetPassTemp,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error('Email could not be sent:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
