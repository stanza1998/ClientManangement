import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, Button, Modal, TextInput, TouchableOpacity } from 'react-native';
import Toolbar from '../../shared-component/Toolbar';

interface Client {
    id: string;
    name: string;
    code: string;
    numberOfContacts: number;
}

// Sample client data
const clients: Client[] = Array.from({ length: 50 }, (_, index) => ({
    id: (index + 1).toString(),
    name: `Client ${String.fromCharCode(65 + (index % 26))}`,
    code: `${String.fromCharCode(65 + (index % 26))}${Math.floor(Math.random() * 1000)}`,
    numberOfContacts: Math.floor(Math.random() * 10) + 1,
}));

const ClientItem: React.FC<{ client: Client; onPress: (client: Client) => void }> = ({ client, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={() => onPress(client)}>
        <Text style={styles.itemText}>{client.name}</Text>
        <Text style={styles.itemText}>{client.code}</Text>
        <Text style={styles.itemText}>Contacts: {client.numberOfContacts}</Text>
    </TouchableOpacity>
);

const Clients: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [clientName, setClientName] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const handleCreatePress = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setClientName(''); // Clear input field on close
    };

    const handleSaveClient = () => {
        console.log('Client Name:', clientName);
        handleCloseModal(); // Optionally handle saving client data here
    };

    const handleClientPress = (client: Client) => {
        setSelectedClient(client);
        setIsDetailsModalVisible(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalVisible(false);
        setSelectedClient(null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <TouchableOpacity onPress={handleCreatePress} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add Client</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={clients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ClientItem
                        client={item}
                        onPress={handleClientPress}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />

            {/* Add Client Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Client</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter client name"
                            value={clientName}
                            onChangeText={setClientName}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleSaveClient}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Client Details Modal */}
            <Modal
                visible={isDetailsModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseDetailsModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedClient && (
                            <>
                                <Text style={styles.modalTitle}>Client Details</Text>
                                <Text style={styles.itemText}>Name: {selectedClient.name}</Text>
                                <Text style={styles.itemText}>Code: {selectedClient.code}</Text>
                                <Text style={styles.itemText}>Contacts: {selectedClient.numberOfContacts}</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#f5f5f5',
    },
    toolbar: {
        marginBottom: 10,
        backgroundColor: 'white',
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
        marginBottom: 20,
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

export default Clients;
