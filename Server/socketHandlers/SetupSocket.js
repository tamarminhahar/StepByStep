
import { trackUserSocket } from './NotificationSocketController.js';
import { handleSocketConnection } from './ChatSocketController.js';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

function authenticateSocketViaCookie(socket, next) {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
        console.warn('No cookies found in socket handshake');

      return next(new Error('No cookies'));
    }
    const parsed = cookie.parse(cookies);

    const token = parsed.token;
    if (!token) return next(new Error('Token missing'));

    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const user = jwt.verify(token, secret);

    socket.userId = user.id;
    socket.role = user.role;

    next();
  } catch (err) {
    console.error('Socket auth error:', err.message);
    next(new Error('Authentication failed'));
  }
}

export function setupSocket(io) {
  io.use(authenticateSocketViaCookie);
  
io.on('connection', (socket) => {
  trackUserSocket(socket);
  handleSocketConnection(io, socket);
});
}