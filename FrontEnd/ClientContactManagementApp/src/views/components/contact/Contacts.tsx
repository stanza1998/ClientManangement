import { observer } from 'mobx-react-lite';
import './Contacts.css';
import { useEffect, useState } from 'react';
import { IContact } from '../../../EndPoints/models/Contact';
import { useAppContext } from '../../../context/Context';
import NoDataMessage from '../../../shared-components/no-data/NoDataMessage';
import Modal from '../../../shared-components/modal/Modal';
import ContactsForm from './contact-form/ContactForm';
import Toolbar from '../../../shared-components/toolbar/ToolBar';
import { getNumberOfClients } from '../client/clients/GetNumberOfContacts';
import ViewContactClientForm from './view-contact/ViewContactClientsForm';
import Pagination from '../../../shared-components/pagination/Pagination';

interface IProps {
  contacts: IContact[]
}

const Contacts = observer(({ contacts }: IProps) => {
  const { store, api } = useAppContext();

  // State to manage modal visibility for creating a contact
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to manage modal visibility for viewing contact-client details
  const [isModalOpenLink, setIsModalOpenLink] = useState(false);

  // State to store the number of linked clients for each contact
  const [clientsCounts, setClientsCounts] = useState<any>({});

  // Effect to fetch the number of clients linked to each contact on component mount or when contacts change
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

  // Function to open the create contact modal
  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the create contact modal
  const closeCreateModal = () => {
    setIsModalOpen(false);
  };

  // Function to open the link contact-client modal
  const openCreateModalLink = () => {
    setIsModalOpenLink(true);
  };

  // Function to close the link contact-client modal
  const closeCreateModalLink = () => {
    setIsModalOpenLink(false);
  };

  // Function to handle creating a new contact
  const onCreate = () => {
    openCreateModal();
  };

  // Function to handle viewing details of a contact and its linked clients
  const onLinkContact = (contact: IContact) => {
    store.contact.select(contact);
    openCreateModalLink();
  };

  // Function to handle deleting a contact
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

  // Toolbar items for the top bar (left, center, right)
  const leftItems = [<div key="1">List Of Contacts</div>];
  const centerItems = [<div></div>];
  const rightItems = [<div key="1">
    <button className='btn btn-primary' onClick={onCreate}>Create</button>
  </div>];

  // Rendering the component

  // pagination codes
  const itemsPerPage = 5; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = contacts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contacts.slice(indexOfFirstItem, indexOfLastItem);
  // pagination codes
  return (
    <div className="contacts-container">
      <div style={{ marginBottom: "20px" }}>
        <Toolbar leftItems={leftItems} centerItems={centerItems} rightItems={rightItems} />
      </div>

      {/* Displaying a message when no contacts are available */}
      {contacts.length === 0 && <NoDataMessage message={'No contact(s) found'} />}

      {/* Displaying contacts in a table */}
      {contacts.length > 0 &&
        <div>
          <table className="clients-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Surname</th>
                <th style={{ textAlign: "center" }}># Linked clients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.surname}</td>
                  <td style={{ textAlign: "center" }}>
                    {clientsCounts[contact.id] !== undefined ? clientsCounts[contact.id] : 'Loading...'}
                  </td>
                  <td>
                    <button className='btn btn-primary' onClick={() => onLinkContact(contact)}>Details</button>
                    <button className='btn btn-danger' onClick={() => onDelete(contact.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      }

      {/* Modal for creating a new contact */}
      <Modal isOpen={isModalOpen} onClose={closeCreateModal}>
        <h2>Create contact</h2>
        <ContactsForm setCloseModal={setIsModalOpen} />
        <button className='btn btn-danger' onClick={closeCreateModal}>Close Modal</button>
      </Modal>

      {/* Modal for viewing contact-client details */}
      <Modal isOpen={isModalOpenLink} onClose={closeCreateModalLink}>
        <h2>Contact details and linked clients</h2>
        <ViewContactClientForm setCloseModal={setIsModalOpenLink} />
        <button className='btn btn-danger' onClick={closeCreateModalLink}>Close Modal</button>
      </Modal>
    </div>
  );
});

export default Contacts;
