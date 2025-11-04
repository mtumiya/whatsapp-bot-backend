const { sendWhatsAppMessage, sendMenuMessage } = require('../services/whatsappService');
const { saveMessage, getOrCreateConversation } = require('../services/databaseService');

async function handleIncomingMessage(message) {
  const from = message.from;
  const messageBody = message.text.body.toLowerCase().trim();
  const whatsappMessageId = message.id;

  console.log(`Message from ${from}: ${messageBody}`);

  try {
    // Get or create conversation
    const clientId = process.env.DEFAULT_CLIENT_ID;
    const conversation = await getOrCreateConversation(clientId, from);

    // Save incoming message
    await saveMessage(conversation.id, 'customer', messageBody, whatsappMessageId);

    // Process message and send response
    let response;

    if (messageBody === 'hi' || messageBody === 'hello' || messageBody === 'hey') {
      response = await sendMenuMessage(from);
    } else if (messageBody === '1') {
      response = await sendWhatsAppMessage(from, '📅 Great! To book an appointment, please tell me your preferred date and time.');
    } else if (messageBody === '2') {
      response = await sendWhatsAppMessage(from, '💇 Our services:\n- Haircut: $30\n- Coloring: $50\n- Styling: $40');
    } else if (messageBody === '3') {
      response = await sendWhatsAppMessage(from, '📞 Contact us:\nPhone: +1234567890\nEmail: info@business.com');
    } else if (messageBody === '4') {
      response = await sendWhatsAppMessage(from, '🕐 Business Hours:\nMon-Fri: 9AM - 6PM\nSat: 10AM - 4PM\nSun: Closed');
    } else {
      response = await sendWhatsAppMessage(from, `You said: "${messageBody}"\n\nType "hi" to see the menu.`);
    }

    // Save bot response
    if (response && response.messages) {
      const botMessageId = response.messages[0].id;
      const botMessageText = 'Bot response sent';
      await saveMessage(conversation.id, 'bot', botMessageText, botMessageId);
    }

  } catch (error) {
    console.error('Error handling message:', error);
  }
}

module.exports = {
  handleIncomingMessage
};
