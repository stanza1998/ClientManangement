// src/components/TabComponent.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabComponentProps {
    tabs: string[];
    onTabPress: (tab: string) => void;
    activeTab: string;
}

const TabComponent: React.FC<TabComponentProps> = ({ tabs, onTabPress, activeTab }) => {

    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => onTabPress(tab)}
                >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tab: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,

    },
    activeTab: {
        backgroundColor: '#01aced',
        width: '50%'
    },
    tabText: {
        fontSize: 16,
        color: '#333',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default TabComponent;
