import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }) => {
  return (
    <div className="error-message">
      <p className="error-text">{errorMessage}</p>
    </div>
  );
};

export default ErrorMessage;
