import React, { useEffect, useState } from 'react';
import SinglePost from '../singlePost/SinglePost.jsx';
import { useCurrentUser } from '../userProvider.jsx';
import Nav from '../nav/nav.jsx';

const PostsList = () => {
  const { currentUser } = useCurrentUser();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('date');
  const [griefTag, setGriefTag] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [likedOnly, setLikedOnly] = useState(false);
  const [mineOnly, setMineOnly] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    params.append('sort', sort);
    if (griefTag) params.append('grief_tag', griefTag);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (likedOnly) params.append('liked', 'true');
    if (mineOnly) params.append('mine', 'true');

    fetch(`http://localhost:3000/posts?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => setError(err.message));
  }, [sort, griefTag, startDate, endDate, likedOnly, mineOnly]);

  const handleDelete = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <>
      <Nav />
      <h2>Posts</h2>
      <div className="filters">
        <label>
          Sort by:
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="date">Date</option>
            <option value="popularity">Popularity</option>
          </select>
        </label>
        <label>
          Tag:
          <select value={griefTag} onChange={e => setGriefTag(e.target.value)}>
            <option value="">All</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
            <option value="Friend">Friend</option>
            <option value="Grandparent">Grandparent</option>
            <option value="In-Law">In-Law</option>
            <option value="Cousin">Cousin</option>
            <option value="Distant Relative">Distant Relative</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          From:
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label>
          To:
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>
        <label>
          <input type="checkbox" checked={likedOnly} onChange={e => setLikedOnly(e.target.checked)} />
          Only with likes
        </label>
        <label>
          <input type="checkbox" checked={mineOnly} onChange={e => setMineOnly(e.target.checked)} />
          My posts
        </label>
      </div>
      {/* {error && <p>{error}</p>} */}
      {posts.map(post => (
        <SinglePost key={post.id} post={post} onDelete={() => handleDelete(post.id)} />
      ))}
    </>
  );
};

export default PostsList;