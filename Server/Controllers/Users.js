
 import {getUserWithPasswordByName, addUser ,loginUser,addBereavedProfile,addSupporterProfile} from '../Services/Users.js';
import bcrypt from 'bcrypt';




export const addUserTo = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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
    const { name, password } = req.body;
    // const user = await loginUser(name, password);
    // if (!user) {
    //     return res.status(401).json({ message: 'Invalid username or password' });
    // }
    // res.json({ user });
       const result = await loginUser(name, password);

    if (!result) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const { token, user } = result;

    // Return token and user info to client
    res.json({ token, user });
}


export async function createBereavedProfile(req, res) {
    try {
        const id = await addBereavedProfile(req.body);
        res.status(201).json({ id });
    } catch (err) {
        console.error('Error adding bereaved profile:', err);
        res.status(500).json({ message: 'Error adding profile' });
    }
}

export async function createSupporterProfile(req, res) {
    try {
        const id = await addSupporterProfile(req.body);
        res.status(201).json({ id });
    } catch (err) {
        console.error('Error adding supporter profile:', err);
        res.status(500).json({ message: 'Error adding profile' });
    }
}
