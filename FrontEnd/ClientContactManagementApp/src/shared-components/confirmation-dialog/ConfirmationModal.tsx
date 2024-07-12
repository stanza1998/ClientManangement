import React from 'react';
import './ConfirmationModal.css'; // Import your CSS file for styling

interface ConfirmationModalProps {
    isOpen: boolean;           // Indicates if the modal is open or closed
    title?: string;            // Optional title for the modal (defaults to 'Confirmation')
    message?: string;          // Optional message to display (defaults to a generic confirmation message)
    onConfirm: () => void;     // Function to be called when the user confirms
    onCancel: () => void;      // Function to be called when the user cancels or closes the modal
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title = 'Confirmation',
    message = 'Are you sure you want to proceed?',
    onConfirm,
    onCancel,
}) => {
    // Render nothing if the modal is not open
    if (!isOpen) return null;

    return (
        <div className="modal-overlay"> {/* Modal overlay to darken the background */}
            <div className="confirmation-modal"> {/* Modal container */}
                <div className="modal-header">
                    <h3>{title}</h3> {/* Modal title */}
                </div>
                <div className="modal-body">
                    <p>{message}</p> {/* Modal message or content */}
                </div>
                <div className="modal-footer">
                    {/* Cancel button */}
                    <button className="btn btn-cancel" onClick={onCancel}>
                        No
                    </button>
                    {/* Confirm button */}
                    <button className="btn btn-confirm" onClick={onConfirm}>
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
