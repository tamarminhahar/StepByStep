import React, { useEffect, useState } from 'react';
import SinglePost from '../singlePost/SinglePost.jsx';
import { useCurrentUser } from '../userProvider.jsx';
import Nav from '../nav/nav.jsx';

const PostsList = () => {
  const { currentUser } = useCurrentUser();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
debugger
  useEffect(() => {
    // fetch('http://localhost:3000/posts')
       const token = localStorage.getItem('token');
    fetch('http://localhost:3000/posts', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => setError(err.message));
  }, []);

  const handleDelete = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <>
      <Nav />
      <h2>Posts</h2>
      {/* {error && <p>{error}</p>} */}
      {posts.map(post => (
        <SinglePost key={post.id} post={post} onDelete={() => handleDelete(post.id)} />
      ))}
    </>
  );
};

export default PostsList;