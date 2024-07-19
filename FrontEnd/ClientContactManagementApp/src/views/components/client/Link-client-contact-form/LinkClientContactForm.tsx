import React, { useEffect, useState } from 'react';
import './LinkClientContactForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { IClientContact } from '../../../../EndPoints/models/ClientContact';
import NoDataMessage from '../../../../shared-components/no-data/NoDataMessage';
import Pagination from '../../../../shared-components/pagination/Pagination'; // Assuming Pagination component is correctly implemented

interface IProps {
    setCloseModal?: (value: boolean) => void;
    linkedContacts: any[] | undefined;
}

const LinkClientContactForm = observer(({ setCloseModal, linkedContacts }: IProps) => {
    const { store, api } = useAppContext();
    const [client, setClient] = useState<IClient>({ ...defaultClient });
    const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const linkedContactIds = (linkedContacts ?? []).map(contact => contact.id); // Providing a default empty array if linkedContacts is undefined

    const contacts = store.contact.all
        .filter((c) => !linkedContactIds.includes(c.asJson.id))
        .map((contact) => contact.asJson);

    const itemsPerPage = 5; // Number of items per page

    // Pagination
    const totalItems = contacts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentContacts = contacts.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        for (const id of selectedContactIds) {
            const LinkClientContact: IClientContact = {
                id: 0,
                clientId: client.id,
                contactId: id
            }
            try {
                await api.clientContact.linkContactToClient(LinkClientContact.clientId, LinkClientContact.contactId);
                onClose();
            } catch (error) {
                console.error('Error linking contact to client:', error);
            }
        }
        window.location.reload(); // Refresh the page (consider more optimal UX)
    };

    const handleCheckboxChange = (id: number) => {
        setSelectedContactIds((prevSelectedIds) =>
            prevSelectedIds.includes(id)
                ? prevSelectedIds.filter((contactId) => contactId !== id)
                : [...prevSelectedIds, id]
        );
    };

    const onClose = () => {
        setClient({ ...defaultClient });
        store.client.clearSelected(); // Clear selected client in MobX store
        if (setCloseModal) {
            setCloseModal(false);
        }
    };

    useEffect(() => {
        if (store.client.selected) {
            setClient(store.client.selected);
        }
    }, [store.client.selected]);

    return (
        <>
            {contacts.length === 0 && <NoDataMessage message="This client is linked to all contacts in the database" />}
            {contacts.length > 0 &&
                <div className="form-container">
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">{selectedContactIds.length > 0 ? `${selectedContactIds.length} contact(s) selected` : "Available contacts"}</label>
                                {currentContacts.map((c) => (
                                    <label key={c.id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedContactIds.includes(c.id)}
                                            onChange={() => handleCheckboxChange(c.id)}
                                        />
                                        {c.name} {c.surname}
                                    </label>
                                ))}
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Create Link(s)
                            </button>
                        </form>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                </div>
            }
        </>
    );
});

export default LinkClientContactForm;
