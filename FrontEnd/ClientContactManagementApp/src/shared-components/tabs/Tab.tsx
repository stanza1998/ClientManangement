import React, { useState } from 'react';
import './TabComponent.css'; // Example CSS for styling tabs
import LogoutButton from '../../views/log-out/Logout';

interface Tab {
    label: string;
    content: React.ReactNode;
}

interface TabComponentProps {
    tabs: Tab[];
}

const TabComponent: React.FC<TabComponentProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    return (
        <div className="tab-component">
            <div className="tab-header">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`tab-item ${index === activeTab ? 'active' : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div className="tab-content">
                <LogoutButton />
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default TabComponent;
