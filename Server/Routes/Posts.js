import express from 'express';
import * as PostController from '../Controllers/Posts.js'; // Capital P
import { authenticateJWT, authorizeRoles } from '../Middlewares/auth.js';

const router = express.Router();

// Use authenticateJWT for all /posts routes
router.use(authenticateJWT, authorizeRoles('supporter', 'bereaved'));

// Post routes
router.get('/', PostController.getPosts);
router.post('/', PostController.createPost);
// router.get('/:postId', PostController.getPostById);
router.delete('/:postId', PostController.deletePost);
router.put('/:postId', PostController.updatePost);



// Nested routes - Likes
router.post('/:postId/likes', PostController.addLikeToPost);
router.delete('/:postId/likes', PostController.removeLikeFromPost);

// Nested routes - Follows
router.post('/:postId/follows', PostController.addFollowToPost);
router.delete('/:postId/follows', PostController.removeFollowFromPost);

export default router;
