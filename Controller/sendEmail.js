const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: "2525",
  secure: false,
  auth: {
    user: "0106a82f2ec478",
    pass: "8ea966ec20abcf",
  },
});

async function mail(email, userName, message) {
  await transporter.sendMail({
    from: email,
    to: "mohamedosfekry@gmail.com",
    subject: "Mosha OSama",
    text: message,
    html: `
      <div>
            <p>Hello ${userName}</p>
            <p>${message}</p>
      </div>
    `,
  });
}

module.exports = { mail };
