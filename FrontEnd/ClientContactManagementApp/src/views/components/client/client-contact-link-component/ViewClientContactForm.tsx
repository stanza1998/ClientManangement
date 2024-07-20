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
import Toolbar from '../../../../shared-components/toolbar/ToolBar';


interface IProps {
    setCloseModal: (value: boolean) => void;
}

const ViewClientContactForm: React.FC<IProps> = observer(({ setCloseModal }) => {
    const { store, api } = useAppContext();
    const [client, setClient] = useState<IClient>({ ...defaultClient });
    const [contacts, setContacts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);

    // Function to handle unlinking a contact from the client
    const handleUnlinked = async (contactId: number) => {
        try {
            await api.clientContact.unlinkContactToClient(client.id, contactId);
            window.location.reload(); // Reload the page after unlinking
        } catch (error) {
            // Handle error
        }
    };

    const unLinkSelectedContacts = async () => {
        try {
            await Promise.all(selectedContactIds.map(async (id) => {
                await api.clientContact.unlinkContactToClient(client.id, id);
            }));
            window.location.reload(); // Reload the page after all unlinking operations are complete
        } catch (error) {
            // Handle error
        }
    };






    const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setSelectAll(isChecked);
        if (isChecked) {
            const allContactIds = currentContacts.map(contact => contact.id);
            setSelectedContactIds(allContactIds);
        } else {
            setSelectedContactIds([]);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, contactId: number) => {
        const isChecked = e.target.checked;
        setSelectedContactIds(prevSelectedContactIds => {
            if (isChecked) {
                return [...prevSelectedContactIds, contactId];
            } else {
                return prevSelectedContactIds.filter(id => id !== contactId);
            }
        });
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

    const rightItems = [
        <div key="1">
            <button className="btn btn-primary-outline" onClick={unLinkSelectedContacts}>Unlink </button>
        </div>
    ];

    const leftItems = [<div key="1">Unlink selected contacts</div>];
    const centerItems: JSX.Element[] = [];

    // Tabs configuration for displaying different sections of the client-contact view
    const tabs = [
        {
            label: <div>General</div>,
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
            label: <div>Contact(s)</div>,
            content: (
                <div>
                    <div>
                        {selectedContactIds.length > 0 &&
                            <Toolbar leftItems={leftItems} centerItems={centerItems} rightItems={rightItems} />
                        }
                    </div>
                    <div className="form-group">
                        {contacts.length === 0 && <NoDataMessage message='No Contact(s) found' />} {/* Show message if no contacts */}
                        {contacts.length > 0 && (
                            <div style={{ width: '100%' }}>
                                <label htmlFor="name">Available contacts:</label>
                                <table className="clients-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type='checkbox'
                                                    checked={selectAll}
                                                    onChange={handleSelectAllChange}
                                                />
                                            </th>
                                            <th>Contact Full Name</th>
                                            <th>Contact email address</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentContacts.map((contact) => (
                                            <tr key={contact.id}>
                                                <td>
                                                    <input
                                                        type='checkbox'
                                                        checked={selectedContactIds.includes(contact.id)}
                                                        onChange={(e) => handleCheckboxChange(e, contact.id)}
                                                    />
                                                </td>
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
            label: <div>Link to contact</div>,
            content: <LinkClientContactForm linkedContacts={contacts} />, // Render LinkClientContactForm with linked contacts
        },
    ];

    // Renders the component using TabComponentSub with the configured tabs
    return (
        <TabComponentSub tabs={tabs} /> // Render TabComponentSub with defined tabs
    );
});

export default ViewClientContactForm;
