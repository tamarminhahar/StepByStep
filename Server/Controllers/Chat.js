import { updateOnlineStatus, getOrCreateSession, saveMessageToDB, savePendingMessageIfNeeded ,isUserInChat, getMessagesBySession,fetchPendingMessages } from '../Services/Chat.js';


export async function getChatHistory(req, res) {
  const { sessionId } = req.params;
  const currentUserId = req.user.id;
  try {
    const isAuthorized = await isUserInChat(sessionId, currentUserId);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Access denied to this chat' });
    }
    const messages = await getMessagesBySession(sessionId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load chat history' });
  }
}

export async function getPendingMessages(req, res) {
  try {
    const messages = await fetchPendingMessages(req.user.id);
    res.json(messages);
  } catch (err) {
    console.error(' Failed to fetch pending messages:', err);
    res.status(500).json({ error: 'Failed to load pending messages' });
  }
}

export async function startChatSession(req, res) {
  const { otherUserId } = req.body;

  if (parseInt(otherUserId) === req.user.id) {
    return res.status(400).json({ error: "Can't start chat with yourself" });
  }

  try {
    const sessionId = await getOrCreateSession(req.user.id, otherUserId);
    res.json({ sessionId });
  } catch (err) {
    console.error('startChatSession error:', err.message);
    res.status(500).json({ error: 'Failed to start chat' });
  }
}

export async function sendMessageToSession(req, res) {
  const { sessionId, message } = req.body;

  try {
    await saveMessageToDB(sessionId, req.user.id, message);
    await savePendingMessageIfNeeded({ userId: req.user.id }, sessionId, message); // socket mock
    res.json({ success: true });
  } catch (err) {
    console.error(' sendMessageToSession error:', err.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
