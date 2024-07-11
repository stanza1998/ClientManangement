import React, { useEffect, useState } from 'react';
import './ViewClientContactForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { IClientContact } from '../../../../EndPoints/models/ClientContact';
import TabComponent from '../../../../shared-components/Tab';
import { getClientContactsById } from '../../../../helper-functions/GetAllLinkedData';
import LinkClientContactForm from '../link-client-contact-form/LinkClientContactForm';
import NoDataMessage from '../../../../shared-components/NoDataMessage';


interface IProps {
    setCloseModal: (value: boolean) => void;

}



const ViewClientContactForm = observer(({ setCloseModal }: IProps) => {
    const { store, api } = useAppContext();
    const [client, setClient] = useState<IClient>({ ...defaultClient });
    const [contacts, setContacts] = useState<any[]>();


    const handleUnlinked = async (contactId: number) => {
        try {
            await api.clientContact.unlinkContactToClient(client.id, contactId);
            window.location.reload();
        } catch (error) {
        }
    };








    const onClose = () => {
        setClient({ ...defaultClient })
        store.client.clearSelected;
        setCloseModal(false)
    }


    useEffect(() => {
        const loadData = async () => {
            if (client) {
                const contacts = await getClientContactsById(client.id)

                setContacts(contacts)
            } else {

            }
        }
        loadData()
    }, [client])

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
                    <div>
                        <div className="form-group">
                            <p>Name: {client.name}</p>
                        </div>

                        <div className="form-group">
                            <p>Client Code: {client.clientCode}</p>
                        </div>

                    </div>
                </>
        },
        {
            label: 'Contacts', content:

                <>
                    <div >
                        <div className="form-group">
                            {contacts?.length === 0 && <NoDataMessage message='No Contact(s) found' />}
                            {contacts?.length > 0 &&
                                <>
                                    <label htmlFor="name">Available contacts:</label>
                                    <table className="clients-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Surname</th>
                                                <th>Email</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contacts?.map((c) => (
                                                <tr key={c.id}>
                                                    <td>{c.name}</td>
                                                    <td>{c.surname}</td>
                                                    <td>{c.email}</td>

                                                    <td>
                                                        <button onClick={() => handleUnlinked(c.id)}>Unlink Contact</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            }

                        </div>


                    </div>
                </>

        },
        {
            label: "Link to new Contact(s)",
            content: <LinkClientContactForm linkedContacts={contacts} />
        }
    ];




    return (
        <div className="form-container">
            <TabComponent tabs={tabs} />

        </div>
    );
});

export default ViewClientContactForm;
