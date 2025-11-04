const supabase = require('../config/supabase');

async function saveMessage(conversationId, senderType, messageText, whatsappMessageId) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_type: senderType,
      message_text: messageText,
      whatsapp_message_id: whatsappMessageId
    })
    .select();

  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }

  return data[0];
}

async function getOrCreateConversation(clientId, customerPhone, customerName = null) {
  // Check if conversation exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('client_id', clientId)
    .eq('customer_phone', customerPhone)
    .eq('status', 'active')
    .single();

  if (existing) {
    // Update last message time
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', existing.id);

    return existing;
  }

  // Create new conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      client_id: clientId,
      customer_phone: customerPhone,
      customer_name: customerName
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }

  return data;
}

async function getConversationHistory(conversationId, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('sent_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  }

  return data.reverse(); // Return oldest first
}

module.exports = {
  saveMessage,
  getOrCreateConversation,
  getConversationHistory
};
