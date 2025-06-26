import jwt from 'jsonwebtoken';

export function authenticateJWT(req, res, next) {
    const token = req.cookies.token;
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        console.error('Missing JWT_SECRET environment variable');
        return res.status(500).json({ message: 'Internal server error - missing JWT secret' });
    }

    if (token) {
        jwt.verify(token, secret, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden - invalid token' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized - token missing' });
    }
}
