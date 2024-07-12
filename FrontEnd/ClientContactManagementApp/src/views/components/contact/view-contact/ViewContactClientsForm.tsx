import React, { useEffect, useState } from 'react';
import './ViewContactClientForm.css';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { getContactClientsById } from '../../../../helper-functions/GetAllLinkedData';
import NoDataMessage from '../../../../shared-components/no-data/NoDataMessage';
import TabComponentSub from '../../../../shared-components/tabs/SubTab';
import LinkContactClientForm from '../Link-contact-client-form/LinkContactClientForm';
import { IContact, defaultContact } from '../../../../EndPoints/models/Contact';
import Pagination from '../../../../shared-components/pagination/Pagination';

interface IProps {
    setCloseModal: (value: boolean) => void;
}

const ViewContactClientForm: React.FC<IProps> = observer(({ setCloseModal }) => {
    const { store, api } = useAppContext();
    const [contact, setContact] = useState<IContact>({ ...defaultContact });
    const [clients, setClients] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

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

    // Pagination
    const itemsPerPage = 5; // Number of items per page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(clients.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                                        {currentClients.map((client) => (
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
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            label: 'Link to client(s)',
            content: <LinkContactClientForm linkedClients={clients} setCloseModal={setCloseModal} />
        }
    ];

    // Renders the component using TabComponentSub with the configured tabs
    return (
        <TabComponentSub tabs={tabs} />
    );
});

export default ViewContactClientForm;
