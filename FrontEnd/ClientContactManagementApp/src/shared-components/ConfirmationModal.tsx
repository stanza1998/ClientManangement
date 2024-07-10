import React from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title = 'Confirmation',
    message = 'Are you sure you want to proceed?',
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="confirmation-modal">
                <div className="modal-header">
                    <h3>{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-cancel" onClick={onCancel}>
                        No
                    </button>
                    <button className="btn btn-confirm" onClick={onConfirm}>
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
