
import * as calendarService from '../Services/Calendar.js';
import { sendNotificationToUser } from '../socketHandlers/NotificationSocketController.js'; // וד
import { createNotification } from '../Services/Notification.js'; // ודא שהנתיב נכון
import { getAllBereavedUsers } from '../Services/Users.js';


export async function createEvent(req, res) {
    try {
        const user = req.user;
        const eventData = req.body;
        if (user.role === 'supporter') {
            eventData.created_by_supporter_id = user.id;

            // אם לא הגיע user_id – סימן שזה אירוע כללי, ולכן apply_to_all = true
            if (!eventData.user_id) {
                eventData.apply_to_all = true;
            } else {
                eventData.apply_to_all = false;
            }
        } else if (user.role === 'bereaved') {
            eventData.user_id = user.id;
            eventData.created_by_supporter_id = null;
        }
        // 🟦 ולידציה של תוכן האירוע
        validateEventData(eventData, user);

        // 🟩 יצירת האירוע במסד
        const eventId = await calendarService.createEvent(eventData);

        const io = req.app.get('io');
        const message = `נוסף עבורך אירוע חדש: "${eventData.title}"`;

        // 🟨 אם תומך יצר אירוע:
        if (user.role === 'supporter' && eventData.apply_to_all) {
            // 🟨 אם הוא מייעד את זה לאבל מסוים

            const bereavedUsers = await getAllBereavedUsers();
            console.log('bereavedUsers', bereavedUsers);
            for (const bereaved of bereavedUsers) {
                await createNotification({
                    user_id: bereaved.id,
                    type: 'event_reminder',
                    message,
                    target_url: `/${bereaved.user_name}/calendar?eventId=${eventId}`
                });

                sendNotificationToUser(io, bereaved.id, {

                    type: 'event_reminder',
                    message,
                    target_url: `/${bereaved.user_name}/calendar?eventId=${eventId}`
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
            return res.status(403).json({ error: 'אירוע נעול - אין אפשרות לערוך אותו' });
        }

        if (existingEvent.calendar_type === 'supporter' && user.role === 'bereaved') {
            return res.status(403).json({ error: 'אין הרשאה לעדכן אירוע שנוצר על ידי תומך' });
        }

        if (existingEvent.calendar_type === 'bereaved') {
            if (existingEvent.user_id !== user.id && user.role !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized to update this event' });
            }
        } else if (existingEvent.calendar_type === 'supporter') {
            if (existingEvent.created_by_supporter_id !== user.id && user.role !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized to update this event' });
            }
        } else {
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
            return res.status(403).json({ error: 'אירוע נעול - אין אפשרות למחוק אותו' });
        }

        if (existingEvent.calendar_type === 'supporter' && user.role === 'bereaved') {
            return res.status(403).json({ error: 'אין הרשאה למחוק אירוע שנוצר על ידי תומך' });
        }

        if (existingEvent.calendar_type === 'bereaved') {
            if (existingEvent.user_id !== user.id && user.role !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized to delete this event' });
            }
        } else if (existingEvent.calendar_type === 'supporter') {
            if (existingEvent.created_by_supporter_id !== user.id && user.role !== 'admin') {
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

export async function updateParticipation(req, res) {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'confirmed' && status !== 'declined') {
        return res.status(400).json({ error: 'סטטוס לא תקין' });
    }

    const event = await calendarService.getEventById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.calendar_type !== 'supporter' || user.role !== 'bereaved') {
        return res.status(403).json({ error: 'רק אבל יכול לאשר הגעה לאירוע של תומך' });
    }

    const alreadyParticipated = await calendarService.hasUserParticipated(event.id, user.id);
    if (alreadyParticipated) {
        return res.status(400).json({ error: 'כבר הגבת לאירוע זה' });
    }

    await calendarService.addParticipant(event.id, user.id);

    const io = req.app.get('io');
    if (!io) {
        console.error('io לא מוגדר');
        return res.status(500).json({ error: 'Socket server not initialized' });
    }

    // רק אם המשתמש אישר - שלח התראה לתומך
    if (status === 'confirmed' && event.created_by_supporter_id) {
        const message = `${user.user_name} אישר/ה הגעה לאירוע "${event.title}"`;

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

    res.json({ message: 'ההשתתפות נשמרה' });
}
