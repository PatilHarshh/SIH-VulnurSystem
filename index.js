require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Function to fetch the article content from the URL
const fetchArticleContent = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const paragraphs = $('p');
    let articleText = '';
    paragraphs.each((i, element) => {
      articleText += $(element).text() + ' ';
    });
    return articleText.trim();
  } catch (error) {
    console.error('Error fetching article content:', error);
    throw error;
  }
};

// Function to summarize text using Google Generative AI API
const summarizeText = async (text) => {
  const prompt = `
    Your task is to summarize the key details as follows:
    Provide a two-line brief describing the vulnerability, including its nature and impact.
    Additionally, include a short paragraph outlining the solution or mitigation strategy provided to address the vulnerability.
    Ensure that both the brief and the solution are clear and effectively communicate the essential information.
  `;

  try {
    const result = await model.generateContent(`${prompt}\n\n${text}`);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
};

// Endpoint to summarize an article given a URL
app.post('/summarize', async (req, res) => {
  const { url } = req.body;
  if (!url) {
      return res.status(400).json({ error: 'Please provide a valid article link.' });
  }

  try {
      const articleText = await fetchArticleContent(url);
      const summary = await summarizeText(articleText);
      res.json({ summary });
  } catch (error) {
      console.error('Error summarizing text:', error);
      res.status(500).json({ error: 'Error summarizing text.' });
  }
});

// Endpoint to send an email
app.post('/send-email', async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'harshpatil2956@gmail.com',
    subject: 'ALert !!! Vulnerability Detected ⚠️',
    text: `
    Product Name: Microsoft Edge
    Product Version: 90.0.4430.212
    OEM Name: Microsoft
    Severity Level: Critical
    Vulnerability: Memory corruption in V8 engine.
    Mitigation Strategy: Update to version 90.0.4430.212.
    Published Date: Jun 2024
    Unique ID: CVE-2024-34567
    `
};

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
