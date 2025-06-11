import jwt from 'jsonwebtoken';

// הפונקציה הזו יוצרת token עבור המשתמש (תחזיר אותו ל־client אחרי login)
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

// export function authenticateJWT(req, res, next) {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];
//         const secret = process.env.JWT_SECRET || 'your_jwt_secret';

//         jwt.verify(token, secret, (err, user) => {
//             if (err) {
//                 return res.status(403).json({ message: 'Forbidden - invalid token' });
//             }

//             req.user = user; // כאן שם את הנתונים של המשתמש ל־req.user
//             next();
//         });
//     } else {
//         res.status(401).json({ message: 'Unauthorized - token missing' });
//     }
// }
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

export function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden - insufficient privileges' });
        }
        next();
    };
}
