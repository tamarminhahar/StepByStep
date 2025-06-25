
import { checkUserExistenceService, addUser, loginUser, addBereavedProfile, addSupporterProfile, performLogout, getUsersByRole, updateOnlineStatus } from '../Services/Users.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../Middlewares/generateToken.js';
import { createMemorialEventsForUser } from '../Services/memorialDates.js';

export async function checkUserExistence(req, res) {
  const { username, email } = req.body;
  try {
    const result = await checkUserExistenceService(username, email);
    res.json(result);
  } catch (error) {
    console.error('Error checking existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAvailableUsers(req, res) {
  const mode = req.query.mode;

  if (!['supporter', 'bereaved'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid mode' });
  }

  try {
    const users = await getUsersByRole(mode);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch available users' });
  }
}

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
    const token = generateToken({ id: newUserId, user_name: name, role });
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

export async function loginUserTo(req, res) {
  const { name, password } = req.body;
  const user = await loginUser(name, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = generateToken(user);
  const { password_hash, ...safeUser } = user;
  await updateOnlineStatus(safeUser.id, true);

  const io = req.app.get('io');
  io.emit('user_status_change', { userId: safeUser.id, isOnline: true });

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
    const { date_of_loss, relationship_to_deceased } = req.body;
    const userId = req.user.id;
    const id = await addBereavedProfile({
      user_id: userId,
      date_of_loss,
      relationship_to_deceased,
    });
    await createMemorialEventsForUser(userId, date_of_loss);
    res.status(201).json({ id });
  } catch (err) {
    console.error('Error adding bereaved profile:', err);
    res.status(500).json({ message: 'Error adding profile' });
  }
}

export async function createSupporterProfile(req, res) {
  try {
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


export const logoutUser = async (req, res) => {
  try {
    performLogout(res);
    await updateOnlineStatus(req.user.id, false);

    const io = req.app.get('io');
    io.emit('user_status_change', { userId: req.user.id, isOnline: false });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error in logoutUser:', err);
    res.status(500).json({ message: 'Error logging out' });
  }
};
