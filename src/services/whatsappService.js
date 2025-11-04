const axios = require('axios');

const META_API_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.META_PHONE_NUMBER_ID}/messages`;

async function sendWhatsAppMessage(to, messageText) {
  try {
    const response = await axios.post(
      META_API_URL,
      {
        messaging_product: 'whatsapp',
        to: to,
        text: { body: messageText }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
}

async function sendMenuMessage(to) {
  const menuText = `🏥 Welcome to Our Clinic!

How can we assist you today?

1️⃣ Book an Appointment
2️⃣ View Our Medical Services
3️⃣ Contact Information
4️⃣ Working Hours

Reply with a number (1-4)`;

  return sendWhatsAppMessage(to, menuText);
}

module.exports = {
  sendWhatsAppMessage,
  sendMenuMessage
};
