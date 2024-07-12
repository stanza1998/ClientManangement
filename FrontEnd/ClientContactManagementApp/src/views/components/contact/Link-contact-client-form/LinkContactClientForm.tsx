import React, { useEffect, useState } from 'react';
import './LinkContactClientForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { IClientContact } from '../../../../EndPoints/models/ClientContact';
import NoDataMessage from '../../../../shared-components/NoDataMessage';
import { IContact, defaultContact } from '../../../../EndPoints/models/Contact';


interface IProps {
    setCloseModal?: (value: boolean) => void;
    linkedClients: any[] | undefined;
}

const LinkContactClientForm = observer(({ setCloseModal, linkedClients }: IProps) => {
    const { store, api } = useAppContext();
    const [contact, setContact] = useState<IContact>({ ...defaultContact });
    const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);

    const linkedClientsIds = (linkedClients ?? []).map(contact => contact.id); // Providing a default empty array if linkedClients is undefined

    const clients = store.client.all
        .filter((c) => !linkedClientsIds.includes(c.asJson.id))
        .map((contact) => contact.asJson);

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
        setContact({ ...defaultContact })
        store.client.clearSelected;
        if (setCloseModal) {
            setCloseModal(false)
        }
    }

    useEffect(() => {
        if (store.contact.selected) {
            setContact(store.contact.selected);
        } else {

        }
    }, [store.client.selected])

    return (
        <div className="form-container">
            {clients.length === 0 && <NoDataMessage message="This contact is linked to all clients in the database" />}
            {clients.length > 0 &&
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">{selectedContactIds.length > 0 ? `${selectedContactIds.length} contact(s) selected` : "Available contacts"}</label>
                        {clients.map((c) => (
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
            }
        </div>
    );
});

export default LinkContactClientForm;
