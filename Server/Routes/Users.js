import express from 'express'; 
import * as userController from '../Controllers/Users.js'; 
// import { authenticateJWT } from '../Middlewares/auth.js';
import { authenticateJWT, authorizeRoles } from '../Middlewares/auth.js';


const router = express.Router();
router.post('/login', userController.loginUserTo);
router.post("/", userController.addUserTo);
router.post('/bereaved_profile', userController.createBereavedProfile);
// router.post('/supporter_profile', userController.createSupporterProfile);
router.post('/bereaved_profile', authenticateJWT,authorizeRoles('bereaved'),userController.createBereavedProfile);
router.post('/supporter_profile',authenticateJWT,authorizeRoles('supporter'),userController.createSupporterProfile);
// router.get('/:name', userController.getUserByNameTo);
router.get('/:name', authenticateJWT, userController.getUserByNameTo);

export default router;

