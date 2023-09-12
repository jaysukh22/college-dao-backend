import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config()
import ejs from 'ejs'

export const sendMail = async (templateName,email) => {
  
  try {

    const templatePath = path.join(__dirname, 'email-templates', `${templateName}.ejs`);
    const template = await ejs.renderFile(templatePath, email);

    // Create a Nodemailer transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vaibhav.specscale@gmail.com',
        pass: 'btwtfowownkmtdvt'
      }
    });

    // Define the email options
    let mailOptions = {
      from: 'vaibhav.specscale@gmail.com',
      to: `${data.email}`,
      subject:templateName === 'password_Reset_Template' ? ' Password Change Confirmation: Action Required for Your Account' :templateName === 'registration_Confirm_Email_Template' ? 'Your carSPICE account – Please complete your registration': templateName === 'verify_Email_Template' ? 'Your carSPICE account – Registration successful' :templateName === 'pw_Successfully_Changed_Template' ? 'Your carSPICE account – Password changed' :'',
      html: template
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }

};