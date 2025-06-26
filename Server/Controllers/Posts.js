
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
        const addedPost = await postService.getPostByIdWithDetails(postId, user_id);

        res.status(201).json(addedPost);
    } catch (err) {
        console.error('Error creating post:', {
            message: err.message,
            stack: err.stack,
            name: err.name,
            code: err.code,
            response: err.response,
            error: err.error,
            errors: err.errors
        });

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

        console.log('BODY:', req.body);
        console.log('FILE:', req.file);

        // נביא את הפוסט מה־DB כדי לדעת מה ה־media_url הקיים
        const posts = await postService.getPostsByUser(user_id);
        const existingPost = await postService.getPostById(postId);

        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // נתחיל מה־media_url הקיים
        let media_url = existingPost.media_url;

        // שלב ראשון → אם ביקשו להסיר מדיה → נשים null
        if (removeMedia === 'true') {
            media_url = null;
        }

        // שלב שני → אם יש קובץ חדש → זה גובר על removeMedia → נעדכן ל־path החדש
        if (req.file) {
            media_url = req.file.path;
        }

        // עכשיו נעדכן את הפוסט ב־DB
        await postService.updatePost({
            id: postId,
            user_id,
            title,
            body,
            post_type,
            media_url,
        });

        // נחזיר את הפוסט המעודכן
        const updatedPost = await postService.getPostByIdWithDetails(postId, user_id);
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error('Error in updatePost:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getPostById(req, res) {
    const postId = req.params.id;
    const userId = req.user.id; // מניח שיש לך משתמש מחובר דרך jwt או session

    try {
        const post = await postService.getPostByIdWithDetails(postId, userId);
        if (!post) {
            return res.status(404).json({ error: 'הפוסט לא נמצא' });
        }
        res.json(post);
    } catch (err) {
        console.error('שגיאה בשליפת פוסט בודד:', err);
        res.status(500).json({ error: 'שגיאה בשרת' });
    }
}


// Likes
export async function addLikeToPost(req, res) {
    await postService.addLikeToPost(req.params.postId, req.user.id);
    res.status(201).json({ message: 'Like added' });
}

export async function removeLikeFromPost(req, res) {
    await postService.removeLikeFromPost(req.params.postId, req.user.id);
    res.json({ message: 'Like removed' });
}
