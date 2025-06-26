import * as notificationService from '../Services/Notification.js';

export async function getNotificationsForUser(req, res) {
  try {
    const notifications = await notificationService.getNotificationsForUser(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;
    await notificationService.markAsRead(id, req.user.id);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
}

export async function markAllNotificationsAsRead(req, res) {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
}


