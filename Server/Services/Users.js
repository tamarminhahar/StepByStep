
import db from '../../DB/dbConnection.js';
import bcrypt from 'bcrypt';

export async function getUserWithPasswordByName(userName) {
    try {
        const [users] = await db.execute(`
            SELECT users.id, users.user_name, users.email, users.role, passwords.password_hash
            FROM users
            JOIN passwords ON users.id = passwords.user_id
            WHERE users.user_name = ?
        `, [userName]);

        return users[0];
    } catch (err) {
        throw err;
    }
}

// export const getUserByName = async (name) => {
//     const [rows] = await db.execute('SELECT * FROM users WHERE user_name  = ?', [name]);
//     return rows[0];
// };
// export async function getUserWithPasswordByName(userName) {
//     try {
//         const [users] = await db.execute(`
//             SELECT id, user_name, email, password_hash, role
//             FROM users
//             WHERE user_name = ?
//         `, [userName]);
//         return users[0];
//     } catch (err) {
//         throw err;
//     }
// }


// export async function addUser(userData) {
//     try {
//         const { name, email, role, password_hash } = userData;
//         const [result] = await db.execute(`
//             INSERT INTO users (user_name, email, password_hash ,role)
//             VALUES (?, ?, ?,?)
//         `, [name, email, password_hash,role ]);
//         return result.insertId;
//     } catch (err) {
//         throw err;
//     }
// }

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


// export async function loginUser(name, password) {
//     try {
//         const [rows] = await db.execute(
//             'SELECT * FROM users WHERE user_name = ?',
//         [name]
//         );
//         const user = rows[0];
//         if (!user) return null;
    
//        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
//         if (!isPasswordValid) return null;

//          return user
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

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
