import jwt from 'jsonwebtoken';

export function generateToken(user) {
    const payload = {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
    };
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
}