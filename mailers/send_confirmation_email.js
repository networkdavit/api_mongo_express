const nodemailer = require('nodemailer');
require('dotenv').config()

const EMAIL_SENDER = process.env.EMAIL_SENDER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

function send_email(receiver_email, link){
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_SENDER,
      pass: EMAIL_PASSWORD
    }
    });
  
    const mailOptions = {
    from: EMAIL_SENDER,
    to: receiver_email,
    subject: 'Confirmation email',
    text: `Thank you for registering on our website, please confirm your email via the link ${link} `
    };
  
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    }); 
  }

module.exports = {
    send_email
}