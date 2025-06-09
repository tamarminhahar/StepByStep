import db from '../../DB/dbConnection.js';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

export const getUserByName = async (name) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE name = ?', [name]);
    return rows[0];
};
export async function getUserWithPasswordByName(userName) {
    try {
        const [users] = await db.execute(`
            SELECT id, user_name, email, password_hash, role
            FROM users
            WHERE user_name = ?
        `, [userName]);
        return users[0];
    } catch (err) {
        throw err;
    }
}


export async function addUser(userData) {
    try {
        const { name, email, role, password_hash } = userData;
        const [result] = await db.execute(`
            INSERT INTO users (user_name, email, password_hash ,role)
            VALUES (?, ?, ?,?)
        `, [name, email, password_hash,role ]);
        return result.insertId;
    } catch (err) {
        throw err;
    }
}




// const JWT_SECRET = "your_super_secret_key"; // כדאי בהמשך להעביר ל־process.env

// export async function loginUser(name, password) {
//     try {
//         const [rows] = await db.execute(
//             "SELECT * FROM users WHERE user_name = ?", 
//             [name]
//         );
//         const user = rows[0];
//         const isPasswordValid = await bcrypt.compare(password, user.password_hash);

//         if (!isPasswordValid) {
//             return null;
//         }
        
//         // const token = jwt.sign(
//         //     {
//         //         id: user.id,
//         //         name: user.user_name,
//         //         email: user.email,
//         //         role: user.role,
//         //     },
//         //     JWT_SECRET,
//         //     { expiresIn: '1h' }
//         // );
//         // return token;

//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }
// export async function loginUser(name, password) {
//     try {
//         const [rows] = await db.execute(
//             "SELECT * FROM users WHERE user_name = ?",
//             [name]
//         );
//         const user = rows[0];
//         const isPasswordValid = await bcrypt.compare(password, user.password_hash);

//         if (!isPasswordValid) {
//             return null;
//         }

//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }
import { generateToken } from '../Middlewares/auth.js';

export async function loginUser(name, password) {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE user_name = ?",
            [name]
        );

        const user = rows[0];

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return null;
        }

        // יוצרים token
        const token = generateToken(user);

        return token;

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
