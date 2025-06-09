 import {getUserWithPasswordByName, addUser ,loginUser} from '../Services/Users.js';
import bcrypt from 'bcrypt';

// export const addUserTo = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const newUserId = await addUser({ name: username, email });
//     await addPassword({ user_id: newUserId, hashed_password: password });

//     res.status(201).json({ id: newUserId });
//   } catch (err) {
//     console.error('Error adding user:', err);
//     res.status(500).json({ message: 'Error adding user' });
//   }
// };

export const addUserTo = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // const newUserId = await addUser({ name: name, email:email, role:role });

    // const hashedPassword = await bcrypt.hash(password, 10);
    // await addPassword({ user_id: newUserId, password_hash: hashedPassword });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUserId = await addUser({ 
            name: name, 
            email: email, 
            password_hash: hashedPassword,
            role: role
        });
    res.status(201).json({ id: newUserId });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Error adding user' });
  }
};

export async function getUserByNameTo(req, res) {
    const { name } = req.params;
    console.log(name);
    try {
        const user = await getUserWithPasswordByName(name);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error in getUserByNameController:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export async function loginUserTo(req, res) {
    try {
        const { name, password } = req.body;
        const token = await loginUser(name, password);

        if (!token) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
