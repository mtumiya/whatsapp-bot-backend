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
      response = await sendWhatsAppMessage(from, '📅 Book an Appointment\n\nPlease provide:\n• Your full name\n• Preferred date and time\n• Type of consultation needed\n\nOur staff will confirm your appointment shortly.');
    } else if (messageBody === '2') {
      response = await sendWhatsAppMessage(from, '🏥 Our Services:\n\n• General Consultation\n• Laboratory Tests\n• X-Ray & Imaging\n• Pharmacy Services\n• Emergency Care\n• Specialized Clinics\n\nFor specific departments, please call us.');
    } else if (messageBody === '3') {
      response = await sendWhatsAppMessage(from, '📞 Contact Information:\n\n☎️ Emergency: +260-XXX-XXXX\n📱 Reception: +260-XXX-XXXX\n📧 Email: info@clinic.com\n📍 Address: [Your Clinic Address]\n\n24/7 Emergency Services Available');
    } else if (messageBody === '4') {
      response = await sendWhatsAppMessage(from, '🕐 Working Hours:\n\n⏰ Regular Hours:\nMon-Fri: 8:00 AM - 6:00 PM\nSaturday: 8:00 AM - 2:00 PM\nSunday: Closed\n\n🚨 Emergency: 24/7');
    } else {
      response = await sendWhatsAppMessage(from, `You said: "${messageBody}"\n\nType "hi" to see our main menu.`);
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
