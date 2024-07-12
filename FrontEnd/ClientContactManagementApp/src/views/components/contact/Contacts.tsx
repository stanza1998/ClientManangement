import { observer } from 'mobx-react-lite';
import './Contacts.css';
import { useEffect, useState } from 'react';
import { IContact } from '../../../EndPoints/models/Contact';
import { useAppContext } from '../../../context/Context';
import NoDataMessage from '../../../shared-components/NoDataMessage';
import Modal from '../../../shared-components/Modal';
import ContactsForm from './contact-form/ContactForm';
import Toolbar from '../../../shared-components/ToolBar';
import { getNumberOfClients } from '../client/clients/GetNumberOfContacts';
import ViewContactClientForm from './view-contact/ViewContactClientsForm';

interface IProps {
  contacts: IContact[]
}

const Contacts = observer(({ contacts }: IProps) => {
  const { store, api } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenLink, setIsModalOpenLink] = useState(false);
  const [cleintsCounts, setClientsCounts] = useState<any>({});

  useEffect(() => {
    async function fetchAllContactLengths() {
      const counts: any = {};
      for (const contact of contacts) {
        counts[contact.id] = await getNumberOfClients(contact.id);
      }
      setClientsCounts(counts);
    }

    fetchAllContactLengths();
  }, [contacts]);


  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
  };
  const openCreateModalLink = () => {
    setIsModalOpenLink(true);
  };

  const closeCreateModalLink = () => {
    setIsModalOpenLink(false);
  };

  const onCreate = () => {
    openCreateModal();
  }
  const onLinkContact = (contact: IContact) => {
    store.contact.select(contact);
    openCreateModalLink();
  }


  const onDelete = async (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this contact?");

    if (isConfirmed) {
      try {
        await api.contact.delete(id);
        await api.contact.getAll();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  const leftItems = [<div key="1">List Of Contacts</div>];
  const centerItems = [<div></div>];
  const rightItems = [<div key="1">
    <button className='btn btn-primary' onClick={onCreate}>Create</button>
  </div>];

  return (

    <div className="contacts-container">
      <div style={{ marginBottom: "20px" }}>
        <Toolbar leftItems={leftItems} centerItems={centerItems} rightItems={rightItems} />
      </div>


      {contacts.length === 0 && <NoDataMessage message={'No contact(s) found'} />}

      {contacts.length > 0 &&
        <table className="clients-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th style={{ textAlign: "center" }}># Linked clients</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                {/* <td>{contact.id}</td> */}
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.surname}</td>
                <td style={{ textAlign: "center" }}>
                  {cleintsCounts[contact.id] !== undefined ? cleintsCounts[contact.id] : 'Loading...'}
                </td>
                <td>
                  {/* <button onClick={() => onEdit(contact)} >Edit</button> */}
                  <button className='btn btn-primary' onClick={() => onLinkContact(contact)}>Details</button>
                  <button className='btn btn-danger' onClick={() => onDelete(contact.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }

      <Modal isOpen={isModalOpen} onClose={closeCreateModal}>
        <h2>Create contact</h2>
        <ContactsForm setCloseModal={setIsModalOpen} />
        <button className='btn btn-danger' onClick={closeCreateModal}>Close Modal</button>
      </Modal>
      <Modal isOpen={isModalOpenLink} onClose={closeCreateModalLink}>
        <h2>Create contact</h2>
        <ViewContactClientForm setCloseModal={setIsModalOpenLink} />
        <button className='btn btn-danger' onClick={closeCreateModalLink}>Close Modal</button>
      </Modal>
    </div>
  );
});

export default Contacts;
