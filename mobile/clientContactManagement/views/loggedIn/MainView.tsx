// src/screens/MainView.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabComponent from './shared-component/Tab';
import Clients from './view-components/clients/Clients';
import Contacts from './view-components/contacts/Contacts';

const MainView: React.FC = () => {
    const tabs = ['Clients', 'Contacts'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Clients':
                return <Clients />;
            case 'Contacts':
                return <Contacts />;
            default:
                return <Clients />;
        }
    };

    return (
        <View style={styles.container}>
            <TabComponent tabs={tabs} onTabPress={handleTabPress} activeTab={activeTab} />
            <View style={styles.content}>
                {renderContent()}
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "80%",
        // padding: 20,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    screen: {
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});

export default MainView;
