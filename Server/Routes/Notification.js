import express from 'express';
import * as notificationController from '../Controllers/Notification.js';
import { authenticateJWT } from '../Middlewares/authenticateJWT.js';

const router = express.Router();

router.get('/', authenticateJWT, notificationController.getNotificationsForUser);
router.patch('/:id/mark-read', authenticateJWT, notificationController.markNotificationAsRead);
router.patch('/mark-all-read', authenticateJWT, notificationController.markAllNotificationsAsRead);


export default router;
