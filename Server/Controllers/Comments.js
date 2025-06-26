import * as CommentsService from '../Services/Comments.js';


export async function getCommentsForPost(req, res) {
     try {
    const comments = await CommentsService.getCommentsForPost(req.params.postId);
    res.json(comments);
        } catch (err) {
        console.error('Error fetching comments:', err.message);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
}

export async function addCommentToPost(req, res) {
     try {
    const { content, anonymous } = req.body;
    const commentId = await CommentsService.addCommentToPost(
        req.params.postId,
        req.user.id,
        content,
        anonymous
    );
    res.status(201).json({ id: commentId });
      } catch (err) {
        console.error('Error adding comment:', err.message);
        res.status(500).json({ message: 'Failed to add comment' });
    }
}

export async function deleteComment(req, res) {
    const commentId = req.params.commentId;
    const userId = req.user.id; 

    try {
        const deleted = await CommentsService.deleteComment(commentId, userId);

        if (!deleted) {
            return res.status(403).json({ message: 'You do not have permission to delete this comment' });
        }
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting comment' });
    }
}
