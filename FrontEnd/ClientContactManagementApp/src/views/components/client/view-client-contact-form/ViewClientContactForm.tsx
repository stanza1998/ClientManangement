import React, { useEffect, useState } from 'react';
import './ViewClientContactForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { IClientContact } from '../../../../EndPoints/models/ClientContact';
import TabComponent from '../../../../shared-components/Tab';
import { getClientContactsById } from '../../../../helper-functions/GetAllLinkedData';


interface IProps {
    setCloseModal: (value: boolean) => void;
}

const ViewClientContactForm = observer(({ setCloseModal }: IProps) => {
    const { store, api } = useAppContext();
    const [client, setClient] = useState<IClient>({ ...defaultClient });
    const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);



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

    const contacts = getClientContactsById(client.id)
    console.log("🚀 ~ ViewClientContactForm ~ contacts:", contacts)

    useEffect(() => {
        if (store.client.selected) {
            setClient(store.client.selected);
        } else {

        }
    }, [store.client.selected])

    //tabs info

    const tabs = [
        {
            label: 'General Information',
            content:
                <>
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
                        <button type="submit" className="btn-submit">
                            Create Link(s)
                        </button>
                    </form>
                </>
        },
        {
            label: 'Contacts', content:

                <>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Available contacts:</label>
                            <table className="clients-table">
                                <thead>
                                    <tr>
                                        <th>Contact Name</th>
                                        <th>Contact Name</th>
                                        <th>Contact Name</th>
                                    </tr>
                                </thead>
                            </table>

                        </div>

                        <button type="submit" className="btn-submit">
                            Create Link(s)
                        </button>
                    </form>
                </>

        },
    ];




    return (
        <div className="form-container">
            <TabComponent tabs={tabs} />

        </div>
    );
});

export default ViewClientContactForm;
