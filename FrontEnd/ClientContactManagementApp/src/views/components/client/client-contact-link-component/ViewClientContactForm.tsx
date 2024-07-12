import React, { useEffect, useState } from 'react';
import './ViewClientContactForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import TabComponentSub from '../../../../shared-components/tabs/SubTab';
import { getClientContactsById } from '../../../../helper-functions/GetAllLinkedData';
import LinkClientContactForm from '../link-client-contact-form/LinkClientContactForm';
import NoDataMessage from '../../../../shared-components/no-data/NoDataMessage';
import Pagination from '../../../../shared-components/pagination/Pagination';

interface IProps {
    setCloseModal: (value: boolean) => void;
}

const ViewClientContactForm: React.FC<IProps> = observer(({ setCloseModal }) => {
    const { store, api } = useAppContext();
    const [client, setClient] = useState<IClient>({ ...defaultClient });
    const [contacts, setContacts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Function to handle unlinking a contact from the client
    const handleUnlinked = async (contactId: number) => {
        try {
            await api.clientContact.unlinkContactToClient(client.id, contactId);
            window.location.reload(); // Reload the page after unlinking
        } catch (error) {
            // Handle error
            console.error('Error unlinking contact from client:', error);
        }
    };

    // Function to handle modal closure
    const onClose = () => {
        setClient({ ...defaultClient }); // Reset client state
        store.client.clearSelected(); // Clear selected client in MobX store
        setCloseModal(false); // Close the modal
    };

    // Fetches data (contacts linked to the client) when the client changes
    useEffect(() => {
        const loadData = async () => {
            if (client.id) {
                const loadedContacts = await getClientContactsById(client.id);
                setContacts(loadedContacts);
            }
        };
        loadData();
    }, [client]);

    // Updates the local client state when the selected client changes in the store
    useEffect(() => {
        if (store.client.selected) {
            setClient(store.client.selected);
        }
    }, [store.client.selected]);

    // Pagination
    const itemsPerPage = 5; // Number of items per page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentContacts = contacts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(contacts.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Tabs configuration for displaying different sections of the client-contact view
    const tabs = [
        {
            label: 'General',
            content: (
                <div className="general-info-container">
                    <h2>General Information</h2>
                    <div className="form-group">
                        <p><span>Name:</span> {client.name}</p>
                    </div>
                    <div className="form-group">
                        <p><span>Client Code:</span> {client.clientCode}</p>
                    </div>
                </div>
            )
        },
        {
            label: 'Contact(s)',
            content: (
                <div>
                    <div className="form-group">
                        {contacts.length === 0 && <NoDataMessage message='No Contact(s) found' />} {/* Show message if no contacts */}
                        {contacts.length > 0 && (
                            <div style={{ width: '100%' }}>
                                <label htmlFor="name">Available contacts:</label>
                                <table className="clients-table">
                                    <thead>
                                        <tr>
                                            <th>Contact Full Name</th>
                                            <th>Contact email address</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentContacts.map((contact) => (
                                            <tr key={contact.id}>
                                                <td>{`${contact.name} ${contact.surname}`}</td>
                                                <td>{contact.email}</td>
                                                <td>
                                                    <a href='#!' onClick={() => handleUnlinked(contact.id)}>Unlink contact</a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            label: "Link to contact",
            content: <LinkClientContactForm linkedContacts={contacts} />, // Render LinkClientContactForm with linked contacts
        },
    ];

    // Renders the component using TabComponentSub with the configured tabs
    return (
        <TabComponentSub tabs={tabs} /> // Render TabComponentSub with defined tabs
    );
});

export default ViewClientContactForm;
