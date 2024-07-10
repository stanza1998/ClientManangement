import { observer } from 'mobx-react-lite';
import './Contacts.css';
import { useState } from 'react';
import { IContact } from '../../../EndPoints/models/Contact';
import { useAppContext } from '../../../context/Context';
import NoDataMessage from '../../../shared-components/NoDataMessage';
import Modal from '../../../shared-components/Modal';
import ContactsForm from './contact-form/ContactForm';

interface IProps {
  contacts: IContact[]
}

const Contacts = observer(({ contacts }: IProps) => {
  const { store, api } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenLink, setIsModalOpenLink] = useState(false);

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



  return (

    <div className="contacts-container">
      <div>
        <h4>List Of contacts</h4>
        <button onClick={onCreate}>Create</button>
      </div>

      {contacts.length === 0 && <NoDataMessage message={'No contact(s) found'} />}

      {contacts.length > 0 &&
        <table className="contacts-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th># Linked clients</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.surname}</td>
                <td>34</td>
                <td>
                  {/* <button onClick={() => onEdit(contact)} >Edit</button> */}
                  <button onClick={() => onDelete(contact.id)}>Delete</button>
                  <button onClick={() => onLinkContact(contact)}>link to contact</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }

      <Modal isOpen={isModalOpen} onClose={closeCreateModal}>
        <h2>Create contact</h2>
        <ContactsForm setCloseModal={setIsModalOpen} />
        <button onClick={closeCreateModal}>Close Modal</button>
      </Modal>
      <Modal isOpen={isModalOpenLink} onClose={closeCreateModalLink}>
        <h2>Create contact</h2>
        {/* <LinkcontactContactForm setCloseModal={setIsModalOpenLink} /> */}
        <button onClick={closeCreateModalLink}>Close Modal</button>
      </Modal>
    </div>
  );
});

export default Contacts;
