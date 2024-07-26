
function ProcessedImageModal({ show, onHide, processedImage, gender, onEdit, onDownload }) {
    return (
        <div className={`modal ${show ? 'show d-block' : 'd-none'}`} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-success">
                        <h1 className="modal-title fs-3 text-white">Gender: <strong>{gender}</strong></h1>
                        <button type="button" className="btn-close fs-3" onClick={onHide} aria-label="Close"></button>
                    </div>
                    <div className="modal-body bg-success-subtle d-flex justify-content-center">
                        <img src={processedImage} className="img-fluid" alt="processed" />
                    </div>
                    <div className="modal-footer bg-success-subtle">
                        <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={onEdit}>Edit</button>
                        <button type="button" className="btn btn-primary" onClick={onDownload}>Download</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProcessedImageModal;
