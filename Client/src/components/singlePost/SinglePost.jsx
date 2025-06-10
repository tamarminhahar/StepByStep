import React, { useEffect, useState } from 'react';
import Comments from '../comments/Comments.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../userProvider.jsx';

const SinglePost = ({ post, setPosts, selectedPostId, setSelectedPostId }) => {
    const [showComments, setShowComments] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes || 0);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [newPostData, setNewPostData] = useState({ title: '', body: '' });
    const [showBody, setShowBody] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const { currentUser } = useCurrentUser();

    // const handleDelete = () => {
    //     fetch(`http://localhost:3000/posts/${post.id}`, {
    //         method: 'DELETE',
    //         //   headers: { 'Authorization': `Bearer ${token}` }
    //         headers: { 'Content-Type': 'application/json' },

    //     })
    //         .then(() => onDelete())
    //         .catch(err => console.error(err));
    // };

    const handleDelete = (id) => {
  fetch(`http://localhost:3000/posts/${id}?user_id=${currentUser.id}`, {
    method: 'DELETE',

  })
          .then((res) => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        })
        .catch((err) => console.error(err));
};

    //  const handleDelete = async (id) => {
    //     try {

    //         const response = await fetch(`http://localhost:3000/posts/${id}`, {
    //             method: 'DELETE',
    //         });
    //         if (!response.ok) {
    //             throw new Error(`Error: ${response.status}`);
    //         }
    //         setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    //     } catch (err) {
    //         setError(err.message);
    //     }
    // };

    const handleUpdatePost = async (updatedPost) => {
        console.log('Updated Post:', updatedPost);
        const postData = {
            user_id: updatedPost.user_id,
            title: updatedPost.title,
            body: updatedPost.body
        };
        try {
            const response = await fetch(`http://localhost:3000/posts/${updatedPost.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData), // שלח את הנתונים בסדר הנכון
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const updatedResponsePost = await response.json();
            setPosts((prevPosts) =>
                prevPosts.map((p) => (p.id === updatedResponsePost.id ? updatedResponsePost : p))
            );
        } catch (err) {
            setError(err.message);
        }
    };
    // Edit post title and body
    const handleStartEdit = (post) => {
        setEditingId(post.id);
        setNewPostData({ title: post.title, body: post.body });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewPostData({ title: '', body: '' });
    };

    const handleSaveEdit = (post) => {
        handleUpdatePost(post);
        setEditingId(null);
        setNewPostData({ title: '', body: '' });
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
        <>
            {editingId === post.id ? (
                <div>
                    <input
                        type="text"
                        value={newPostData.title}
                        onChange={(e) =>
                            setNewPostData((prevData) => ({
                                ...prevData,
                                title: e.target.value,
                            }))
                        }
                    />
                </div>
            ) : (
                <span >
                    #{post.id}: {typeof post.title === "string" ? post.title : JSON.stringify(post.title)}
                </span>
            )}

            {showBody && (editingId === post.id ? (
                <input
                    type="text"
                    value={newPostData.body}
                    onChange={(e) =>
                        setNewPostData((prevData) => ({
                            ...prevData,
                            body: e.target.value,
                        }))
                    }
                />
            ) : (
                <span>
                    {typeof post.body === "string" ? post.body : JSON.stringify(post.body)}
                </span>
            ))}

            <div >
                {showBody ? (
                    <button onClick={() => {
                        setShowBody(false);
                        setEditingId(null);
                    }}>
                        Hide
                    </button>
                ) : (
                    <button onClick={() => setShowBody(true)}>Body</button>
                )}

                {showBody && (editingId !== post.id && (
                    <button onClick={() => handleStartEdit(post)}>
                        <span>✏️</span>

                    </button>
                ))}

                {editingId === post.id && (
                    <>
                        <button
                            onClick={() =>
                                handleSaveEdit({
                                    id: post.id,
                                    user_id: post.user_id || currentUser.id,
                                    title: newPostData.title,
                                    body: newPostData.body,
                                })

                            }
                        >
                            {/* <img src="./img/checkmark.png" alt="Save" /> */}
                            <span >✔️</span>

                        </button>

                        <button onClick={handleCancelEdit}>
                            <span>❌</span>
                        </button>
                    </>
                )}

                {editingId !== post.id && currentUser.id === post.user_id &&(
                    
                    <button onClick={() => handleDelete(post.id)}
                    >
                        <span>🗑️</span>
                    </button>
                )}
            </div>

            {/* Link to comments page */}
            {editingId !== post.id && (
                <button >
                    {/* <Link to={`/users/${post.user_id}/posts/${post.id}/comments`} state={{ postId: post.id }}>
                        View Comments
                    </Link> */}
                </button>
            )}
        </>
    );
}



export default SinglePost;