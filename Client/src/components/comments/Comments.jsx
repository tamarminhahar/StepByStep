
import React, { useEffect, useState } from 'react';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  // const token = localStorage.getItem('token');

  useEffect(() => {
    // fetch(`http://localhost:3000/posts/${postId}/comments`)
    fetch(`http://localhost:3000/posts/${postId}/comments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, [postId]);

  const addComment = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    })
      .then(res => res.json())
      .then((newComment) => {
        setComments([...comments, { id: newComment.id, content }]);
        setContent('');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="comments">
      <form onSubmit={addComment}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add comment"
          required
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>{c.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;