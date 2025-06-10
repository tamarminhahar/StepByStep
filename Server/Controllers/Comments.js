import * as postService from '../Services/Comments.js';


export async function getCommentsForPost(req, res) {
    const comments = await postService.getCommentsForPost(req.params.postId);
    res.json(comments);
}


export async function addCommentToPost(req, res) {
    const { content } = req.body;
    const commentId = await postService.addCommentToPost(req.params.postId, req.user.id, content);
    res.status(201).json({ id: commentId });
}