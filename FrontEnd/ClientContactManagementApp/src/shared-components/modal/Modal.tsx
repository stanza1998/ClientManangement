import React, { ReactNode, useEffect, useRef } from 'react';
import './Modal.css'; // Import your CSS file for styling

interface ModalProps {
    isOpen: boolean;        // Indicates whether the modal is open or closed
    onClose: () => void;    // Function to handle closing the modal
    children: ReactNode;    // Content to display inside the modal (can be any ReactNode)
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null); // Reference to the modal DOM element

    useEffect(() => {
        // Effect to handle body scrolling based on modal open state
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        } else {
            document.body.style.overflow = 'auto';   // Enable scrolling when modal is closed
        }

        // Cleanup function to reset body overflow when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Function to handle clicks on the modal overlay (outside modal content)
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current === e.target) {
            onClose(); // Close the modal if the click is outside the modal content
        }
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} ref={modalRef} onClick={handleModalClick}>
            {/* Modal container */}
            <div className={`modal ${isOpen ? 'active' : ''}`}>
                {/* Close button */}
                <button className="modal-close-btn" onClick={onClose}>
                    &times; {/* Close icon (X symbol) */}
                </button>
                {/* Modal content */}
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
