require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { handleIncomingMessage } = require('./controllers/messageController');

// Debug: Log environment variables on startup
console.log('=== Environment Variables Check ===');
console.log('PORT:', process.env.PORT);
console.log('VERIFY_TOKEN:', process.env.VERIFY_TOKEN ? 'SET' : 'NOT SET');
console.log('META_ACCESS_TOKEN:', process.env.META_ACCESS_TOKEN ? `SET (${process.env.META_ACCESS_TOKEN.substring(0, 10)}...)` : 'NOT SET');
console.log('META_PHONE_NUMBER_ID:', process.env.META_PHONE_NUMBER_ID ? 'SET' : 'NOT SET');
console.log('DEFAULT_CLIENT_ID:', process.env.DEFAULT_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('WHATSAPP_API_VERSION:', process.env.WHATSAPP_API_VERSION);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('===================================');

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
app.post('/webhook', async (req, res) => {
  console.log('Incoming webhook:', JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const message = value?.messages?.[0];

  if (message) {
    try {
      await handleIncomingMessage(message);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  // Always respond quickly to Meta
  res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test it: http://localhost:${PORT}`);
});
