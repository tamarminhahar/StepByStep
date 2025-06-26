import express from 'express'; 
import * as userController from '../Controllers/Users.js'; 
import {authenticateJWT} from '../Middlewares/authenticateJWT.js';
import {authorizeRoles} from '../Middlewares/authorizeRoles.js';

const router = express.Router();

router.get('/available', authenticateJWT, userController.getAvailableUsers);
router.get('/current', authenticateJWT, userController.getCurrentUser);
router.post('/login', userController.loginUserTo);
router.post("/", userController.addUserTo);
router.post('/bereaved_profile', authenticateJWT, authorizeRoles('bereaved'), userController.createBereavedProfile);
router.post('/supporter_profile', authenticateJWT, authorizeRoles('supporter'), userController.createSupporterProfile);
router.post('/logout', authenticateJWT,userController.logoutUser);
router.post('/check-existence', userController.checkUserExistence);


export default router;


