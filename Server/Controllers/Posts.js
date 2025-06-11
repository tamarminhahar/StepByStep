
import * as postService from '../Services/Posts.js';

 export async function getPosts(req, res) {
     const posts = await postService.getAllPosts();
     res.json(posts);
 }

export async function createPost(req, res) {
    // const { title, body, media_url, grief_tag } = req.body;
    // const postId = await postService.addPost(req.user.id, title, body, media_url, grief_tag);
//     const { user_id, title, body, media_url, grief_tag } = req.body;
// const postId = await postService.addPost(user_id, title, body, media_url, grief_tag);

const { title, body, media_url, grief_tag } = req.body;
const user_id = req.user.id; // לקרוא מה־JWT, לא מה־body

const postId = await postService.addPost(user_id, title, body, media_url, grief_tag);

const posts = await postService.getPostsByUser(user_id);
const addedPost = posts.find(p => p.id === postId);
res.status(201).json(addedPost);
}

// export async function getPostById(req, res) {
//     const post = await postService.getPostById(req.params.postId);
//     res.json(post);
// }

// export async function deletePost(req, res) {
//        const userId = req.query.user_id; 
//     const success = await postService.deletePost(req.params.postId, userId);
//     res.json({ success });
// }

export async function deletePost(req, res) {
    try {
        const userId = req.query.user_id;
        if (!userId) {
            return res.status(400).json({ error: 'user_id is required' });
        }

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
    const { title, body, user_id } = req.body;
    const postId = req.params.postId;

    try {
        const updatedPost = await postService.updatePost(postId, user_id, title, body);
        res.json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update post' });
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

// Follows
export async function addFollowToPost(req, res) {
    await postService.addFollowToPost(req.params.postId, req.user.id);
    res.status(201).json({ message: 'Follow added' });
}

export async function removeFollowFromPost(req, res) {
    await postService.removeFollowFromPost(req.params.postId, req.user.id);
    res.json({ message: 'Follow removed' });
}
