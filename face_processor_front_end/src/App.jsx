import React, { useState } from 'react';
import { IoCamera } from "react-icons/io5";
import { openEditor } from "react-profile";
import "react-profile/themes/default.min.css";
import Loading from "./assets/images/loading.gif";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [color, setColor] = useState('#347ed9');
  const [processedImage, setProcessedImage] = useState(null);
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invalidImage, setInvalidImage] = useState(false);

  const handleFileChange = (event) => {
    setProcessedImage(null);
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) { 
      setInvalidImage(false);
      setImage(file);
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
  };

  const handleEditClick = () => {
    openEditor({ src: image })
      .then((result) => {
        result?.editedImage?.getImageFromBlob().then(async (img) => {
          console.log(image)
          const response = await fetch(img.currentSrc)
          const blob = await response.blob()
          
          const imageExt = image.name.split(".")[1]
          const file = new File([blob], image.name, {type: `image/${imageExt}`})
          console.log(file)
          setImage(file)
          
        })
      });
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

      {processedImage && !isLoading && (
        <div>
          <h2>Processed Image:</h2>
          <img src={processedImage} alt="Processed" />
          <p>Gender: {gender}</p>
        </div>
      )}
      {isLoading && <div className="loading"><img src={Loading} alt="Loading" /></div>}
      {invalidImage && (
        <div className="modal show d-block" style={{backgroundColor: "rgba(0, 0, 0, 0.5"}} tabIndex="-1" onClick={() => setInvalidImage(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-danger">
                <h5 className="modal-title fs-3 fw-bold text-white">Invalid Image</h5>
                <button type="button" className="btn-close fs-3" onClick={() => setInvalidImage(false)}></button>
              </div>
              <div className="modal-body bg-danger-subtle fs-4">
                <p>Please upload a valid image file (JPEG or PNG).</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
