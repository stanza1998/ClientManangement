import React, { useEffect, useState } from 'react';
import './LinkClientContactForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { IClientContact } from '../../../../EndPoints/models/ClientContact';


interface IProps {
    setCloseModal: (value: boolean) => void;
}

const LinkClientContactForm = observer(({ setCloseModal }: IProps) => {
    const { store, api } = useAppContext();
    const [client, setClient] = useState<IClient>({ ...defaultClient });
    const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
    console.log("🚀 ~ LinkClientContactForm ~ selectedContactIds:", selectedContactIds)


    const contacts = store.contact.all.map((contact) => { return contact.asJson })


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
                console.log("error create");

            }
        }

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
        setCloseModal(false)
    }

    useEffect(() => {
        if (store.client.selected) {
            setClient(store.client.selected);
        } else {

        }
    }, [store.client.selected])

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={client.name}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Client Code:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={client.clientCode}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Available contacts:</label>
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

                <button type="submit" className="btn-submit">
                    Create Link(s)
                </button>
            </form>
        </div>
    );
});

export default LinkClientContactForm;
