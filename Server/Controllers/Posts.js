
import * as postService from '../Services/Posts.js';

 export async function getPosts(req, res) {
     const posts = await postService.getAllPosts();
     res.json(posts);
 }

export async function createPost(req, res) {
    // const { title, body, media_url, grief_tag } = req.body;
    // const postId = await postService.addPost(req.user.id, title, body, media_url, grief_tag);
    const { user_id, title, body, media_url, grief_tag } = req.body;
const postId = await postService.addPost(user_id, title, body, media_url, grief_tag);

    res.status(201).json({ id: postId });
}

// export async function getPostById(req, res) {
//     const post = await postService.getPostById(req.params.postId);
//     res.json(post);
// }

export async function deletePost(req, res) {
       const userId = req.query.user_id; 
    const success = await postService.deletePost(req.params.postId, userId);
    // const success = await postService.deletePost(req.params.postId, req.user.id);
    res.json({ success });
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
