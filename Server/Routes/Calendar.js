import express from 'express';
import * as calendarController from '../Controllers/Calendar.js';
import { authenticateJWT } from '../Middlewares/authenticateJWT.js'; 


const router = express.Router();

router.get('/my_calendar', authenticateJWT, calendarController.getEventsForUser);
router.post('/', authenticateJWT, calendarController.createEvent);
router.put('/:id', authenticateJWT, calendarController.updateEvent);
router.delete('/:id', authenticateJWT, calendarController.deleteEvent);
router.patch('/:id/participation', authenticateJWT, calendarController.updateParticipation);
router.get('/:eventId/participants', authenticateJWT, calendarController.getParticipants);

export default router;