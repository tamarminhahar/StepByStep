import jwt from 'jsonwebtoken';

export function authenticateJWT(req, res, next) {
    const token = req.cookies.token;

    if (token) {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';

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
