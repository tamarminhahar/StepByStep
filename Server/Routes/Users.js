import express from 'express'; 
import * as userController from '../Controllers/Users.js'; 
import { authenticateJWT, authorizeRoles } from '../Middlewares/auth.js';


const router = express.Router();
router.post('/login', userController.loginUserTo);
router.post("/", userController.addUserTo);

router.post('/bereaved_profile', authenticateJWT, authorizeRoles('bereaved'), userController.createBereavedProfile);
router.post('/supporter_profile', authenticateJWT, authorizeRoles('supporter'), userController.createSupporterProfile);
router.post('/logout', userController.logoutUser);
router.get('/:name', userController.getUserByNameTo);

router.get('/me', authenticateJWT, (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.user_name,
        role: req.user.role
    });
});

export default router;

