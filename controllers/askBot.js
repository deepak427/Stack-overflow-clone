import { Configuration, OpenAIApi } from "openai";
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

export const askBot = async (req, res) => {
  const { question } = req.body;

  try {
    const answer = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 256,
    });

    const botChat = answer.data.choices[0].text;

    res.status(200).json(botChat);
  } catch (error) {
    res.status(408).json({ message: error.message });
  }
};

export const verify = async (req, res) => {
  const { email } = req.body;
  try {

    const otp = Math.floor(1000 + Math.random() * 9000);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    });

    const a =  await transporter.sendMail({
      to: email,
      subject: 'Verify Account',
      html: `
      <h3>Welcome to Stackoverflow.<h3/>
      <p>Your OTP is : ${otp}<p/>
      <p>Expiry: 1 hour<p/>
      `
    })

    console.log(a)

    const token = jwt.sign({ email, otp }, process.env.JWT_SECRECT, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });    

  } catch (error) {
    res.status(408).json({ message: error.message });
  }
};
