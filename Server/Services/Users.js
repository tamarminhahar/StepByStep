
import db from '../../DB/dbConnection.js';
import bcrypt from 'bcrypt';


export async function getUsersByRole(role, excludeUserId = null) {
  let query = `
    SELECT id, user_name, role, is_online
    FROM users
    WHERE role = ?
  `;
  const values = [role];

  if (excludeUserId) {
    query += ' AND id != ?';
    values.push(excludeUserId);
  }

  const [users] = await db.query(query, values);
  return users;
}

export async function checkUserExistenceService(username, email) {
  const [users] = await db.query(`
    SELECT user_name, email FROM users
    WHERE user_name = ? OR email = ?
  `, [username, email]);

  const usernameExists = users.some(u => u.user_name === username);
const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

  return { usernameExists, emailExists };
}

export async function addUser(userData) {
    try {
        const { name, email, role, password_hash } = userData;

        // Insert user (without password)
        const [result] = await db.execute(`
            INSERT INTO users (user_name, email, role)
            VALUES (?, ?, ?)
        `, [name, email, role]);

        const newUserId = result.insertId;

        // Insert password into passwords table
        await db.execute(`
            INSERT INTO passwords (user_id, password_hash)
            VALUES (?, ?)
        `, [newUserId, password_hash]);

        return newUserId;
    } catch (err) {
        throw err;
    }
}

export async function loginUser(name, password) {
    try {
        const [rows] = await db.execute(`
            SELECT users.id, users.user_name, users.email, users.role, passwords.password_hash
            FROM users
            JOIN passwords ON users.id = passwords.user_id
            WHERE users.user_name = ?
        `, [name]);

        const user = rows[0];
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) return null;

        // Return user (without password_hash)
        const { password_hash, ...safeUser } = user;
        return safeUser;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function addBereavedProfile({ user_id, date_of_loss, relationship_to_deceased }) {
    const [result] = await db.query(
        `INSERT INTO bereaved_profile (user_id, date_of_loss, relationship_to_deceased)
         VALUES (?, ?, ?)`,
        [user_id, date_of_loss, relationship_to_deceased]
    );
    return result.insertId;
}

export async function addSupporterProfile({ user_id, profession_type }) {
    const [result] = await db.query(
        `INSERT INTO supporter_profile (user_id, profession_type)
         VALUES (?, ?)`,
        [user_id, profession_type]
    );
    return result.insertId;
}
export const performLogout = (res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
    });
};

export async function getAllBereavedUsers() {
  const [rows] = await db.query(`
    SELECT id, user_name
    FROM users
    WHERE role = 'bereaved'
  `);
  return rows;
}
export async function updateOnlineStatus(userId, isOnline) {
    await db.query(`UPDATE users SET is_online = ? WHERE id = ?`, [isOnline, userId]);
}
