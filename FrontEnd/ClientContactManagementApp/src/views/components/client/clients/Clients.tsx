import { observer } from 'mobx-react-lite';
import './Clients.css';
import { IClient } from '../../../../EndPoints/models/Client';
import { useEffect, useState } from 'react';
import Modal from '../../../../shared-components/modal/Modal';
import ClientsForm from '../client-form/ClientsForm';
import { useAppContext } from '../../../../context/Context';
import NoDataMessage from '../../../../shared-components/no-data/NoDataMessage';
import ViewClientContactForm from '../client-contact-link-component/ViewClientContactForm';
import { getNumberOfContacts } from './GetNumberOfContacts';
import Toolbar from '../../../../shared-components/toolbar/ToolBar';
import Pagination from '../../../../shared-components/pagination/Pagination';

interface IProps {
  clients: IClient[]; // Props for clients array
}

const Clients = observer(({ clients }: IProps) => {
  const { store, api } = useAppContext(); // Accessing MobX store and API context
  const [contactCounts, setContactCounts] = useState<any>({}); // State for contact counts
  const [isModalOpen, setIsModalOpen] = useState(false); // State for create client modal
  const [isModalOpenView, setIsModalOpenView] = useState(false); // State for view client modal

  // Function to open create client modal
  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  // Function to close create client modal
  const closeCreateModal = () => {
    setIsModalOpen(false);
    store.client.clearSelected(); // Clear selected client in MobX store
  };

  // Function to open view client modal
  const openCreateModalView = () => {
    setIsModalOpenView(true);
  };

  // Function to close view client modal
  const closeCreateModalView = () => {
    setIsModalOpenView(false);
    store.client.clearSelected(); // Clear selected client in MobX store
  };

  // Callback for create button click
  const onCreate = () => {
    openCreateModal();
  };

  // Callback to view client contacts
  const onViewContact = (client: IClient) => {
    store.client.select(client); // Select client in MobX store
    openCreateModalView();
  };

  // Function to delete a client
  const onDelete = async (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this client?");

    if (isConfirmed) {
      try {
        await api.client.delete(id); // Delete client using API
        await api.client.getAll(); // Refresh client list
      } catch (error) {
      }
    }
  };

  // Fetches and sets contact counts for each client
  useEffect(() => {
    async function fetchAllContactLengths() {
      const counts: any = {};
      for (const client of clients) {
        counts[client.id] = await getNumberOfContacts(client.id); // Fetch number of contacts for each client
      }
      setContactCounts(counts); // Set contact counts state
    }

    fetchAllContactLengths(); // Execute on component mount and when clients array changes
  }, [clients]);

  // Toolbar items configuration
  const leftItems = [<div key="1">List Of Clients</div>];
  const centerItems: JSX.Element[] = [];
  const rightItems = [
    <div key="1">
      <button className="btn btn-primary-outline" onClick={onCreate}>Create</button>
    </div>
  ];

  // pagination codes
  const itemsPerPage = 5; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = clients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = clients.slice(indexOfFirstItem, indexOfLastItem);
  // pagination codes

  return (
    <div className="clients-container">
      {/* Render toolbar with left, center, and right items */}
      <div style={{ marginBottom: "20px" }}>
        <Toolbar leftItems={leftItems} centerItems={centerItems} rightItems={rightItems} />
      </div>

      {/* Display message when no clients are found */}
      {clients.length === 0 && <NoDataMessage message={'No client(s) found'} />}

      {/* Render clients table */}
      {clients.length > 0 &&
        <div>
          <table className="clients-table">
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Name</th>
                <th>Client Code</th>
                <th style={{ textAlign: "center" }}>No. of linked contacts</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((client) => (
                <tr key={client.id}>
                  {/* <td>{client.id}</td> */}
                  <td>{client.name}</td>
                  <td>{client.clientCode}</td>
                  <td style={{ textAlign: "center" }}>
                    {contactCounts[client.id] !== undefined ? contactCounts[client.id] : 'Loading...'}
                  </td>
                  <td>
                    {/* Buttons for viewing details, deleting clients */}
                    <button className="btn btn-primary" onClick={() => onViewContact(client)}>Details</button>
                    <button className="btn btn-danger" onClick={() => onDelete(client.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      }

      {/* Modals for creating and viewing clients */}
      <Modal isOpen={isModalOpen} onClose={closeCreateModal}>
        <h2 className="section-title">Create Client</h2>
        <ClientsForm setCloseModal={setIsModalOpen} />
        <button className="btn btn-danger" onClick={closeCreateModal}>Close Modal</button>
      </Modal>
      <Modal isOpen={isModalOpenView} onClose={closeCreateModalView}>
        <h2 className="section-title">Client details and linked clients</h2>
        <ViewClientContactForm setCloseModal={setIsModalOpenView} />
        <button className="btn btn-danger" onClick={closeCreateModalView}>Close Modal</button>
      </Modal>
    </div>
  );
});

export default Clients;
