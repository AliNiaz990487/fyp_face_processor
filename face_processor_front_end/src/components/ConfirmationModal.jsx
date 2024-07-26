function ConfirmationModal({ show, onConfirm, onCancel }) {
  return (
    <div className={`modal ${show ? 'show d-block' : 'd-none'}`} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Close</h5>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to close this modal?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
