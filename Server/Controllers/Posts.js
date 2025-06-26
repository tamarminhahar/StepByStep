
import * as postService from '../Services/Posts.js';

export async function getPosts(req, res) {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const posts = await postService.getPostsPaginated(userId, page, limit);
        res.json(posts);
    } catch (err) {
        console.error('Error fetching paginated posts:', err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}

export async function createPost(req, res) {
    const { title, body, post_type } = req.body;
    const user_id = req.user.id;
    const media_url = req.file ? req.file.path : null;
    try {
        const postId = await postService.addPost(user_id, title, body, media_url, post_type);
        const addedPost = await postService.getPostByIdWithDetails(postId, user_id); res.status(201).json(addedPost);
    } catch (err) {
        console.error('Error creating post:', err.message);
        if (err.message && err.message.includes('Invalid file format')) {
            res.status(400).json({ error: 'Unsupported media format. Please upload image or mp4/webm video.' });
        } else {
            res.status(500).json({ error: 'Failed to create post' });
        }
    }
}

export async function deletePost(req, res) {
    try {
        const userId = req.user.id;
        const success = await postService.deletePost(req.params.postId, userId);
        if (!success) {
            return res.status(403).json({ error: 'Unauthorized to delete this post' });
        }
        res.json({ success });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Failed to delete post' });
    }
}

export async function updatePost(req, res) {
    try {
        const postId = req.params.id;
        const user_id = req.user.id;
        const { title, body, post_type, removeMedia } = req.body;
        const existingPost = await postService.getPostById(postId);

        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        let media_url = existingPost.media_url;
        if (removeMedia === 'true') {
            media_url = null;
        }
        if (req.file) {
            media_url = req.file.path;
        }
        await postService.updatePost({
            id: postId, user_id, title, body, post_type, media_url,
        });
        const updatedPost = await postService.getPostByIdWithDetails(postId, user_id);
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error('Error in updatePost:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function addLikeToPost(req, res) {
    try {
    await postService.addLikeToPost(req.params.postId, req.user.id);
    res.status(201).json({ message: 'Like added' });
      } catch (err) {
        console.error('Error adding like:', err.message);
        res.status(500).json({ message: 'Failed to add like' });
    }
}

export async function removeLikeFromPost(req, res) {
    try {
    await postService.removeLikeFromPost(req.params.postId, req.user.id);
    res.json({ message: 'Like removed' });
      } catch (err) {
        console.error('Error removing like:', err.message);
        res.status(500).json({ message: 'Failed to remove like' });
    }
}
// export async function getPostById(req, res) {
//     const postId = req.params.id;
//     const userId = req.user.id; 

//     try {
//         const post = await postService.getPostByIdWithDetails(postId, userId);
//         if (!post) {
//             return res.status(404).json({ error: 'הפוסט לא נמצא' });
//         }
//         res.json(post);
//     } catch (err) {
//         console.error('שגיאה בשליפת פוסט בודד:', err);
//         res.status(500).json({ error: 'שגיאה בשרת' });
//     }
// }