import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, Modal, TextInput, TouchableOpacity } from 'react-native';

// Contact Interface
interface Contact {
    id: string;
    name: string;
    surname: string;
    email: string;
}

// Sample contact data
const contacts: Contact[] = Array.from({ length: 50 }, (_, index) => ({
    id: (index + 1).toString(),
    name: `First ${index + 1}`,
    surname: `Last ${index + 1}`,
    email: `email${index + 1}@example.com`,
}));

// ContactItem Component
const ContactItem: React.FC<{ contact: Contact; onPress: (contact: Contact) => void }> = ({ contact, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={() => onPress(contact)}>
        <Text style={styles.itemText}>Name: {contact.name}</Text>
        <Text style={styles.itemText}>Surname: {contact.surname}</Text>
        <Text style={styles.itemText}>Email: {contact.email}</Text>
    </TouchableOpacity>
);

// Contacts Component
const Contacts: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    // Handle modal visibility
    const handleCreatePress = () => setIsModalVisible(true);
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setName('');
        setSurname('');
        setEmail('');
    };

    // Handle saving a new contact
    const handleSaveContact = () => {
        console.log('New Contact:', { name, surname, email });
        handleCloseModal(); // Optionally handle saving contact data here
    };

    // Handle viewing contact details
    const handleContactPress = (contact: Contact) => {
        setSelectedContact(contact);
        setIsDetailsModalVisible(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalVisible(false);
        setSelectedContact(null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <TouchableOpacity onPress={handleCreatePress} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add Contact</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ContactItem
                        contact={item}
                        onPress={handleContactPress}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />

            {/* Add Contact Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Contact</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Surname"
                            value={surname}
                            onChangeText={setSurname}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleSaveContact}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Contact Details Modal */}
            <Modal
                visible={isDetailsModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseDetailsModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedContact && (
                            <>
                                <Text style={styles.modalTitle}>Contact Details</Text>
                                <Text style={styles.itemText}>Name: {selectedContact.name}</Text>
                                <Text style={styles.itemText}>Surname: {selectedContact.surname}</Text>
                                <Text style={styles.itemText}>Email: {selectedContact.email}</Text>
                            </>
                        )}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleCloseDetailsModal}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#f5f5f5',
    },
    toolbar: {
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    addButton: {
        backgroundColor: '#01aced',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 16,
    },
    listContent: {
        flexGrow: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#01aced',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Contacts;
