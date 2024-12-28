import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./AddPost.css";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.getAccounts().then((accounts) => {
        setUsername(accounts[0]);
      });
    }
  }, []);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);

    // Generate file previews
    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );
    setMediaPreviews(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("postName", title);
    formData.append("content", content);

    for (let i = 0; i < media.length; i++) {
      formData.append("media", media[i]);
    }

    fetch("http://localhost:3000/posts", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post created:", data);
        setTitle("");
        setContent("");
        setMedia([]);
        setMediaPreviews([]); // Clear previews
      })
      .catch((error) => console.error("Error creating post:", error));
  };

  const handleRemovePreview = (index) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    const updatedPreviews = mediaPreviews.filter((_, i) => i !== index);

    setMedia(updatedMedia);
    setMediaPreviews(updatedPreviews);
  };

  return (
    <div className="add-post-container">
      <form className="add-post-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Create a Post</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          required
        />
        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea-field"
          required
        ></textarea>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaChange}
          className="file-input"
          multiple
        />

        {/* Media Preview Section */}
        <div className="media-preview-container">
          {mediaPreviews.map((preview, index) => (
            <div key={index} className="media-preview-item">
              {media[index].type.startsWith("image") ? (
                <img
                  src={preview}
                  alt={`media-${index}`}
                  className="media-preview-image"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="media-preview-video"
                />
              )}
              <button
                type="button"
                className="remove-media-button"
                onClick={() => handleRemovePreview(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-button">
          Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
