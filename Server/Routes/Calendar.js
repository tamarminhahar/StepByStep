import express from 'express';
import * as calendarController from '../Controllers/Calendar.js';
import { authenticateJWT } from '../Middlewares/authenticateJWT.js'; // Adjust the path as necessary


const router = express.Router();

router.get('/user/me', authenticateJWT, calendarController.getEventsForUser);
router.post('/', authenticateJWT, calendarController.createEvent);
router.put('/:id', authenticateJWT, calendarController.updateEvent);
router.delete('/:id', authenticateJWT, calendarController.deleteEvent);
router.patch('/:id/participation', authenticateJWT, calendarController.updateParticipation);

export default router;