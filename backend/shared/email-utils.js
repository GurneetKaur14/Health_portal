const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

async function sendEmail(to, subject, message) {
  if (!to) {
    throw new Error("Recipient email (to) is required");
  }
  if (!subject) {
    throw new Error("Email subject is required");
  }
  if (!message) {
    throw new Error("Email body is required");
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to,
      subject,
      text: message,
    });
    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending email: ", err);
    throw err;
  }
}

module.exports = sendEmail;