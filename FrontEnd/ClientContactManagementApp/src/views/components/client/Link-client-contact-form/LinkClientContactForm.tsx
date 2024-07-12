import React, { useEffect, useState } from 'react';
import './LinkClientContactForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { IClientContact } from '../../../../EndPoints/models/ClientContact';
import NoDataMessage from '../../../../shared-components/NoDataMessage';


interface IProps {
    setCloseModal?: (value: boolean) => void;
    linkedContacts: any[] | undefined;
}

const LinkClientContactForm = observer(({ setCloseModal, linkedContacts }: IProps) => {
    const { store, api } = useAppContext();
    const [client, setClient] = useState<IClient>({ ...defaultClient });
    const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);

    const linkedContactIds = (linkedContacts ?? []).map(contact => contact.id); // Providing a default empty array if linkedContacts is undefined

    const contacts = store.contact.all
        .filter((c) => !linkedContactIds.includes(c.asJson.id))
        .map((contact) => contact.asJson);


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
            }
        }
        window.location.reload();

    };



    const handleCheckboxChange = (id: number) => {
        setSelectedContactIds((prevSelectedIds) =>
            prevSelectedIds.includes(id)
                ? prevSelectedIds.filter((contactId) => contactId !== id)
                : [...prevSelectedIds, id]
        );
    };




    const onClose = () => {
        setClient({ ...defaultClient })
        store.client.clearSelected;
        if (setCloseModal) {
            setCloseModal(false)
        }
    }

    useEffect(() => {
        if (store.client.selected) {
            setClient(store.client.selected);
        } else {

        }
    }, [store.client.selected])

    return (
        <div className="form-container">
            {contacts.length === 0 && <NoDataMessage message="This client is linked to all contacts in the database" />}
            {contacts.length > 0 &&
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">{selectedContactIds.length > 0 ? `${selectedContactIds.length} contact(s) selected` : "Available contacts"}</label>
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
            }
        </div>
    );
});

export default LinkClientContactForm;
