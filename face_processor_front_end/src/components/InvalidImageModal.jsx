
function InvalidImageModal({ show, onHide }) {
  return (
    <div className={`modal ${show ? 'show d-block' : 'd-none'}`} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} tabIndex="-1" onClick={onHide}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header bg-danger">
            <h5 className="modal-title fs-3 fw-bold text-white">Invalid Image</h5>
            <button type="button" className="btn-close fs-3" onClick={onHide}></button>
          </div>
          <div className="modal-body bg-danger-subtle fs-4">
            <p>Please upload a valid image file (JPEG or PNG).</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvalidImageModal;
