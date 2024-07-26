function ConfirmationModal({ show, onConfirm, onCancel }) {
  return (
    <div className={`modal ${show ? 'show d-block' : 'd-none'}`} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-warning">
            <h5 className="modal-title">Are you sure you want to close?</h5>
          </div>
          <div className="modal-body bg-warning-subtle">
            <p>All of the changes you have made will be lost.</p>
          </div>
          <div className="modal-footer bg-warning-subtle">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onConfirm}>Quit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
