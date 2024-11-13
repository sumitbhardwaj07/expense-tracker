import nodemailer from 'nodemailer';


export const sendEmail = async (options) => {


  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com', 
    port: process.env.EMAIL_PORT || 587,  
    auth: {
      user: process.env.EMAIL_USER || 'sb732000@gmail.com',
      pass: process.env.EMAIL_PASS  
    },
    secure: false, 
  });



  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email ,
    subject: options.subject || 'Test Email',
    text: options.message || 'This is a test email from Nodemailer',
  };


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};