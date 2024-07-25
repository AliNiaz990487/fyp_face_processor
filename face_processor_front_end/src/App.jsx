import React, { useState } from 'react';
import { IoCamera } from "react-icons/io5";
import ReactProfile from "react-profile";
import "react-profile/themes/default.min.css";
import Loading from "./assets/images/loading.gif";
import "./App.css";

let count = 1;

function App() {
  const [image, setImage] = useState(null);
  const [color, setColor] = useState('#347ed9');
  const [processedImage, setProcessedImage] = useState(null);
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invalidImage, setInvalidImage] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const handleFileChange = (event) => {
    setProcessedImage(null);
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) { 
      setInvalidImage(false);
      setImage(file);
    } else {
      setInvalidImage(true);
      setImage(null);
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
  };

  const handleEditClick = () => {
    setShowProfileEditor(true);
  };

  console.log(`rendered ${count}`);
  count += 1;

  return (
    <main className="app">
      <form onSubmit={handleSubmit}>
        <div className="image" style={image && { backgroundImage: `url(${URL.createObjectURL(image)})` }}>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          <span><IoCamera /></span>
        </div>

        <label>
          Choose background:
          <input type="color" value={color} onChange={handleColorChange} required />
        </label>

        <button type="submit" className="btn process-btn">Process with AI</button>
        {image && <button type="button" className="btn edit-btn" onClick={handleEditClick}>Edit</button>}
      </form>

      {showProfileEditor && image && (
        <ReactProfile src={URL.createObjectURL(image)} />
      )}

      {processedImage && !isLoading && (
        <div>
          <h2>Processed Image:</h2>
          <img src={processedImage} alt="Processed" />
          <p>Gender: {gender}</p>
        </div>
      )}
      {isLoading && <div className="loading"><img src={Loading} alt="Loading" /></div>}
      {invalidImage && <p>Please upload a valid image file (JPEG or PNG).</p>}
    </main>
  );
}

export default App;
