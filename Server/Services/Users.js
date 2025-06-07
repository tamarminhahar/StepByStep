import db from '../../DB/dbConnection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUserByName = async (name) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE name = ?', [name]);
    return rows[0];
};

export async function getUserWithPasswordByName(name) {
    try {
        const [users] = await db.query(`
            SELECT u.id, u.name, u.email, p.hashed_password
            FROM users u
            JOIN passwords p ON u.id = p.user_id
            WHERE u.name = ?
        `, [name]);
        return users[0];
    } catch (err) {
        throw err;
    }
}

// export async function addUser(userData) {
//     try {
        
//         const { name, email } = userData;
//         const [result] = await db.query(`
//             INSERT INTO users (name, email)
//             VALUES (?, ?)
//         `, [name, email]);
//         return result.insertId;
//     } catch (err) {
//         throw err;
//     }
// }
export async function addUser(userData) {
    try {
        const { userName, email, role } = userData;
        const [result] = await db.query(`
            INSERT INTO users (userName, email, role)
            VALUES (?, ?, ?)
        `, [userName, email, role]);
        return result.insertId;
    } catch (err) {
        throw err;
    }
}

export async function addPassword({ user_id, hashed_password }) {
  try {

    const [result] = await db.query(`
      INSERT INTO passwords (user_id, hashed_password)
      VALUES (?, ?)
    `, [user_id, hashed_password]);

    return result.insertId;
  } catch (err) {
    throw err;
  }
}


const JWT_SECRET = "your_super_secret_key"; // כדאי בהמשך להעביר ל־process.env

export async function loginUser(name, password) {
    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE user_name = ?", 
            [name]
        );
        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return null;
        }
        
        const token = jwt.sign(
            {
                id: user.id,
                name: user.user_name,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        return token;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
