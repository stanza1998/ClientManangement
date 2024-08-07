import React, { useState } from 'react';
import './Logout.css'; // Import the CSS file

const LogoutButton: React.FC = () => {

 

    const handleLogout = async () => {
        try {
            // Retrieve email from local storage
            const email = localStorage.getItem('email'); // Adjust the key based on your local storage setup
            console.log("🚀 ~ handleLogout ~ email:", email)

            if (!email) {
                return;
            }

            const response = await fetch('https://localhost:7286/api/Auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // You might need to include authorization headers if required by your backend
                    // 'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(email)
            });

            if (!response.ok) {

                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Perform any client-side logout actions if necessary (e.g., clear local storage)
            // localStorage.removeItem('email'); // Clear the email from local storage
            console.log('Logout successful');
            window.location.reload();
        } catch (error) {
        }
    };

    return (
        <button className="logout-button" onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
