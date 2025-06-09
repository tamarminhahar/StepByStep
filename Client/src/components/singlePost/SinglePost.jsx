import React, { useState } from 'react';
import Comments from '../comments/Comments.jsx';

const SinglePost = ({ post, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
//   const token = localStorage.getItem('token');

  const handleDelete = () => {
    fetch(`http://localhost:3000/posts/${post.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => onDelete())
      .catch(err => console.error(err));
  };

  const toggleLike = () => {
    if (!liked) {
      fetch(`http://localhost:3000/posts/${post.id}/likes`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(() => { setLiked(true); setLikes(likes + 1); })
        .catch(err => console.error(err));
    } else {
      fetch(`http://localhost:3000/posts/${post.id}/likes`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(() => { setLiked(false); setLikes(likes - 1); })
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      {post.media_url && <img src={post.media_url} alt="" />}
      <div>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={toggleLike}>{liked ? 'Unlike' : 'Like'} ({likes})</button>
        <button onClick={() => setShowComments(!showComments)}>Comments</button>
      </div>
      {showComments && <Comments postId={post.id} />}
    </div>
  );
};

export default SinglePost;