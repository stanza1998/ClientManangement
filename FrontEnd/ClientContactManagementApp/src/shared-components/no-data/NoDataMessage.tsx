import React from 'react';
import './NoDataMessage.css'; // Import your CSS file for styling

interface NoDataMessageProps {
    message: string; // Message to display when there is no data
}

const NoDataMessage: React.FC<NoDataMessageProps> = ({ message }) => {
    return (
        <div className="no-data-message"> {/* Outer container */}
            <div className="no-data-icon">🚫</div> {/* Icon container */}
            <div className="no-data-text">{message}</div> {/* Text container with message */}
        </div>
    );
};

export default NoDataMessage;
