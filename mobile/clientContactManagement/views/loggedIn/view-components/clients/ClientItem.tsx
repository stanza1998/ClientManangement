// src/components/ClientItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ClientItemProps {
    name: string;
    code: string;
    numberOfContacts: number;
}

const ClientItem: React.FC<ClientItemProps> = ({ name, code, numberOfContacts }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>Client Full Name: {name}</Text>
            <Text style={styles.code}>Client Code: {code}</Text>
            <Text style={styles.contacts}>No. of linked contacts: {numberOfContacts}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
   
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
      
    },
    code: {
        fontSize: 16,
        color: '#666',
    },
    contacts: {
        fontSize: 16,
        color: '#666',
    },
});

export default ClientItem;
