import React from 'react';
import './Loader.css';

const Loader: React.FC = () => {
    return (
        <div className="loader-overlay">
            <div className="loader">
                <div className="loader-inner"></div>
            </div>
        </div>
    );
};

export default Loader;
