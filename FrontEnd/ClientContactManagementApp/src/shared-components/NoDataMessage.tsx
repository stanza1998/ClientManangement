import React from 'react';
import './NoDataMessage.css';

interface NoDataMessageProps {
    message: string;
}

const NoDataMessage: React.FC<NoDataMessageProps> = ({ message }) => {
    return (
        <div className="no-data-message">
            <p>{message}</p>
        </div>
    );
};

export default NoDataMessage;
