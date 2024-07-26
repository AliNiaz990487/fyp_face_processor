
function ProcessedImageModal({ show, onHide, processedImage, gender }) {
  return (
    <div className={`modal ${show ? 'show d-block' : 'd-none'}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Gender: {gender}</h1>
            <button type="button" className="btn-close" onClick={onHide} aria-label="Close"></button>
          </div>
          <div className="modal-body m-auto">
            <img src={processedImage} className="img-fluid" alt="processed" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
            <button type="button" className="btn btn-primary">Edit</button>
            <button type="button" className="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcessedImageModal;
