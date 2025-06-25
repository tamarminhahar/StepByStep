import express from 'express';
import * as PostController from '../Controllers/Posts.js'; 
import {authenticateJWT} from '../Middlewares/authenticateJWT.js';
import {authorizeRoles} from '../Middlewares/authorizeRoles.js';
import upload from '../Middlewares/uploadMedia.js';

const router = express.Router();

router.use(authenticateJWT, authorizeRoles('supporter', 'bereaved'));

// Post routes
router.get('/', PostController.getPosts);
router.post('/', upload.single('media'), PostController.createPost);
router.delete('/:postId', PostController.deletePost);
router.patch('/:id', upload.single('media'), PostController.updatePost);


// Nested routes - Likes
router.post('/:postId/likes', PostController.addLikeToPost);
router.delete('/:postId/likes', PostController.removeLikeFromPost);

export default router;
