import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
    leftItems: React.ReactNode[];
    centerItems: React.ReactNode[];
    rightItems: React.ReactNode[];
}

const Toolbar: React.FC<ToolbarProps> = ({ leftItems, centerItems, rightItems }) => {
    return (
        <div className="toolbar">
            <div className="toolbar-section toolbar-left">
                {leftItems.map((item, index) => (
                    <div key={index} className="toolbar-item">{item}</div>
                ))}
            </div>
            <div className="toolbar-section toolbar-center">
                {centerItems.map((item, index) => (
                    <div key={index} className="toolbar-item">{item}</div>
                ))}
            </div>
            <div className="toolbar-section toolbar-right">
                {rightItems.map((item, index) => (
                    <div key={index} className="toolbar-item">{item}</div>
                ))}
            </div>
        </div>
    );
};

export default Toolbar;
