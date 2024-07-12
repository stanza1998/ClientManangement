import React, { useEffect, useState } from 'react';
import './LinkClientContactForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { IClientContact } from '../../../../EndPoints/models/ClientContact';
import NoDataMessage from '../../../../shared-components/no-data/NoDataMessage';

interface IProps {
    setCloseModal?: (value: boolean) => void;
    linkedContacts: any[] | undefined;
}

const LinkClientContactForm = observer(({ setCloseModal, linkedContacts }: IProps) => {
    const { store, api } = useAppContext();
    const [client, setClient] = useState<IClient>({ ...defaultClient });
    const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);

    // Extract linked contact IDs if available, default to empty array
    const linkedContactIds = (linkedContacts ?? []).map(contact => contact.id);

    // Filter contacts that are not already linked
    const contacts = store.contact.all
        .filter((c) => !linkedContactIds.includes(c.asJson.id))
        .map((contact) => contact.asJson);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        for (const id of selectedContactIds) {
            const linkClientContact: IClientContact = {
                id: 0,
                clientId: client.id,
                contactId: id
            };
            try {
                await api.clientContact.linkContactToClient(linkClientContact.clientId, linkClientContact.contactId);
                onClose();
            } catch (error) {
                console.error('Error linking contact to client:', error);
            }
        }
        window.location.reload(); // Refresh the page (consider more optimal UX)

    };

    // Handle checkbox change
    const handleCheckboxChange = (id: number) => {
        setSelectedContactIds((prevSelectedIds) =>
            prevSelectedIds.includes(id)
                ? prevSelectedIds.filter((contactId) => contactId !== id)
                : [...prevSelectedIds, id]
        );
    };

    // Handle modal close
    const onClose = () => {
        setClient({ ...defaultClient });
        store.client.clearSelected(); // Clear selected client in MobX store
        if (setCloseModal) {
            setCloseModal(false);
        }
    };

    // Effect to set client when selected client changes
    useEffect(() => {
        if (store.client.selected) {
            setClient(store.client.selected);
        }
    }, [store.client.selected]);

    return (
        <div className="form-container">
            {/* Display message when no available contacts */}
            {contacts.length === 0 && <NoDataMessage message="This client is linked to all contacts in the database" />}

            {/* Render form if there are available contacts */}
            {contacts.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">
                            {selectedContactIds.length > 0 ? `${selectedContactIds.length} contact(s) selected` : "Available contacts"}
                        </label>
                        {contacts.map((c) => (
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
            )}
        </div>
    );
});

export default LinkClientContactForm;
