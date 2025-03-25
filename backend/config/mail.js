import { createTransport } from 'nodemailer';
import { USER, APP_PASSWORD } from '../config.js';

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
