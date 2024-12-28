import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateCommunity.css';
import Modal from '../../components/Modal/success'; // Import the Modal component

const CreateCommunity = () => {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [preview, setPreview] = useState('');
  const [userID, setUserID] = useState(''); // Assuming you fetch the user ID from MetaMask or session
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const resizeAndCropImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const size = 1024;
          const width = img.width;
          const height = img.height;

          if (width > height) {
            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(img, (width - height) / 2, 0, height, height, 0, 0, size, size);
          } else {
            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(img, 0, (height - width) / 2, width, width, 0, 0, size, size);
          }

          canvas.toBlob((blob) => {
            const newFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(newFile);
          }, 'image/jpeg');
        };
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const resizedImage = await resizeAndCropImage(file);
        setIcon(resizedImage);
        setPreview(URL.createObjectURL(resizedImage));
      } catch (error) {
        showModalMessage('Error resizing and cropping the image', false);
      }
    } else {
      showModalMessage('Please upload a valid image file', false);
      setIcon(null);
      setPreview('');
    }
  };

  const showModalMessage = (message, success) => {
    setModalMessage(message);
    setIsSuccess(success);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append('category', category);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('icon', icon);
    formData.append('userID', userID);
    formData.append('createdAt', new Date().toISOString());

    try {
      const response = await axios.post('http://localhost:3000/communities', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showModalMessage('Community created successfully', true);
      setCategory('');
      setName('');
      setDescription('');
      setIcon(null);
      setPreview('');

      navigate('/community');
    } catch (error) {
      console.error('Error creating community:', error);
      showModalMessage('Failed to create community', false);
    }
  };

  return (
    <div className="create-community-container">
      <form className="create-community-form" onSubmit={handleSubmit}>
        <div>
          <h2 className="form-title">Create a Community</h2>
          <label>Category</label>
          <input
            type="text"
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Name</label>
          <input
            type="text"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            className="textarea-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label>Community Icon</label>
          <input
            type="file"
            className="file-input"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        {preview && (
          <div className="image-preview">
            <h3>Image Preview</h3>
            <img src={preview} alt="Selected Icon" className="preview-image" />
          </div>
        )}

        <button type="submit" className="submit-button">
          Create Community
        </button>
      </form>

      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} isSuccess={isSuccess} />}
    </div>
  );
};

export default CreateCommunity;
