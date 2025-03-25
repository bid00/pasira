import { createTransport } from 'nodemailer';
import { USER, APP_PASSWORD } from '../config.js';
import { text } from 'express';

// Configure Nodemailer transporter
const transporter = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: USER,
        pass: APP_PASSWORD
    }
});

const autoReply = async (email) =>{
    const mailOptions={
        from:{
            name:'PASIRA AUTO REPLY',
            address:USER
        },
        to: email,
        subject: "AUTO REPLY",
        text:"HELLO , we have recived your email and we will contact you soon"

    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Auto-reply sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
    };
};
    


// Controller function to handle email subscription
export const subscribeUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const mailOptions = {
        from: {
            name: 'PASIRA Mail List',
            address: USER
        },
        to: email, // Send email to user
        subject: 'Welcome to PASIRA!',
        text: `Hello, you have been successfully added to PASIRA mail list.`,
        html: `<p><b>Welcome!</b> You have been successfully subscribed to the PASIRA mailing list.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Auto-reply sent to ${email}`);
        res.status(200).json({ message: `Subscription email sent to ${email}` });
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        res.status(500).json({ error: "Failed to send email" });
    }
};

export const contactForm = async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const mailOptions = {
        from: email,
        to: USER,
        subject: `Contact Form: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Message sent successfully!" });
        await autoReply(email);
    } catch (error) {
        console.error("Email sending failed:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};

export const callBack = async (req, res) => {
    const { name, email, phone,subject, message } = req.body;

    if (!name || !email || !subject || !message ||!phone) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const mailOptions = {
        from: email,
        to: USER,
        subject: `CallBack Requested: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Email:</strong> ${phone}</p>
               <p><strong>Message:</strong> ${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Message sent successfully!" });
        await autoReply(email);
    } catch (error) {
        console.error("Email sending failed:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};

