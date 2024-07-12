import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
    errorMessage: string;
    onClose?: () => void; // Optional prop for handling close event
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage, onClose }) => {
    return (
        <div className="error-message">
            <p className="error-text">{errorMessage}</p>
            {onClose && (
                <span className="close-icon" onClick={onClose}>
                    &times;
                </span>
            )}
        </div>
    );
};

export default ErrorMessage;
