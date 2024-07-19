import React, { useEffect, useState } from 'react';
import './EmailDisplay.css';

const EmailDisplay: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        setEmail(storedEmail);
    }, []);

    return (
        <div className="email-display">
            {email ? (
                <p>{email}</p>
            ) : (
                <p>No email found</p>
            )}
        </div>
    );
};

export default EmailDisplay;
