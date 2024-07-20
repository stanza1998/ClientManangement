// src/components/ContactItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ContactItemProps {
    name: string;
    surname: string;
    email: string;
    numberOfLinkedContacts: number;
}

const ContactItem: React.FC<ContactItemProps> = ({ name, surname, email, numberOfLinkedContacts }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{name} {surname}</Text>
            <Text style={styles.email}>Email: {email}</Text>
            <Text style={styles.linkedContacts}>Linked Contacts: {numberOfLinkedContacts}</Text>
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
    email: {
        fontSize: 16,
        color: '#666',
    },
    linkedContacts: {
        fontSize: 16,
        color: '#666',
    },
});

export default ContactItem;
