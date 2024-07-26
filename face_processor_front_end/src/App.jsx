import React, { useState } from 'react';
import { IoCamera } from "react-icons/io5";
import { openEditor } from "react-profile";
import "react-profile/themes/default.min.css";
import Loading from "./assets/images/loading.gif";
import "./App.css";
import ProcessedImageModal from './components/ProcessedImageModel';
import InvalidImageModal from './components/InvalidImageModal';
import ConfirmationModal from './components/ConfirmationModal';

function App() {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [invalidImage, setInvalidImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState('#347ed9');
  const [gender, setGender] = useState('none');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleFileChange = (event) => {
    setProcessedImage(null);
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setInvalidImage(false);
      setOriginalImage(file);
      setImage(file);
      console.log("handleFileChange originalImage", originalImage);
    } else {
      setInvalidImage(true);
    }
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('color', hexToRgb(color));

    const response = await fetch('http://localhost:8000/process-image/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setProcessedImage(`data:image/jpeg;base64,${data.image}`);
    setGender(data.gender);
    setIsLoading(false);
    setShowModal(true);
  };

  const handleEditClick = () => {
    console.log("handleEditClick originalImage", originalImage);
    openEditor({ src: originalImage })
      .then((result) => {
        result?.editedImage?.getImageFromBlob().then(async (img) => {
          console.log(image);
          const response = await fetch(img.currentSrc);
          const blob = await response.blob();

          const imageExt = image.name.split(".")[1];
          const file = new File([blob], image.name, { type: `image/${imageExt}` });
          console.log(file);
          setImage(file);
        });
      });
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmClose = () => {
    setShowModal(false);
    setShowConfirmationModal(false);
  };

  const handleCancelClose = () => {
    setShowConfirmationModal(false);
  };

  return (
    <main className="app">
      <form onSubmit={handleSubmit}>
        <div className="image" style={image ? { backgroundImage: `url(${URL.createObjectURL(image)})` } : {}}>
          <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} required />
          <span><IoCamera /></span>
        </div>

        <label>
          Choose background:
          <input type="color" value={color} onChange={handleColorChange} required />
        </label>

        <button type="submit" className="button process-btn">Process with AI</button>
        {image && <button type="button" className="button edit-btn" onClick={handleEditClick}>Edit</button>}
      </form>

      <ProcessedImageModal
        show={showModal}
        onHide={handleCloseModal}
        processedImage={processedImage}
        gender={gender}
      />

      <InvalidImageModal show={invalidImage} onHide={() => setInvalidImage(false)} />

      <ConfirmationModal
        show={showConfirmationModal}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />

      {isLoading && <div className="loading"><img src={Loading} alt="Loading" /></div>}
    </main>
  );
}

export default App;
