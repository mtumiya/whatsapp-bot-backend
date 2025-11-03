require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'WhatsApp Bot Server is running!' });
});

// Webhook verification (required by Meta)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('Webhook verified!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook to receive messages
app.post('/webhook', (req, res) => {
  console.log('Incoming webhook:', JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    console.log('Received message:', message);
  }

  res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test it: http://localhost:${PORT}`);
});
