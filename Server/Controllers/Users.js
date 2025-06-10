
 import {getUserWithPasswordByName, addUser ,loginUser,addBereavedProfile,addSupporterProfile} from '../Services/Users.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../Middlewares/auth.js';



export const addUserTo = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //     const hashedPassword = await bcrypt.hash(password, 10);

    //     const newUserId = await addUser({ 
    //         name: name, 
    //         email: email, 
    //         password_hash: hashedPassword,
    //         role: role
    //     });
    // res.status(201).json({ id: newUserId });
      const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = await addUser({
      name,
      email,
      password_hash: hashedPassword,
      role,
    });
    // Return a token so the client can be logged in immediately after register
    const token = generateToken({ id: newUserId, user_name: name, role });
    res.status(201).json({ id: newUserId, token, role });
    
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Error adding user' });
  }
};

export async function getUserByNameTo(req, res) {
    console.log('typeof name:', typeof name);

    const { name } = req.params;
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
    const user = await loginUser(name, password);
     if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = generateToken(user);
    const { password_hash, ...safeUser } = user;
    res.json({ token, user: { id: safeUser.id, role: safeUser.role, user_name: safeUser.user_name } });


}


export async function createBereavedProfile(req, res) {
    try {
        // const id = await addBereavedProfile(req.body);
          const { date_of_loss, relationship_to_deceased } = req.body;
        const id = await addBereavedProfile({
            user_id: req.user.id,
            date_of_loss,
            relationship_to_deceased,
        });
        res.status(201).json({ id });
    } catch (err) {
        console.error('Error adding bereaved profile:', err);
        res.status(500).json({ message: 'Error adding profile' });
    }
}

export async function createSupporterProfile(req, res) {
    try {
        // const id = await addSupporterProfile(req.body);
         const { profession_type } = req.body;
        const id = await addSupporterProfile({
            user_id: req.user.id,
            profession_type,
        });
        res.status(201).json({ id });
    } catch (err) {
        console.error('Error adding supporter profile:', err);
        res.status(500).json({ message: 'Error adding profile' });
    }
}
