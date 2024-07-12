import { useEffect, useState } from 'react';
import './ViewClientContactForm.css';
import { IClient, defaultClient } from '../../../../EndPoints/models/Client';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import TabComponent from '../../../../shared-components/Tab';
import { getClientContactsById } from '../../../../helper-functions/GetAllLinkedData';
import LinkClientContactForm from '../link-client-contact-form/LinkClientContactForm';
import NoDataMessage from '../../../../shared-components/NoDataMessage';
import TabComponentSub from '../../../../shared-components/SubTab';


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
            label: 'General',
            content:
                <div className="general-info-container">
                    <h2>General Information</h2>
                    <div className="form-group">
                        <p><span>Name:</span> {client.name}</p>
                    </div>
                    <div className="form-group">
                        <p><span>Client Code:</span> {client.clientCode}</p>
                    </div>
                </div>
        },
        {
            label: 'Contact(s)', content:
                <>
                    <div >
                        <div className="form-group">
                            {contacts?.length === 0 && <NoDataMessage message='No Contact(s) found' />}
                            {contacts?.length > 0 &&
                                <div style={{ width: "100%" }}>
                                    <label htmlFor="name">Available contacts:</label>
                                    <table className="clients-table">
                                        <thead>
                                            <tr>
                                                {/* <th>ID</th> */}
                                                <th>Client Full Name</th>

                                                <th>Email</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contacts?.map((c) => (
                                                <tr key={c.id}>
                                                    <td>{`${c.name} ${c.surname}`}</td>
                                                    <td>{c.email}</td>
                                                    <td>
                                                        <a href='' onClick={() => handleUnlinked(c.id)}>unlink contact</a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </>

        },
        {
            label: "Link to contact",
            content: <LinkClientContactForm linkedContacts={contacts} />
        }
    ];




    return (
        <TabComponentSub tabs={tabs} />
    );
});

export default ViewClientContactForm;
