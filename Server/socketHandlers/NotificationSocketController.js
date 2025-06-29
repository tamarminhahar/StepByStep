
const userSockets = new Map();

export function trackUserSocket(socket) {
  socket.on('user_connected', ({ userId }) => {
    userSockets.set(userId, socket.id);
    socket.userId = userId;
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      userSockets.delete(socket.userId);
    }
  });
}

export function sendNotificationToUser(io, userId, notification) {
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit('new_notification', notification);
  }
}


