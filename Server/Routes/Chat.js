import express from 'express';
import * as chatController from '../Controllers/Chat.js'; 
import { authenticateJWT } from '../Middlewares/authenticateJWT.js'; 

const router = express.Router();
router.use(authenticateJWT);

router.get('/history/:sessionId',chatController.getChatHistory);
router.get('/pending', chatController.getPendingMessages);
router.post('/start', chatController.startChatSession);
router.post('/send', chatController.sendMessageToSession);

export default router;
