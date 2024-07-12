import React, { useState } from 'react';
import './TabComponent.css';

interface Tab {
    label: string;
    content: React.ReactNode;
}

interface TabComponentProps {
    tabs: Tab[];
}

const TabComponentSub: React.FC<TabComponentProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    return (
        <div className="sub-tab-component">
            <div className="sub-tab-header">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`sub-tab-item ${index === activeTab ? 'active' : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div className="sub-tab-content">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default TabComponentSub;
