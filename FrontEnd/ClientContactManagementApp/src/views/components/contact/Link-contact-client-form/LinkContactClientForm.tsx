import React, { useEffect, useState } from 'react';
import './LinkContactClientForm.css';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { IClientContact } from '../../../../EndPoints/models/ClientContact';
import NoDataMessage from '../../../../shared-components/no-data/NoDataMessage';
import { IContact, defaultContact } from '../../../../EndPoints/models/Contact';
import Pagination from '../../../../shared-components/pagination/Pagination'; // Assuming Pagination component is correctly implemented

interface IProps {
    setCloseModal?: (value: boolean) => void;
    linkedClients: any[] | undefined;
}

const LinkContactClientForm: React.FC<IProps> = observer(({ setCloseModal, linkedClients }) => {
    const { store, api } = useAppContext();
    const [contact, setContact] = useState<IContact>({ ...defaultContact });
    const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const linkedClientsIds = (linkedClients ?? []).map(contact => contact.id); // Providing a default empty array if linkedClients is undefined

    const clients = store.client.all
        .filter((c) => !linkedClientsIds.includes(c.asJson.id))
        .map((contact) => contact.asJson);

    const itemsPerPage = 5; // Number of items per page

    // Pagination
    const totalItems = clients.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        for (const id of selectedContactIds) {
            const LinkClientContact: IClientContact = {
                id: 0,
                clientId: contact.id,
                contactId: id
            }
            try {
                await api.clientContact.linkContactClientToContact(LinkClientContact.contactId, LinkClientContact.clientId);
                onClose();
            } catch (error) {
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
        setContact({ ...defaultContact });
        store.client.clearSelected(); // Clear selected client in MobX store
        if (setCloseModal) {
            setCloseModal(false);
        }
    };

    useEffect(() => {
        if (store.contact.selected) {
            setContact(store.contact.selected);
        }
    }, [store.contact.selected]);

    return (
        <>
            {clients.length === 0 && <NoDataMessage message="This contact is linked to all clients in the database" />}
            {clients.length > 0 &&
                <div className="form-container">
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">{selectedContactIds.length > 0 ? `${selectedContactIds.length} contact(s) selected` : "Available contacts"}</label>
                                {currentClients.map((c) => (
                                    <label key={c.id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedContactIds.includes(c.id)}
                                            onChange={() => handleCheckboxChange(c.id)}
                                        />
                                        {c.name} {c.clientCode}
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

export default LinkContactClientForm;
