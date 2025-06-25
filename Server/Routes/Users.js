import express from 'express'; 
import * as userController from '../Controllers/Users.js'; 

import {authenticateJWT} from '../Middlewares/authenticateJWT.js';
import {authorizeRoles} from '../Middlewares/authorizeRoles.js';

const router = express.Router();
/////// להעביר למקום אחר!!!!!!!!
router.get('/current', authenticateJWT, (req, res) => {
    res.json({
        id: req.user.id,
        user_name: req.user.user_name,
        role: req.user.role
    });
});
router.get('/available', authenticateJWT, userController.getAvailableUsers);

router.post('/login', userController.loginUserTo);
router.post("/", userController.addUserTo);
router.post('/bereaved_profile', authenticateJWT, authorizeRoles('bereaved'), userController.createBereavedProfile);
router.post('/supporter_profile', authenticateJWT, authorizeRoles('supporter'), userController.createSupporterProfile);
router.post('/logout', authenticateJWT,userController.logoutUser);

router.post('/check-existence', userController.checkUserExistence);


export default router;


