import React, { useEffect, useState } from 'react';
import SinglePost from '../singlePost/SinglePost.jsx';
import Nav from '../nav/nav.jsx';

const PostsList = () => {
  const { currentUser } = useCurrentUser();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("id");
  const [isAdding, setIsAdding] = useState(false);
  const [newPostData, setNewPostData] = useState({ title: '', body: '' ,media_url: '', grief_tag: '' });
  const [selectedUser, setSelectedUser] = useState({ username: currentUser.username, id: null });
  const [displayedUsername, setDisplayedUsername] = useState(currentUser.username);
  const [selectedPostId, setSelectedPostId] = useState(null);


//    const fetchPosts = async (id) => {
//         try {
//             setLoading(true);
//             const response = await  fetch('http://localhost:3000/posts');
//             if (!response.ok) {
//                 throw new Error("Failed to fetch posts");
//             }
//             const data = await response.json();
//             setPosts(data);
//             setDisplayedPosts(data);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };
  const fetchPosts = async (id) => {
    try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/posts', {
            credentials: 'include', // חייב!
        });
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
        setDisplayedPosts(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
  
useEffect(() => {
        if (currentUser) {
            fetchPosts(currentUser.id);
        }
    }, [currentUser,setPosts]);

    //Returns the selceted user's id from DB according to his username.
    const findSelectedUserId = async () => {
        setDisplayedUsername(selectedUser.username);
        try {

            const response = await fetch(`http://localhost:3000/users/${selectedUser.username}`);
            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }
            const data = await response.json();
            fetchPosts(data.id);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    //Add a new post to the DB.
    const handleAddPost = async () => {
        if (!newPostData.title || !newPostData.body) return;
        try {          
            const response = await fetch(`http://localhost:3000/posts/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    // user_id: Number(currentUser.id),
                    title: newPostData.title,
                    body: newPostData.body,
                    media_url: newPostData.media_url,
                    grief_tag: newPostData.grief_tag
                }),
            });
            if (!response.ok)
                throw new Error(`Error: ${response.status}`);
            const addedPost = await response.json();
            setPosts((prevPosts) => [...prevPosts, addedPost]);
            setIsAdding(false);
            setNewPostData({ title: "", body: "" ,media_url:"",grief_tag:""});
        } catch (err) {
            setError(err.message);
        }
    };
    //Back to default display.
    const resetSearch = () => {
        setSearchTerm("");
        setDisplayedPosts(posts);
        // setFilterCriteria("id");
    };
    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>Error: {error}</p>;

    //     <>
    //         <Nav />
    //         <div className={styles.postListContainer}>
    //             <h2 className={styles.header}>{displayedUsername}'s Posts</h2>

    //             <label>
    //                 More Posts
    //                 <div className={styles.inputContainer}>
    //                     <input
    //                         type="text"
    //                         value={selectedUser.username}
    //                         placeholder="Enter user name"
    //                         onChange={(e) =>
    //                             setSelectedUser((prev) => ({ ...prev, username: e.target.value }))
    //                         }
    //                     />
    //                     <button
    //                         type="button"
    //                         onClick={findSelectedUserId}
    //                         className={styles.okButton}
    //                     >
    //                         OK
    //                     </button>
    //                     <button
    //                         onClick={() => {
    //                             setSelectedUser({ username: currentUser.username, id: currentUser.id });
    //                             fetchPosts(currentUser.id);
    //                         }}
    //                         className={styles.myPostsButton}
    //                     >
    //                         My Posts
    //                     </button>
    //                 </div>
    //             </label>

    //             <div className={styles.searchSection}>
    //                 <label className={styles.searchLabel}>
    //                     Search by:
    //                     <select
    //                         value={filterCriteria}
    //                         onChange={(e) => setFilterCriteria(e.target.value)}

    //                     >
    //                         <option value="id">ID</option>
    //                         <option value="title">Title</option>
    //                     </select>
    //                 </label>
    //                 <input
    //                     type="text"
    //                     placeholder={`Search by ${filterCriteria}`}
    //                     value={searchTerm}
    //                     onChange={(e) => setSearchTerm(e.target.value)}
    //                 />
    //                 <button onClick={resetSearch} className={styles.resetButton}>
    //                     Reset Search
    //                 </button>
    //             </div>

    //             <ul className={styles.postList}>
    //                 {displayedPosts.length > 0 ? (
    //                     displayedPosts.map((post, index) => (

    //                         <li key={index} className={styles.postItem}>
    //                             <SinglePost
    //                                 post={post}
    //                                 setPosts={setPosts}
    //                                 selectedPostId={selectedPostId}
    //                                 setSelectedPostId={setSelectedPostId}
    //                                 className={styles.singlePost}
    //                             />
    //                         </li>
    //                     ))
    //                 ) : (
    //                     <p className={styles.noPostsMessage}>No Posts Found 😒</p>
    //                 )}
    //             </ul>

    //             {isAdding && (
    //                 <div className={styles.addPostContainer}>
    //                     <input
    //                         type="text"
    //                         value={newPostData.title}
    //                         onChange={(e) =>
    //                             setNewPostData((prevData) => ({
    //                                 ...prevData,
    //                                 title: e.target.value,
    //                             }))
    //                         }
    //                         placeholder="Enter new post title"
    //                     />
    //                     <input
    //                         type="text"
    //                         value={newPostData.body}
    //                         onChange={(e) =>
    //                             setNewPostData((prevData) => ({
    //                                 ...prevData,
    //                                 body: e.target.value,
    //                             }))
    //                         }
    //                         placeholder="Enter new post body"
    //                         className={styles.newPostInput}
    //                     />
    //                     <div className={styles.addPostBtns}>
    //                         <button onClick={handleAddPost} className={styles.addPostButton}>
    //                             Add Post
    //                         </button>
    //                         <button
    //                             onClick={() => setIsAdding(false)}
    //                             className={styles.cancelButton}
    //                         >
    //                             Cancel
    //                         </button>
    //                     </div>
    //                 </div>
    //             )}
    //             {!isAdding &&
    //                 <button onClick={() => setIsAdding(true)} className={styles.addNewPostButton}>
    //                     Add New Post
    //                 </button>
    //             }
    //         </div>
    //     </>
    // );
return (
    <>
        <Nav />
        <div>
            <h2>{displayedUsername}'s Posts</h2>

            <label>
                More Posts
                <div>
                    <input
                        type="text"
                        value={selectedUser.username}
                        placeholder="Enter user name"
                        onChange={(e) =>
                            setSelectedUser((prev) => ({ ...prev, username: e.target.value }))
                        }
                    />
                    <button
                        type="button"
                        onClick={findSelectedUserId}
                    >
                        OK
                    </button>
                    <button
                        onClick={() => {
                            setSelectedUser({ username: currentUser.username, id: currentUser.id });
                            fetchPosts(currentUser.id);
                        }}
                    >
                        My Posts
                    </button>
                </div>
            </label>

            <div>
                <label>
                    Search by:
                    <select
                        value={filterCriteria}
                        onChange={(e) => setFilterCriteria(e.target.value)}
                    >
                        <option value="id">ID</option>
                        <option value="title">Title</option>
                    </select>
                </label>
                <input
                    type="text"
                    placeholder={`Search by ${filterCriteria}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={resetSearch}>
                    Reset Search
                </button>
            </div>

            <ul>
                {displayedPosts.length > 0 ? (
                    displayedPosts.map((post, index) => (
                        <li key={index}>
                            <SinglePost
                                post={post}
                                setPosts={setPosts}
                                selectedPostId={selectedPostId}
                                setSelectedPostId={setSelectedPostId}
                            />
                        </li>
                    ))
                ) : (
                    <p>No Posts Found</p>
                )}
            </ul>

            {isAdding && (
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
                        placeholder="Enter new post title"
                    />
                    <input
                        type="text"
                        value={newPostData.body}
                        onChange={(e) =>
                            setNewPostData((prevData) => ({
                                ...prevData,
                                body: e.target.value,
                            }))
                        }
                        placeholder="Enter new post body"
                    />
                    <div>
                        <button onClick={handleAddPost}>
                            Add Post
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {!isAdding && (
                <button onClick={() => setIsAdding(true)}>
                    Add New Post
                </button>
            )}
        </div>
    </>
);

  };


export default PostsList;