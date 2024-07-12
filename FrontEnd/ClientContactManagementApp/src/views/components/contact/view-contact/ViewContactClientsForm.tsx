import { useEffect, useState } from 'react';
import './ViewContactClientForm.css';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../../../context/Context';
import { getContactClientsById } from '../../../../helper-functions/GetAllLinkedData';
import NoDataMessage from '../../../../shared-components/NoDataMessage';
import TabComponentSub from '../../../../shared-components/SubTab';
import LinkContactClientForm from '../Link-contact-client-form/LinkContactClientForm';
import { IContact, defaultContact } from '../../../../EndPoints/models/Contact';


interface IProps {
    setCloseModal: (value: boolean) => void;
}

const ViewContactClientForm = observer(({ setCloseModal }: IProps) => {
    const { store, api } = useAppContext();
    const [contact, setContact] = useState<IContact>({ ...defaultContact });
    const [clients, setClients] = useState<any[]>();


    const handleUnlinked = async (clientId: number) => {
        try {
            await api.clientContact.unlinkContactClientToContact(contact.id, clientId);
            window.location.reload();
        } catch (error) {
        }
    };




    useEffect(() => {
        const loadData = async () => {
            if (contact) {
                const clients = await getContactClientsById(contact.id)
                setClients(clients)
            } else {

            }
        }
        loadData()
    }, [contact])

    useEffect(() => {
        if (store.contact.selected) {
            setContact(store.contact.selected);
        } else {

        }
    }, [store.contact.selected])


    const tabs = [
        {
            label: 'General',
            content:
                <div className="general-info-container">
                    <h2>General Information</h2>
                    <div className="form-group">
                        <p><span>Full Name:</span> {contact.name}</p>
                    </div>
                    <div className="form-group">
                        <p><span>Email</span> {contact.email}</p>
                    </div>
                </div>
        },
        {
            label: 'Client(s)', content:
                <>
                    <div >
                        <div className="form-group">
                            {clients?.length === 0 && <NoDataMessage message='No Client(s) found' />}
                            {clients?.length > 0 &&
                                <div style={{ width: "100%" }}>
                                    <label htmlFor="name">Available contacts:</label>
                                    <table className="clients-table">
                                        <thead>
                                            <tr>
                                                {/* <th>ID</th> */}
                                                <th>Full Name</th>

                                                <th>Email</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clients?.map((c) => (
                                                <tr key={c.id}>
                                                    <td>{c.name}</td>
                                                    <td>{c.clientCode}</td>
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
            label: "Link to client(s)",
            content: <LinkContactClientForm linkedClients={clients} />
        }
    ];




    return (
        <TabComponentSub tabs={tabs} />
    );
});

export default ViewContactClientForm;
