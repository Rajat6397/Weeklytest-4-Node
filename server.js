// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to serve the form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to handle form submission and send email
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Transporter setup for sending email
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use any email service (Gmail, Yahoo, etc.)
        auth: {
            user: process.env.EMAIL, // Your email
            pass: process.env.PASSWORD // Your email password
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.RECEIVER_EMAIL, // Where to send the form details
        subject: `Message from ${name}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Failed to send email');
        }
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
