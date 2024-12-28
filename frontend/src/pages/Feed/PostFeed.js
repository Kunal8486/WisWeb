import React, { useState, useEffect } from "react";
import "./PostFeed.css";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({}); // State to track expanded posts

  useEffect(() => {
    // Fetch posts from the backend
    fetch("http://localhost:3000/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const toggleReadMore = (postId) => {
    setExpandedPosts((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleUpVote = (postId, type) => {
    fetch(`http://localhost:3000/posts/${postId}/${type}`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likes: type === "like" ? data.likes : data.likes - 1 }
              : post
          )
        );
      })
      .catch((error) => console.error("Error voting on post:", error));
  };

  const handleDownVote = (postId, type) => {
    fetch(`http://localhost:3000/posts/${postId}/${type}`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                ...post,
                downvotes:
                  type === "downvotes" ? data.downvotes : data.downvotes - 1,
              }
              : post
          )
        );
      })
      .catch((error) => console.error("Error voting on post:", error));
  };

  const handleComment = (postId, username, text) => {
    fetch(`http://localhost:3000/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, text }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: data.post.comments }
              : post
          )
        );
      })
      .catch((error) => console.error("Error commenting on post:", error));
  };

  return (
    <div className="post-feed-container">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <p className="post-username">By: {post.username || "Anonymous"}</p>
          <h2 className="post-title">{post.postName || "Untitled Post"}</h2>
          <p className="post-content">
            {post.content && post.content.length > 500 && !expandedPosts[post._id]
              ? `${post.content.substring(0, 500).trim().replace(/\s+\S*$/, "")}...`
              : post.content || "No content available."}
          </p>
          {post.content && post.content.length > 500 && (
            <button
              className="read-more-button"
              onClick={() => toggleReadMore(post._id)}
            >
              {expandedPosts[post._id] ? "Read Less" : "Read More"}
            </button>
          )}


          {post.media && post.media.length > 0 && (
            <MediaSlider media={post.media} />
          )}

          <div className="post-actions">
            <button
              className="vote-button"
              onClick={() => handleUpVote(post._id, "like")}
            >
              <img
                src="../assets/upvote.svg"
                alt="Upvote"
                className="vote-icon"
              />{" "}
              {post.likes || 0}
            </button>
            <button
              className="vote-button"
              onClick={() => handleDownVote(post._id, "downvotes")}
            >
              <img
                src="../assets/downvote.svg"
                alt="Downvote"
                className="vote-icon"
              />{" "}
              {post.downvotes || 0}
            </button>
          </div>

          <div className="comment-section">
            <CommentSection
              comments={post.comments || []}
              postId={post._id}
              onComment={handleComment}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const MediaSlider = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + media.length) % media.length
    );
  };

  return (
    <div className="media-slider">
      {media[currentIndex].endsWith(".mp4") ||
        media[currentIndex].endsWith(".webm") ||
        media[currentIndex].endsWith(".ogg") ? (
        <video
          src={`http://localhost:3000${media[currentIndex]}`}
          controls
          className="slider-media"
        />
      ) : (
        <img
          src={`http://localhost:3000${media[currentIndex]}`}
          alt="Post Media"
          className="slider-media"
        />
      )}
      {media.length > 1 && (
        <div className="slider-controls">
          <button onClick={handlePrev} className="slider-button">
            ◀
          </button>
          <button onClick={handleNext} className="slider-button">
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

const CommentSection = ({ comments, postId, onComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== "") {
      onComment(postId, "Anonymous", newComment);
      setNewComment("");
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <p key={index}>
            <strong>{comment.username || "Anonymous"}:</strong> {comment.text}
          </p>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
        />
        <button type="submit" className="comment-button">
          Comment
        </button>
      </form>
    </div>
  );
};

export default PostFeed;
