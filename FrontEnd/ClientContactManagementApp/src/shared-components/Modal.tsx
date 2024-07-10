import React, { ReactNode, useEffect, useRef } from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        } else {
            document.body.style.overflow = 'auto'; // Enable scrolling when modal is closed
        }
    }, [isOpen]);

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} ref={modalRef} onClick={handleModalClick}>
            <div className={`modal ${isOpen ? 'active' : ''}`}>
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
