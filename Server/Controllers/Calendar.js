
import * as calendarService from '../Services/Calendar.js';
import { sendNotificationToUser } from '../socketHandlers/NotificationSocketController.js'; // וד
import { createNotification } from '../Services/Notification.js'; // ודא שהנתיב נכון
import { getAllBereavedUsers } from '../Services/Users.js';

export async function getEventsForUser(req, res) {
    try {
        const userId = req.user.id;
        const events = await calendarService.getEventsForUser(userId);
        res.json(events);
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function createEvent(req, res) {
    try {
        const user = req.user;
        const eventData = req.body;
        if (user.role === 'supporter') {
            eventData.created_by_supporter_id = user.id;

            if (!eventData.user_id) {
                eventData.apply_to_all = true;
            } else
                eventData.apply_to_all = false;
        } else if (user.role === 'bereaved') {
            eventData.user_id = user.id;
            eventData.created_by_supporter_id = null;
        }
        validateEventData(eventData, user);
        const eventId = await calendarService.createEvent(eventData);

        const io = req.app.get('io');
        const message = `נוסף עבורך אירוע חדש: "${eventData.title}"`;

        if (user.role === 'supporter' && eventData.apply_to_all) {
            const bereavedUsers = await getAllBereavedUsers();
            for (const bereaved of bereavedUsers) {
                await createNotification({
                    user_id: bereaved.id,
                    type: 'event_reminder',
                    message,
                    target_url: `/calendar?eventId=${eventId}`
                });
                sendNotificationToUser(io, bereaved.id, {
                    type: 'event_reminder',
                    message,
                    target_url: `/calendar?eventId=${eventId}`
                });
            }
        }
        res.status(201).json({ id: eventId });

    } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({ error: error.message });
    }
}

export async function updateEvent(req, res) {
    try {
        const user = req.user;
        const eventId = req.params.id;
        const eventData = req.body;
        const existingEvent = await calendarService.getEventById(eventId);
        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (existingEvent.locked) {
            return res.status(403).json({ error: 'You are not authorized to update an event created by a supporter' });
        }
        if (existingEvent.calendar_type === 'supporter' && user.role === 'bereaved') {
            return res.status(403).json({ error: 'You are not authorized to update an event created by a supporter' });
        }

        if (existingEvent.calendar_type === 'supporter') {
            if (existingEvent.created_by_supporter_id !== user.id) {
                return res.status(403).json({ error: 'Unauthorized to update this event' });
            }
        } else if (existingEvent.calendar_type !== 'bereaved') {
            return res.status(400).json({ error: 'Invalid calendar_type' });
        }
        await calendarService.updateEvent(eventId, eventData);
        res.json({ message: 'Event updated successfully' });

    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).json({ error: error.message });
    }
}

export async function deleteEvent(req, res) {
    try {
        const user = req.user;
        const eventId = req.params.id;

        const existingEvent = await calendarService.getEventById(eventId);

        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (existingEvent.locked) {
            return res.status(403).json({ error: 'This event is locked and cannot be deleted' });
        }

        if (existingEvent.calendar_type === 'supporter' && user.role === 'bereaved') {
            return res.status(403).json({ error: 'You are not authorized to delete an event created by a supporter' });
        }

        if (existingEvent.calendar_type === 'bereaved') {
            if (existingEvent.user_id !== user.id ) {
                return res.status(403).json({ error: 'Unauthorized to delete this event' });
            }
        } else if (existingEvent.calendar_type === 'supporter') {
            if (existingEvent.created_by_supporter_id !== user.id ) {
                return res.status(403).json({ error: 'Unauthorized to delete this event' });
            }
        } else {
            return res.status(400).json({ error: 'Invalid calendar_type' });
        }
        await calendarService.deleteEvent(eventId);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(400).json({ error: error.message });
    }
}

export async function updateParticipation(req, res) {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'confirmed' && status !== 'declined') {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const event = await calendarService.getEventById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.calendar_type !== 'supporter' || user.role !== 'bereaved') {
        return res.status(403).json({ error: 'Only a bereaved user can confirm participation in a supporter event' });
    }

    const alreadyParticipated = await calendarService.hasUserParticipated(event.id, user.id);
    if (alreadyParticipated) {
        return res.status(400).json({ error: 'You have already responded to this event' });
    }

    await calendarService.addParticipant(event.id, user.id);

    const io = req.app.get('io');
    if (!io) {
        return res.status(500).json({ error: 'Socket server not initialized' });
    }

    if (status === 'confirmed' && event.created_by_supporter_id) {
        const existingNotification = await calendarService.isEventParticipationNotification(event.id, event.created_by_supporter_id);
        if (!existingNotification) {
            const message = 'יש לך משתתפים שאישרו הגעה לאירוע שלך ביומן';
            await createNotification({
                user_id: event.created_by_supporter_id,
                type: 'event_participation',
                message,
                target_url: '/calendar'
            });

            sendNotificationToUser(io, event.created_by_supporter_id, {
                type: 'event_participation',
                message,
                target_url: '/calendar'
            });
        }
    }
    res.json({ message: 'ההשתתפות נשמרה' });

}

export async function getParticipants(req, res) {
    try {
        const { eventId } = req.params;
        const participants = await getEventParticipants(eventId);
        res.json(participants);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'error get participants' });
    }
}

function validateEventData(eventData, user) {
    if (!eventData.title || !eventData.start_date || !eventData.end_date) {
        throw new Error('Missing required fields: title, start_date, end_date');
    }

    if (user.role === 'supporter') {
        if (eventData.calendar_type !== 'supporter') {
            throw new Error('Supporter can only create supporter events');
        }
        if (eventData.apply_to_all !== true) {
            throw new Error('Supporter events must have apply_to_all=true');
        }
        if (eventData.user_id) {
            throw new Error('Supporter cannot assign events to specific bereaved user');
        }
    } else if (user.role === 'bereaved') {
        if (eventData.calendar_type !== 'bereaved') {
            throw new Error('Bereaved user can only create bereaved events');
        }
        if (eventData.user_id !== user.id) {
            throw new Error('Bereaved user_id must match authenticated user');
        }
    } else {
        throw new Error('Unauthorized role');
    }
}
