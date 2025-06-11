
 import {getUserWithPasswordByName, addUser ,loginUser,addBereavedProfile,addSupporterProfile,performLogout} from '../Services/Users.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../Middlewares/auth.js';



export const addUserTo = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

   
      const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = await addUser({
      name,
      email,
      password_hash: hashedPassword,
      role,
    });
    // Return a token so the client can be logged in immediately after register
    const token = generateToken({ id: newUserId, user_name: name, role });
    // res.status(201).json({ id: newUserId, token, role });
    res
  .cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // ב־localhost זה false
    sameSite: 'lax', // לא strict, כדי שיעבוד ב־localhost
    maxAge: 3600000, // שעה
  })
  .status(201)
  .json({ id: newUserId, role });

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
    const user = await loginUser(name, password);
     if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = generateToken(user);
    const { password_hash, ...safeUser } = user;
    // res.json({ token, user: { id: safeUser.id, role: safeUser.role, user_name: safeUser.user_name } });
res
  .cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3600000,
  })
  .json({
    user: { id: safeUser.id, role: safeUser.role, user_name: safeUser.user_name }
  });


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


export const logoutUser = (req, res) => {
    try {
        performLogout(res);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Error in logoutUser:', err);
        res.status(500).json({ message: 'Error logging out' });
    }
};
