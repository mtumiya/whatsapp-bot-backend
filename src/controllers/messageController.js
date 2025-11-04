const { sendWhatsAppMessage, sendMenuMessage } = require('../services/whatsappService');

async function handleIncomingMessage(message) {
  const from = message.from;
  const messageBody = message.text.body.toLowerCase().trim();

  console.log(`Message from ${from}: ${messageBody}`);

  // Simple response logic
  if (messageBody === 'hi' || messageBody === 'hello' || messageBody === 'hey') {
    return sendMenuMessage(from);
  }

  if (messageBody === '1') {
    return sendWhatsAppMessage(from, '📅 Great! To book an appointment, please tell me your preferred date and time.');
  }

  if (messageBody === '2') {
    return sendWhatsAppMessage(from, '💇 Our services:\n- Haircut: $30\n- Coloring: $50\n- Styling: $40');
  }

  if (messageBody === '3') {
    return sendWhatsAppMessage(from, '📞 Contact us:\nPhone: +1234567890\nEmail: info@business.com');
  }

  if (messageBody === '4') {
    return sendWhatsAppMessage(from, '🕐 Business Hours:\nMon-Fri: 9AM - 6PM\nSat: 10AM - 4PM\nSun: Closed');
  }

  // Default response
  return sendWhatsAppMessage(from, `You said: "${messageBody}"\n\nType "hi" to see the menu.`);
}

module.exports = {
  handleIncomingMessage
};
