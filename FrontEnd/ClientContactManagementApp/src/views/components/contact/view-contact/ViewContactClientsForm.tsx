import React, { useEffect, useState } from 'react';
import './ViewContactClientForm.css';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { getContactClientsById } from '../../../../helper-functions/GetAllLinkedData';
import NoDataMessage from '../../../../shared-components/no-data/NoDataMessage';
import TabComponentSub from '../../../../shared-components/tabs/SubTab';
import LinkContactClientForm from '../Link-contact-client-form/LinkContactClientForm';
import { IContact, defaultContact } from '../../../../EndPoints/models/Contact';

interface IProps {
    setCloseModal: (value: boolean) => void;
}

const ViewContactClientForm = observer(({ setCloseModal }: IProps) => {
    const { store, api } = useAppContext();
    const [contact, setContact] = useState<IContact>({ ...defaultContact });
    const [clients, setClients] = useState<any[]>([]);

    // Function to handle unlinking a client from the contact
    const handleUnlinked = async (clientId: number) => {
        try {
            await api.clientContact.unlinkContactClientToContact(contact.id, clientId);
            window.location.reload(); // Temporary solution for updating UI
        } catch (error) {
            console.error('Error unlinking contact from client:', error);
            // Handle error state or display error message to the user
        }
    };

    // Fetches data (clients linked to the contact) when the contact changes
    useEffect(() => {
        const loadData = async () => {
            if (contact.id) {
                const loadedClients = await getContactClientsById(contact.id);
                setClients(loadedClients);
            }
        };
        loadData();
    }, [contact]);

    // Updates the local contact state when the selected contact changes in the store
    useEffect(() => {
        if (store.contact.selected) {
            setContact(store.contact.selected);
        }
    }, [store.contact.selected]);

    // Tabs configuration for displaying different sections of the contact-client view
    const tabs = [
        {
            label: 'General',
            content: (
                <div className="general-info-container">
                    <h2>General Information</h2>
                    <div className="form-group">
                        <p><span>Full Name:</span> {contact.name}</p>
                    </div>
                    <div className="form-group">
                        <p><span>Email:</span> {contact.email}</p>
                    </div>
                </div>
            )
        },
        {
            label: 'Client(s)',
            content: (
                <div>
                    <div className="form-group">
                        {clients.length === 0 && <NoDataMessage message='No Client(s) found' />}
                        {clients.length > 0 && (
                            <div style={{ width: '100%' }}>
                                <label htmlFor="name">Linked clients:</label>
                                <table className="clients-table">
                                    <thead>
                                        <tr>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map((client) => (
                                            <tr key={client.id}>
                                                <td>{client.name}</td>
                                                <td>{client.clientCode}</td>
                                                <td>
                                                    <a href='#!' onClick={() => handleUnlinked(client.id)}>Unlink contact</a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            label: 'Link to client(s)',
            content: <LinkContactClientForm linkedClients={clients} />
        }
    ];

    // Renders the component using TabComponentSub with the configured tabs
    return (
        <TabComponentSub tabs={tabs} />
    );
});

export default ViewContactClientForm;
